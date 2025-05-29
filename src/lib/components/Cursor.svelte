<script lang="ts">
  import type {Snippet} from "svelte";
  // Imports
  import {Spring} from "svelte/motion";
  import type {TCursorOptions} from "../types/types";

  // Props
  type TCursorProps = {
    children?: Snippet<[]>;
  };

  const {children}: TCursorProps = $props();

  // Variables
  const cursor_base = {
    size: 15,
    background: "color-mix(in srgb, var(--text-color) 50%, transparent)",
  };
  let scroll = $state<{
    x: number;
    y: number;
  }>({x: 0, y: 0});

  // Springs
  const opacity = new Spring(0);
  const coords = new Spring(
    {
      x: 0,
      y: 0,
    },
    {stiffness: 0.3, damping: 0.8},
  );
  const size = new Spring(cursor_base.size);
  const blur = new Spring(0);

  let background = $state(cursor_base.background as string);
  let hasMoved = $state(false);

  let innerSvg: string | null = $state(null);
  let innerText: string | null = $state(null);

  // Functions
  export const setCursorParams = (params: TCursorOptions) => {
    if (params.isHover) {
      // params.svg can be undefined, a svg string or a boolean
      if (params.svg) {
        innerSvg = params.svg;
      }

      if (params.innerText) {
        innerText = params.innerText;
      }

      opacity.target = params.opacity ?? 0.5;
    } else {
      if (params.svg === undefined || params.svg === null) {
        innerSvg = null;
      }

      opacity.set(params.opacity ?? 1);
      if (params.innerText === undefined || params.innerText === null) {
        innerText = null;
      }
    }

    blur.target = params.blur ?? 0;
    background = params.backgroundColor ?? cursor_base.background;
    size.target = params.scale
      ? cursor_base.size * params.scale
      : cursor_base.size;
  };

  // If hasMoved is false, then the cursor is not visible
  $effect(() => {
    if (!hasMoved) {
      opacity.target = 0;
    } else {
      setTimeout(() => {
        opacity.target = 1;
      }, 150);
    }
  });
</script>

<!-- The window is used to get the mouse position -->
<svelte:window
    onmousemove={(e) => {
    !hasMoved && (hasMoved = true);

    coords.target = {
      x: e.clientX,
      y: e.clientY
    };

    scroll = {
      x: window.scrollX,
      y: window.scrollY
    };
  }}
    onmousedown={() => {
    size.target = size.current * 1.5;
  }}
    onmouseup={() => {
    size.target = size.current / 1.5;
  }}
    onscroll={() => {
    scroll = {
      x: window.scrollX,
      y: window.scrollY
    };
  }}
/>

<!-- The svg is always displayed -->
<svg aria-hidden="true">
  <circle
      cx={coords.current.x}
      cy={coords.current.y}
      r={size.current}
      style="
			opacity: {opacity.current};
			filter: blur({blur.current}px);
			fill: {background};
		"
  />
</svg>

<!-- If there is a svg, then we display it -->
{#if innerSvg}
  <img
      src={innerSvg}
      alt="Github gif"
      style="
			height: {$size * 2}px;
			width: {$size * 2}px;
			transform: translate({$coords.x + scroll.x - $size}px, {$coords.y + scroll.y - $size}px);
		"
  />
{/if}

<!-- If something is in the default slot, then we display it -->
{#if children || innerText}
  <div
      class="html-container"
      style="
			height: {$size * 2}px;
			width: {$size * 2}px;
			transform: translate({$coords.x - $size}px, {$coords.y - $size}px) scale({$size /
      cursor_base.size});
			pointer-events: none;
			position: fixed;
		"
  >
    {#if children}
      {@render children()}
    {:else}
      {innerText}
    {/if}
  </div>
{/if}

<style lang="scss">
  * {
    pointer-events: none;
  }

  svg {
    position: fixed;
    top: 0;
    left: 0;

    pointer-events: none;

    width: 100%;
    height: 100%;

    z-index: 99998;
  }

  img {
    position: absolute;
    top: 0;
    left: 0;

    pointer-events: none;
    z-index: 99999;
  }

  .html-container {
    position: absolute;
    top: 0;
    left: 0;

    display: flex;
    justify-content: center;
    align-items: center;

    z-index: 99998;

    pointer-events: none;
  }
</style>
