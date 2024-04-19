<script lang="ts">
  // Imports
  import type { T_CursorOptions, T_OnEnter, T_OnLeave } from '../types';
  import { store } from '$lib/appStore';
  import CSSProperties = gsap.CSSProperties;
  import { scale, fade } from 'svelte/transition';

  // Variables
  const defaultEnterOptions: T_CursorOptions = {
    isHover: true,
    scale: 2,
    opacity: 0.5
  };

  const defaultLeaveOptions: T_CursorOptions = {
    isHover: false,
    scale: 1,
    opacity: 1,
    svg: undefined
  };

  // Functions
  const defaultOnEnter: T_OnEnter = (cursorOptions?: T_CursorOptions) => {
    $store.cursor.setCursorParams({
      ...defaultEnterOptions,
      ...cursorOptions
    });
  };

  const defaultOnLeave: T_OnLeave = (cursorOptions?: T_CursorOptions) => {
    $store.cursor.setCursorParams({
      ...defaultLeaveOptions,
      ...cursorOptions
    });
  };

  // Props
  /**
   * Options for the cursor when the user enters the element
   *
   * @type {T_CursorOptions}
   */
  export let onEnterOptions: T_CursorOptions = {
    isHover: true,
    scale: 2
  };

  /**
   * Options for the cursor when the user leaves the element
   *
   * @type {T_CursorOptions}
   */
  export let onLeaveOptions: T_CursorOptions = {
    isHover: false,
    scale: 1
  };

  /**
   * Whether to show the debug outline
   *
   * @type {boolean}
   */
  export let debug: boolean = false;

  /**
   * Function to call when the user clicks on the element
   *
   * @type {function}
   */
  export let onClick: () => void = () => {};

  /**
   * Style to apply to the element
   *
   * @type {CSSRule}
   */
  export let style: Partial<CSSProperties> = {
    display: 'contents'
  };

  /**
   * Passed class to the element.
   *
   * @type {string}
   */
  export let passedClass: string = '';

  // Watchers
  $: style = debug ? { ...style, outline: '2px dotted red;' } : style;
</script>

<div
  aria-hidden="true"
  on:mouseenter={() => defaultOnEnter(onEnterOptions)}
  on:mouseleave={() => defaultOnLeave(onLeaveOptions)}
  on:click={onClick}
  class={passedClass}
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
