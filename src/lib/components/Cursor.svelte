<script lang="ts">
import { mainStore } from "$lib/stores/mainStore";
// Imports
import type { CursorParams } from "$lib/types";
import { spring } from "svelte/motion";

// Types

// Variables
const cursor_base: CursorParams = {
	size: 15,
	background: "#cacaca",
	opacity: 0,
	blur: 8,
	stiffness: 0.3,
	damping: 0.8,
};

// Springs
const opacity = spring(0);
const coords = spring(
	{
		x: 0,
		y: 0,
	},
	{ stiffness: 0.3, damping: 0.8 },
);
const size = spring(cursor_base.size);
const blur = spring(0);

let background = cursor_base.background as string;
// biome-ignore lint/style/useConst: The variable is used in the script but the linter doesn't recognize it
let hasMoved = false;

// if hasMoved is false, then the cursor is not visible
$: if (!hasMoved) {
	opacity.set(0);
} else {
	setTimeout(() => {
		opacity.set(1);
	}, 150);
}

// Functions
/**
 * Set the cursor parameters
 *
 * This function uses Svelte's `export const` syntax to allow the function to be called from other components.
 * It'll be called from the `mainStore.cursor`.
 *
 * @param params {CursorParams} The parameters to set
 * @param debug {boolean} Whether to log debug information
 */
export const setCursorParams = (params: CursorParams, debug = false) => {
	debug && console.log("[Cursor.svelte] setCursorParams called with:", params);

	if (params.size !== undefined) {
		size.set(params.size);
	}

	if (params.background !== undefined) {
		background = params.background;
	}

	if (params.opacity !== undefined) {
		opacity.set(params.opacity);
	}

	if (params.blur !== undefined) {
		blur.set(params.blur);
	}

	if (params.stiffness !== undefined || params.damping !== undefined) {
		const newSpringOptions = {
			stiffness: params.stiffness ?? cursor_base.stiffness,
			damping: params.damping ?? cursor_base.damping,
		};
		coords.stiffness = <number>newSpringOptions.stiffness;
		coords.damping = <number>newSpringOptions.damping;
	}
};
</script>

<!-- The window is used to get the mouse position -->
<svelte:window
    on:mousemove={(e) => {
    if (!hasMoved) {
      hasMoved = true;
    }

    coords.set({
      x: e.clientX,
      y: e.clientY
    });
  }}
    on:mousedown={() => {
    size.update((s) => s * 1.5);
  }}
    on:mouseup={() => {
    size.update((s) => s / 1.5);
  }}
/>

{#if !$mainStore.hideCursor}
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
{/if}

<style lang="scss">
  * {
    pointer-events: none;
  }

  svg {
    position: fixed;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;

    z-index: 99999;
  }
</style>
