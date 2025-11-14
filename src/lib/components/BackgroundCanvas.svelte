<script lang="ts">
  import { onMount } from "svelte";

  /**
   * CONSTANTS
   */
  const MAX_CLICKS = 100;
  const PIXEL_SIZE = 2.0;

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
  const clickPositions = new Float32Array(MAX_CLICKS * 2); // x, y pairs
  const clickTimes = new Float32Array(MAX_CLICKS);

  // Touch/drag state
  let isHolding = false;

  // Uniforms
  let uniforms: {
    uResolution: WebGLUniformLocation | null;
    uTime: WebGLUniformLocation | null;
    uClickPos: WebGLUniformLocation | null;
    uClickTimes: WebGLUniformLocation | null;
    uColorA: WebGLUniformLocation | null;
    uColorB: WebGLUniformLocation | null;
    uPixelSize: WebGLUniformLocation | null;
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
#ifdef GL_OES_standard_derivatives
#extension GL_OES_standard_derivatives : enable
#endif

precision highp float;

uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec2 uResolution;
uniform float uTime;
uniform float uPixelSize;

uniform vec2 uClickPos[${MAX_CLICKS}];
uniform float uClickTimes[${MAX_CLICKS}];

const int MAX_CLICKS = ${MAX_CLICKS};

// fBm constants
const int FBM_OCTAVES = 6;
const float FBM_LACUNARITY = 1.125;
const float FBM_GAIN = 1.0;
const float FBM_SCALE = 2.0;

// Bayer matrix helpers (for subtle dithering)
float Bayer2(vec2 a) { a = floor(a); return fract(a.x / 2.0 + a.y * a.y * 0.75); }
float Bayer4(vec2 a) { return Bayer2(0.5 * a) * 0.25 + Bayer2(a); }
float Bayer8(vec2 a) { return Bayer4(0.5 * a) * 0.25 + Bayer2(a); }

// 1-D hash and 3-D value-noise helpers
float hash11(float n) {
    return fract(sin(n) * 43758.5453);
}

float vnoise(vec3 p) {
    vec3 ip = floor(p);
    vec3 fp = fract(p);

    float n000 = hash11(dot(ip + vec3(0.0,0.0,0.0), vec3(1.0,57.0,113.0)));
    float n100 = hash11(dot(ip + vec3(1.0,0.0,0.0), vec3(1.0,57.0,113.0)));
    float n010 = hash11(dot(ip + vec3(0.0,1.0,0.0), vec3(1.0,57.0,113.0)));
    float n110 = hash11(dot(ip + vec3(1.0,1.0,0.0), vec3(1.0,57.0,113.0)));
    float n001 = hash11(dot(ip + vec3(0.0,0.0,1.0), vec3(1.0,57.0,113.0)));
    float n101 = hash11(dot(ip + vec3(1.0,0.0,1.0), vec3(1.0,57.0,113.0)));
    float n011 = hash11(dot(ip + vec3(0.0,1.0,1.0), vec3(1.0,57.0,113.0)));
    float n111 = hash11(dot(ip + vec3(1.0,1.0,1.0), vec3(1.0,57.0,113.0)));

    vec3 w = fp*fp*fp*(fp*(fp*6.0-15.0)+10.0);

    float x00 = mix(n000, n100, w.x);
    float x10 = mix(n010, n110, w.x);
    float x01 = mix(n001, n101, w.x);
    float x11 = mix(n011, n111, w.x);

    float y0 = mix(x00, x10, w.y);
    float y1 = mix(x01, x11, w.y);

    return mix(y0, y1, w.z) * 2.0 - 1.0;
}

// Stable fBm
float fbm2(vec2 uv, float t) {
    vec3 p = vec3(uv * FBM_SCALE, t);
    float amp = 1.0;
    float freq = 1.0;
    float sum = 1.0;

    for (int i = 0; i < FBM_OCTAVES; ++i) {
        sum += amp * vnoise(p * freq);
        freq *= FBM_LACUNARITY;
        amp *= FBM_GAIN;
    }

    return sum * 0.5 + 0.5;
}

// Smooth remap helper
float remap(float v, float a, float b) { return clamp((v - a) / max(b - a, 1e-5), 0.0, 1.0); }

void main() {
    float pixelSize = uPixelSize;
    vec2 fragCoord = gl_FragCoord.xy;

    float aspectRatio = uResolution.x / max(uResolution.y, 1.0);

    // Voxel-like sampling to reduce aliasing and cost
    vec2 pixelId = floor(fragCoord / pixelSize);
    vec2 uv = (pixelId * pixelSize) / uResolution * vec2(aspectRatio, 1.0);

    // Animated fbm field
    float field = fbm2(uv * 1.0, uTime * 0.08);

    // Ripple clicks blended into the field
    const float speed = 0.35;
    const float thickness = 0.12;
    const float dampT = 1.0;
    const float dampR = 8.0;

    for (int i = 0; i < MAX_CLICKS; ++i) {
        vec2 pos = uClickPos[i];
        if (pos.x < 0.0) continue;

        vec2 cuv = pos / uResolution * vec2(aspectRatio, 1.0);
        float t = max(uTime - uClickTimes[i], 0.0);
        float r = distance(uv, cuv);

        float waveR = speed * t;
        float ring = exp(-pow((r - waveR) / thickness, 2.0));
        float atten = exp(-dampT * t) * exp(-dampR * r);
        field = max(field, ring * atten);
    }

    // Contrast and bias for aesthetic range between the two colors
    float dither = Bayer8(fragCoord / max(uPixelSize, 1.0)) - 0.5;
    float m = remap(field + 0.06 * dither, 0.2, 0.9);

    vec3 color = mix(uColorB, uColorA, smoothstep(0.0, 1.0, m));
    gl_FragColor = vec4(color, 1.0);
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
    const context =
      canvas.getContext("webgl2", {
        alpha: true,
        premultipliedAlpha: false,
      }) ||
      canvas.getContext("webgl", {
        alpha: true,
        premultipliedAlpha: false,
      });
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

    // Enable alpha blending for transparency
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

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
      uColorA: gl.getUniformLocation(program, "uColorA"),
      uColorB: gl.getUniformLocation(program, "uColorB"),
      uPixelSize: gl.getUniformLocation(program, "uPixelSize"),
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

    const devicePixelRatio = window.devicePixelRatio || 1;
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    // Account for device pixel ratio for consistent sizing across browsers
    const bufferWidth = Math.floor(displayWidth * devicePixelRatio);
    const bufferHeight = Math.floor(displayHeight * devicePixelRatio);

    if (canvas.width !== bufferWidth || canvas.height !== bufferHeight) {
      canvas.width = bufferWidth;
      canvas.height = bufferHeight;
      gl.viewport(0, 0, bufferWidth, bufferHeight);

      // Update resolution uniform with buffer dimensions
      if (uniforms.uResolution) {
        gl.uniform2f(uniforms.uResolution, bufferWidth, bufferHeight);
      }
    }
  };

  /**
   * Handle mouse/touch clicks with throttling for continuous effects
   */
  const handleClick = (clientX: number, clientY: number): void => {
    if (!canvas) return;

    const currentTime = performance.now();

    const rect = canvas.getBoundingClientRect();
    const cssX = clientX - rect.left;
    const cssY = clientY - rect.top;

    // Convert to frame-buffer pixels accounting for device pixel ratio
    const devicePixelRatio = window.devicePixelRatio || 1;
    const fragX = cssX * devicePixelRatio;
    const fragY = (rect.height - cssY) * devicePixelRatio;

    // Store click position and time
    clickPositions[clickIndex * 2] = fragX;
    clickPositions[clickIndex * 2 + 1] = fragY;
    clickTimes[clickIndex] = (currentTime - startTime) / 1000;

    clickIndex = (clickIndex + 1) % MAX_CLICKS;
  };

  /**
   * Mouse event handlers
   */
  const handleMouseDown = (e: MouseEvent): void => {
    isHolding = true;
    handleClick(e.clientX, e.clientY); // Force first click
  };

  const handleMouseMove = (e: MouseEvent): void => {
    if (isHolding) {
      handleClick(e.clientX, e.clientY);
    }
  };

  const handleMouseUp = (_e: MouseEvent): void => {
    isHolding = false;
  };

  /**
   * Touch event handlers
   */
  const handleTouchStart = (e: TouchEvent): void => {
    e.preventDefault();
    if (e.touches.length > 0) {
      isHolding = true;
      const touch = e.touches[0];
      handleClick(touch.clientX, touch.clientY); // Force first click
    }
  };

  const handleTouchMove = (e: TouchEvent): void => {
    e.preventDefault();
    if (isHolding && e.touches.length > 0) {
      const touch = e.touches[0];
      handleClick(touch.clientX, touch.clientY);
    }
  };

  const handleTouchEnd = (e: TouchEvent): void => {
    e.preventDefault();
    isHolding = false;
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

    // Colors
    // Zed's blue (#084CCF) and deep neutral (#0873cf)
    if (uniforms.uColorA) {
      gl.uniform3f(uniforms.uColorA, 8 / 255, 76 / 255, 207 / 255);
    }
    if (uniforms.uColorB) {
      gl.uniform3f(uniforms.uColorB, 8 / 255, 115 / 255, 207 / 255);
    }

    if (uniforms.uPixelSize) {
      gl.uniform1f(uniforms.uPixelSize, PIXEL_SIZE);
    }

    // Clear and draw
    // gl.clearColor(0.137, 0.145, 0.165, 1.0); // fallback clear to #23252A
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

    // Only touch events need imperative listeners for passive: false
    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      // Clean up touch events
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);

      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  });
</script>

<svelte:window
  onmousemove={handleMouseMove}
  onmouseup={handleMouseUp}
  onresize={resizeCanvas}
/>

<canvas
  bind:this={canvas}
  class="background-canvas"
  onmousedown={handleMouseDown}
></canvas>

<style lang="scss">
  .background-canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #0751cf; // Blue background

    pointer-events: auto;
  }
</style>
