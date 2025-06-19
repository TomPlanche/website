<script lang="ts">
/**
 * TODO: Fix resizing issues with the canvas.
 */
import { onMount } from "svelte";

/**
 * TYPES
 */
interface ColorStop {
  threshold: number;
  color: string;
}

interface SimulationConfig {
  damping: number;
  waveSpeedMultiplier: number;
  neighborInfluence: number;
  minWaveValue: number;
  maxWaveValue: number;
}

/**
 * CONSTANTS
 */
const GRID_SIZE = {
  columns: 100,
  rows: 100,
} as const;

const SCANLINES = {
  enabled: false,
  opacity: 0.1,
  spacing: 2,
} as const;

const SIMULATION_CONFIG: SimulationConfig = {
  damping: 0.975,
  waveSpeedMultiplier: 0.02,
  neighborInfluence: 0.01,
  minWaveValue: 0.01,
  maxWaveValue: 1.0,
} as const;

const PALETTE: ColorStop[] = [
  { threshold: 0.0, color: "#002b36" },
  { threshold: 0.2, color: "#45c6ff" },
  { threshold: 0.4, color: "#8a4df8" },
  { threshold: 0.6, color: "#ff3ca5" },
  { threshold: 0.8, color: "#ff7e4f" },
];

/**
 * VARIABLES
 */
// Canvas references
let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let offCanvas: HTMLCanvasElement;
let offCtx: CanvasRenderingContext2D;

// Typed arrays for simulation buffers
let current = new Float32Array(GRID_SIZE.columns * GRID_SIZE.rows);
let previous = new Float32Array(GRID_SIZE.columns * GRID_SIZE.rows);

// Mouse/touch tracking variables
let mouseX = $state(0);
let mouseY = $state(0);
let lastMouseX = $state(0);
let lastMouseY = $state(0);
let isMouseDown = $state(false);

// Animation frame ID for cleanup
let animationId: number;

/**
 * FUNCTIONS
 */
/**
 * Get 8-bit color based on value
 *
 * @param value {number} - Value between 0 and 1
 * @return {string} - Hex color string
 */
const get8bitColor = (value: number): string => {
  const clampedValue = Math.min(Math.max(value, 0), 1);

  for (let i = PALETTE.length - 1; i >= 0; i--) {
    if (clampedValue >= PALETTE[i].threshold) {
      return PALETTE[i].color;
    }
  }

  return PALETTE[0].color;
};

/**
 * Resize the canvas to fill the window.
 */
const resizeCanvas = (): void => {
  if (!canvas) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};

/**
 * Convert client coordinates to simulation coordinates.
 *
 * @param clientX {number} - X coordinate in client space
 * @param clientY {number} - Y coordinate in client space
 * @return {Object} - Object containing simX and simY
 * @property {number} simX - X coordinate in simulation space
 * @property {number} simY - Y coordinate in simulation space
 */
const getSimCoords = (
  clientX: number,
  clientY: number,
): { simX: number; simY: number } => {
  const rect = canvas.getBoundingClientRect();

  const x = clientX - rect.left;
  const y = clientY - rect.top;

  const simX = Math.floor((x / canvas.width) * GRID_SIZE.columns);
  const simY = Math.floor((y / canvas.height) * GRID_SIZE.rows);

  return { simX, simY };
};

/**
 * Handle mouse movement to update wave simulation.
 *
 * @param e {MouseEvent} - The mouse event containing client coordinates
 */
const handleMouseMove = (e: MouseEvent): void => {
  lastMouseX = mouseX;
  lastMouseY = mouseY;
  mouseX = e.clientX;
  mouseY = e.clientY;

  const { simX, simY } = getSimCoords(e.clientX, e.clientY);
  if (
    simX >= 0 &&
    simX < GRID_SIZE.columns &&
    simY >= 0 &&
    simY < GRID_SIZE.rows
  ) {
    const index = simY * GRID_SIZE.columns + simX;
    const speed = Math.sqrt(
      (mouseX - lastMouseX) ** 2 + (mouseY - lastMouseY) ** 2,
    );

    if (speed > 0) {
      current[index] = Math.min(
        SIMULATION_CONFIG.maxWaveValue,
        current[index] + speed * SIMULATION_CONFIG.waveSpeedMultiplier,
      );

      // Affect neighboring cells
      if (simX > 0)
        current[index - 1] = Math.min(
          SIMULATION_CONFIG.maxWaveValue,
          current[index - 1] + speed * SIMULATION_CONFIG.neighborInfluence,
        );
      if (simX < GRID_SIZE.columns - 1)
        current[index + 1] = Math.min(
          SIMULATION_CONFIG.maxWaveValue,
          current[index + 1] + speed * SIMULATION_CONFIG.neighborInfluence,
        );
      if (simY > 0)
        current[index - GRID_SIZE.columns] = Math.min(
          SIMULATION_CONFIG.maxWaveValue,
          current[index - GRID_SIZE.columns] +
            speed * SIMULATION_CONFIG.neighborInfluence,
        );
      if (simY < GRID_SIZE.rows - 1)
        current[index + GRID_SIZE.columns] = Math.min(
          SIMULATION_CONFIG.maxWaveValue,
          current[index + GRID_SIZE.columns] +
            speed * SIMULATION_CONFIG.neighborInfluence,
        );
    }
  }
};

/**
 * Handle mouse down to start wave simulation.
 *
 * @param e {MouseEvent} - The mouse event
 */
const handleMouseDown = (e: MouseEvent): void => {
  isMouseDown = true;
  handleMouseMove(e);
};

/**
 * Handle mouse up to stop wave simulation.
 *
 * @param _e {MouseEvent} - The mouse event
 */
const handleMouseUp = (_e: MouseEvent): void => {
  isMouseDown = false;
};

/**
 * Handle touch movement to update wave simulation.
 *
 * @param e {TouchEvent} - The touch event containing client coordinates
 */
const handleTouchMove = (e: TouchEvent): void => {
  e.preventDefault();
  if (e.touches.length > 0) {
    const touch = e.touches[0];
    lastMouseX = mouseX;
    lastMouseY = mouseY;
    mouseX = touch.clientX;
    mouseY = touch.clientY;
    isMouseDown = true;
  }
};

/**
 * Handle touch start to initialize wave simulation.
 *
 * @param e {TouchEvent} - The touch event containing client coordinates
 */
const handleTouchStart = (e: TouchEvent): void => {
  if (e.touches.length > 0) {
    const touch = e.touches[0];
    mouseX = touch.clientX;
    mouseY = touch.clientY;
    isMouseDown = true;
  }
};

/**
 * Handle touch end to stop wave simulation.
 *
 * @param e {TouchEvent} - The touch event
 */
const handleTouchEnd = (e: TouchEvent): void => {
  e.preventDefault();
  isMouseDown = false;
};

/**
 * Update the wave simulation by calculating new wave values.
 * Uses a simple wave equation to propagate waves through the grid.
 */
const updateWaves = (): void => {
  for (let i = 1; i < GRID_SIZE.rows - 1; i++) {
    for (let j = 1; j < GRID_SIZE.columns - 1; j++) {
      const index = i * GRID_SIZE.columns + j;
      const north = current[index - GRID_SIZE.columns];
      const south = current[index + GRID_SIZE.columns];
      const east = current[index + 1];
      const west = current[index - 1];

      previous[index] =
        ((north + south + east + west) / 2 - previous[index]) *
        SIMULATION_CONFIG.damping;
    }
  }

  // Dampen boundaries
  for (let i = 0; i < GRID_SIZE.rows; i++) {
    const leftIndex = i * GRID_SIZE.columns;
    const rightIndex = i * GRID_SIZE.columns + (GRID_SIZE.columns - 1);
    current[leftIndex] *= SIMULATION_CONFIG.damping;
    current[rightIndex] *= SIMULATION_CONFIG.damping;
  }
  for (let j = 0; j < GRID_SIZE.columns; j++) {
    current[j] *= SIMULATION_CONFIG.damping;
    current[(GRID_SIZE.rows - 1) * GRID_SIZE.columns + j] *=
      SIMULATION_CONFIG.damping;
  }

  [current, previous] = [previous, current];
};

/**
 * Render the current state of the wave simulation to the offscreen canvas.
 * Converts wave values to colors using the palette and adds mouse interaction effects.
 */
const renderSimulation = (): void => {
  offCtx.fillStyle = PALETTE[0].color;
  offCtx.fillRect(0, 0, GRID_SIZE.columns, GRID_SIZE.rows);

  for (let i = 0; i < GRID_SIZE.rows; i++) {
    for (let j = 0; j < GRID_SIZE.columns; j++) {
      const index = i * GRID_SIZE.columns + j;
      let value = Math.abs(current[index]);
      if (value > SIMULATION_CONFIG.minWaveValue) {
        offCtx.fillStyle = get8bitColor(
          Math.min(value, SIMULATION_CONFIG.maxWaveValue),
        );
        offCtx.fillRect(j, i, 1, 1);
      }
    }
  }

  if (isMouseDown) {
    const { simX, simY } = getSimCoords(mouseX, mouseY);
    if (
      simX >= 0 &&
      simX < GRID_SIZE.columns &&
      simY >= 0 &&
      simY < GRID_SIZE.rows
    ) {
      offCtx.strokeStyle = "white";
      offCtx.lineWidth = 1;
      offCtx.strokeRect(simX, simY, 1, 1);
      const index = simY * GRID_SIZE.columns + simX;
      current[index] = SIMULATION_CONFIG.maxWaveValue;
    }
  }
};

/**
 * Draw the simulation to the main canvas.
 * Includes scanlines effect for a retro look.
 */
const drawScreen = (): void => {
  ctx.drawImage(offCanvas, 0, 0, canvas.width, canvas.height);

  if (SCANLINES.enabled) {
    ctx.fillStyle = `rgba(0, 0, 0, ${SCANLINES.opacity})`;
    for (let i = 0; i < canvas.height; i += SCANLINES.spacing) {
      ctx.fillRect(0, i, canvas.width, 1);
    }
  }
};

/**
 * Main animation loop.
 * Updates the wave simulation and renders it to the screen.
 */
const animate = (): void => {
  updateWaves();
  renderSimulation();

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawScreen();

  animationId = requestAnimationFrame(animate);
};

/**
 * Initialize the canvas and simulation.
 * Set up the main and offscreen canvases, contexts, and start the animation.
 */
const initialize = (): void => {
  const context = canvas.getContext("2d");
  if (!context) {
    console.error("Failed to get canvas context.");
    return;
  }

  // Get contexts
  ctx = context;
  ctx.imageSmoothingEnabled = false;

  // Create offscreen canvas
  offCanvas = document.createElement("canvas");
  offCanvas.width = GRID_SIZE.columns;
  offCanvas.height = GRID_SIZE.rows;

  const offCanvasContext = offCanvas.getContext("2d");
  if (!offCanvasContext)
    throw new Error("Failed to create offscreen canvas context");

  offCtx = offCanvasContext;
  offCtx.imageSmoothingEnabled = false;

  // Initialize simulation buffers
  current = new Float32Array(GRID_SIZE.columns * GRID_SIZE.rows);
  previous = new Float32Array(GRID_SIZE.columns * GRID_SIZE.rows);

  // Start animation
  animate();
};

onMount(() => {
  if (typeof window === "undefined") return;

  // Initialize canvas
  resizeCanvas();
  initialize();

  // Add event listeners
  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("mousemove", handleMouseMove);
  window.addEventListener("mousedown", handleMouseDown);
  window.addEventListener("mouseup", handleMouseUp);
  window.addEventListener("touchmove", handleTouchMove);
  window.addEventListener("touchstart", handleTouchStart);
  window.addEventListener("touchend", handleTouchEnd);

  // Cleanup
  return () => {
    window.removeEventListener("resize", resizeCanvas);
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mousedown", handleMouseDown);
    window.removeEventListener("mouseup", handleMouseUp);
    window.removeEventListener("touchmove", handleTouchMove);
    window.removeEventListener("touchstart", handleTouchStart);
    window.removeEventListener("touchend", handleTouchEnd);

    cancelAnimationFrame(animationId);
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
    z-index: -1;
    pointer-events: none;
  }
</style> 