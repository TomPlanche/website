<script lang="ts">
  // Imports
  import {spring} from 'svelte/motion';
  import type {TCursorOptions} from '../types';

  // Variables
  const cursor_base = {size: 15, background: 'color-mix(in srgb, var(--text-color) 50%, transparent)'};
  let scroll = {x: 0, y: 0};

  // Springs
  const opacity = spring(0);
  const coords = spring(
    {
      x: 0,
      y: 0
    },
    {stiffness: 0.3, damping: 0.8}
  );
  const size = spring(cursor_base.size);
  const blur = spring(0);

  let background = cursor_base.background as string;
  let hasMoved = false as boolean;

  let innerSvg: string | null;
  let innerText: string | null;

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

      opacity.set(params.opacity ?? 0.5);
    } else {
      if (params.svg === undefined || params.svg === null) {
        innerSvg = null;
      }

      opacity.set(params.opacity ?? 1);
      if (params.innerText === undefined || params.innerText === null) {
        innerText = null;
      }
    }

    blur.set(params.blur ?? 0);
    background = params.backgroundColor ?? cursor_base.background;
    size.set(params.scale ? cursor_base.size * params.scale : cursor_base.size);
  };

  // if hasMoved is false, then the cursor is not visible
  $: if (!hasMoved) {
    opacity.set(0);
  } else {
    setTimeout(() => {
      opacity.set(1);
    }, 150);
  }
</script>

<!-- The window is used to get the mouse position -->
<svelte:window
    on:mousemove={(e) => {
    !hasMoved && (hasMoved = true);

    coords.set({
      x: e.clientX,
      y: e.clientY
    });

    scroll = {
      x: window.scrollX,
      y: window.scrollY
    };
  }}
    on:mousedown={() => {
    size.update((s) => s * 1.5);
  }}
    on:mouseup={() => {
    size.update((s) => s / 1.5);
  }}
    on:scroll={() => {
    scroll = {
      x: window.scrollX,
      y: window.scrollY
    };
  }}
/>

<!-- The svg is always displayed -->
<svg aria-hidden="true">
  <circle
      cx={$coords.x}
      cy={$coords.y}
      r={$size}
      style="
			opacity: {$opacity};
			filter: blur({$blur}px);
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
			transform: translate({$coords.x + scroll.x - $size}px, {$coords.y + scroll.y - $size}px) ;
		"
  />
{/if}

<!-- If something is in the default slot, then we display it -->
{#if $$slots.default || innerText}
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
    {#if $$slots.default}
      <slot/>
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
