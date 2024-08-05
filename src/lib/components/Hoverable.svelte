<script lang="ts">
import { mainStore } from "$lib/stores/mainStore";
// Imports
import type { CursorParams } from "$lib/types";
import CSSProperties = gsap.CSSProperties;

// Variables
// Types
const defaultEnterOptions: CursorParams = {
	size: 30,
	opacity: 0.5,
};

const defaultLeaveOptions: CursorParams = {
	size: 15,
	opacity: 1,
};

// Functions
const defaultOnEnter = (cursorOptions?: CursorParams) => {
	$mainStore.cursor?.setCursorParams({
		...defaultEnterOptions,
		...cursorOptions,
	});
};

const defaultOnLeave = (cursorOptions?: CursorParams) => {
	$mainStore.cursor?.setCursorParams({
		...defaultLeaveOptions,
		...cursorOptions,
	});
};

// Props
/**
 * Options for the cursor when the user enters the element
 *
 * @type {CursorParams}
 */

// biome-ignore lint/style/useConst: This is for a prop
export let onEnterOptions: CursorParams = {
	size: 30,
	opacity: 0.5,
};

/**
 * Options for the cursor when the user leaves the element
 *
 * @type {CursorParams}
 */
// biome-ignore lint/style/useConst: This is for a prop
export let onLeaveOptions: CursorParams = {
	size: 15,
	opacity: 1,
};

/**
 * Whether to show the debug outline
 *
 * @type {boolean}
 */
export const debug = false;

/**
 * Function to call when the user clicks on the element
 *
 * @type {function}
 */
export const onClick: () => void = () => {};

/**
 * Style to apply to the element
 *
 * @type {CSSRule}
 */
export let style: Partial<CSSProperties> = {
	display: "contents",
};

/**
 * Passed class to the element.
 *
 * @type {string}
 */
export const passedClass = "";

/**
 * The id of the element
 */
export const id = "";

// Watchers
$: style = debug ? { ...style, outline: "2px dotted red;" } : style;
// Functions
</script>


<div
  aria-hidden="true"
  on:mouseenter={() => defaultOnEnter(onEnterOptions)}
  on:mouseleave={() => defaultOnLeave(onLeaveOptions)}
  on:click={onClick}
  class={passedClass}
  {id}
  style:display="contents"
>
  <slot>
    <span style="display: flex; flex-direction: row; align-content: center; align-items: center"
      >You need to add some content to your `
      <pre>Hoverable</pre>
      ` component</span
    >
  </slot>
</div>
