<script lang="ts">
import { onMount } from "svelte";

/**
 * CONSTANTS
 */
const MAX_CLICKS = 10;
const PIXEL_SIZE = 4.0;

/**
 * VARIABLES
 */
// Canvas and WebGL context
let canvas: HTMLCanvasElement;
let gl: WebGLRenderingContext | WebGL2RenderingContext;
let program: WebGLProgram;

// Animation frame ID for cleanup
let animationId: number;
let startTime: number;

// Click tracking
let clickIndex = 0;
let clickPositions = new Float32Array(MAX_CLICKS * 2); // x, y pairs
let clickTimes = new Float32Array(MAX_CLICKS);

// Uniforms
let uniforms: {
  uResolution: WebGLUniformLocation | null;
  uTime: WebGLUniformLocation | null;
  uClickPos: WebGLUniformLocation | null;
  uClickTimes: WebGLUniformLocation | null;
};

/**
 * SHADERS
 */
const vertexShaderSource = `
attribute vec2 a_position;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const fragmentShaderSource = `
precision mediump float;

uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uClickPos[${MAX_CLICKS}];
uniform float uClickTimes[${MAX_CLICKS}];

const int MAX_CLICKS = ${MAX_CLICKS};
const float PIXEL_SIZE = ${PIXEL_SIZE.toFixed(1)};

// Bayer matrix helpers
float Bayer2(vec2 a) {
    a = floor(a);
    return fract(a.x / 2.0 + a.y * a.y * 0.75);
}

float Bayer4(vec2 a) {
    return Bayer2(0.5 * a) * 0.25 + Bayer2(a);
}

float Bayer8(vec2 a) {
    return Bayer4(0.5 * a) * 0.25 + Bayer2(a);
}

void main() {
    float pixelSize = PIXEL_SIZE;
    vec2 fragCoord = gl_FragCoord.xy - uResolution * 0.5;

    // Calculate the UV coordinates for the grid
    float aspectRatio = uResolution.x / uResolution.y;

    float cellPixelSize = 8.0 * pixelSize;
    vec2 cellId = floor(fragCoord / cellPixelSize);
    vec2 cellCoord = cellId * cellPixelSize;

    vec2 uv = ((cellCoord / uResolution)) * vec2(aspectRatio, 1.0);

    float feed = 0.0;

    const float speed = 0.30;      // wave-front speed
    const float thickness = 0.10;  // half-width of bright ring
    const float dampT = 1.0;       // time attenuation
    const float dampR = 1.0;       // radial attenuation

    for (int i = 0; i < MAX_CLICKS; ++i) {
        vec2 pos = uClickPos[i];
        if (pos.x < 0.0 && pos.y < 0.0) continue; // skip empty clicks

        vec2 cuv = (((pos - uResolution * 0.5 - cellPixelSize * 0.5) / uResolution)) * vec2(aspectRatio, 1.0);

        float t = max(uTime - uClickTimes[i], 0.0);
        float r = distance(uv, cuv);

        float waveR = speed * t;
        float ring = exp(-pow((r - waveR) / thickness, 2.0));
        float atten = exp(-dampT * t) * exp(-dampR * r);

        feed = max(feed, ring * atten);
    }

        float bayerValue = Bayer8(fragCoord / pixelSize) - 0.5;
    float bw = step(0.5, feed + bayerValue);

    // Use blue #0751cf as background and cream #eceadf as effect color
    vec3 backgroundColor = vec3(0.027, 0.318, 0.812); // #0751cf
    vec3 effectColor = vec3(0.925, 0.918, 0.875);     // #eceadf

    gl_FragColor = vec4(mix(backgroundColor, effectColor, bw), 1.0);
}
`;

/**
 * FUNCTIONS
 */
/**
 * Create and compile a shader
 */
const createShader = (
  gl: WebGLRenderingContext,
  type: number,
  source: string,
): WebGLShader | null => {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compilation error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
};

/**
 * Create shader program
 */
const createProgram = (
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader,
): WebGLProgram | null => {
  const program = gl.createProgram();
  if (!program) return null;

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Program linking error:", gl.getProgramInfoLog(program));

    return null;
  }

  return program;
};

/**
 * Initialize WebGL and shaders
 */
const initializeWebGL = (): boolean => {
  const context = canvas.getContext("webgl2") || canvas.getContext("webgl");
  if (!context) {
    console.error("WebGL not supported");

    return false;
  }

  gl = context;

  // Create shaders
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource,
  );

  if (!vertexShader || !fragmentShader) {
    return false;
  }

  // Create program
  const createdProgram = createProgram(gl, vertexShader, fragmentShader);
  if (!createdProgram) {
    return false;
  }

  program = createdProgram;
  gl.useProgram(program);

  // Set up geometry (fullscreen quad)
  const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const positionLocation = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  // Get uniform locations
  uniforms = {
    uResolution: gl.getUniformLocation(program, "uResolution"),
    uTime: gl.getUniformLocation(program, "uTime"),
    uClickPos: gl.getUniformLocation(program, "uClickPos"),
    uClickTimes: gl.getUniformLocation(program, "uClickTimes"),
  };

  // Initialize click arrays with invalid positions
  for (let i = 0; i < MAX_CLICKS; i++) {
    clickPositions[i * 2] = -1;
    clickPositions[i * 2 + 1] = -1;
    clickTimes[i] = 0;
  }

  return true;
};

/**
 * Resize canvas and update WebGL viewport
 */
const resizeCanvas = (): void => {
  if (!canvas || !gl) return;

  const displayWidth = canvas.clientWidth;
  const displayHeight = canvas.clientHeight;

  if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
    canvas.width = displayWidth;
    canvas.height = displayHeight;
    gl.viewport(0, 0, displayWidth, displayHeight);

    // Update resolution uniform
    if (uniforms.uResolution) {
      gl.uniform2f(uniforms.uResolution, displayWidth, displayHeight);
    }
  }
};

/**
 * Handle mouse/touch clicks
 */
const handleClick = (clientX: number, clientY: number): void => {
  if (!canvas) return;

  const rect = canvas.getBoundingClientRect();
  const cssX = clientX - rect.left;
  const cssY = clientY - rect.top;

  // Convert to frame-buffer pixels
  const fragX = (cssX * canvas.width) / rect.width;
  const fragY = ((rect.height - cssY) * canvas.height) / rect.height;

  // Store click position and time
  clickPositions[clickIndex * 2] = fragX;
  clickPositions[clickIndex * 2 + 1] = fragY;
  clickTimes[clickIndex] = (performance.now() - startTime) / 1000;

  clickIndex = (clickIndex + 1) % MAX_CLICKS;
};

/**
 * Mouse event handlers
 */
const handleMouseDown = (e: MouseEvent): void => {
  handleClick(e.clientX, e.clientY);
};

/**
 * Touch event handlers
 */
const handleTouchStart = (e: TouchEvent): void => {
  e.preventDefault();
  if (e.touches.length > 0) {
    const touch = e.touches[0];
    handleClick(touch.clientX, touch.clientY);
  }
};

/**
 * Main animation loop
 */
const animate = (): void => {
  if (!gl || !program) return;

  const currentTime = (performance.now() - startTime) / 1000;

  // Update uniforms
  if (uniforms.uTime) {
    gl.uniform1f(uniforms.uTime, currentTime);
  }

  if (uniforms.uClickPos) {
    gl.uniform2fv(uniforms.uClickPos, clickPositions);
  }

  if (uniforms.uClickTimes) {
    gl.uniform1fv(uniforms.uClickTimes, clickTimes);
  }

  // Clear and draw
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  animationId = requestAnimationFrame(animate);
};

/**
 * Initialize everything
 */
const initialize = (): void => {
  try {
    if (!initializeWebGL()) {
      throw new Error("Failed to initialize WebGL");
    }

    startTime = performance.now();
    resizeCanvas();
    animate();
  } catch (error) {
    console.error(
      `[BackgroundCanvas] failed to initialize WebGL object. Error: ${error}`,
    );
  }
};

onMount(() => {
  if (typeof window === "undefined") return;

  initialize();

  window.addEventListener("resize", resizeCanvas);
  canvas.addEventListener("mousedown", handleMouseDown);
  canvas.addEventListener("touchstart", handleTouchStart, { passive: false });

  return () => {
    window.removeEventListener("resize", resizeCanvas);
    canvas.removeEventListener("mousedown", handleMouseDown);
    canvas.removeEventListener("touchstart", handleTouchStart);

    if (animationId) {
      cancelAnimationFrame(animationId);
    }
  };
});
</script>

<canvas
    bind:this={canvas}
    class="background-canvas"
></canvas>

<style lang="scss">
  .background-canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    pointer-events: auto;
    cursor: pointer;
  }
</style> 