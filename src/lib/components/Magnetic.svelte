<script lang="ts">
  // Imports
  import {mapRange} from "$lib/globals";
  import {spring, type SpringOpts} from "svelte/motion";

  // Variables
  interface Props {
    block?: boolean;
    debug?: boolean;
    force?: number | [number, number];
    invert?: boolean;
    springOptions?: SpringOpts;
  }

  const defaultProps: Props = {
    block: false,
    debug: false,
    force: 1,
    invert: false,
    springOptions: {
      stiffness: 0.3,
      damping: 0.8,
      precision: 0.1,
    },
  };

  export let { block, debug, force, invert, springOptions }: Props = defaultProps;

  $: _forceX = typeof force === "number" ? force : force[0];
  $: _forceY = typeof force === "number" ? force : force[1];
  $: _invert = invert ? -1 : 1;


  let container: HTMLElement;
  let content: HTMLElement;

  let contentX = spring(0, springOptions);
  let contentY = spring(0, springOptions);

  // Watchers
  $: if (content) {
    content.style.transform = `translate(${$contentX}px, ${$contentY}px)`;
  }

  // Functions
  /**
   * Handle mouse move
   *
   * @param e {MouseEvent} The mouse event
   */
  const handleMouseMove = (e: MouseEvent) => {
    if (block || !container || !content) {
      return;
    }

    const {clientX, clientY} = e;
    const {left, top, width, height} = container.getBoundingClientRect();

    // remap the mouse position to the container to a range of -1 to 1
    const x = mapRange(clientX, left, left + width, -1, 1, true);
    const y = mapRange(clientY, top, top + height, -1, 1, true);

    // calculate the new position of the container
    const newX = x * _forceX * width / 2 * _invert;
    const newY = y * _forceY * height / 2 * _invert;

    // apply the new position to the container
    contentX.set(newX);
    contentY.set(newY);
  };

  /**
   * Reset the container position
   */
  const handleMouseLeave = () => {
    if (block || !content) {
      return;
    }

    contentX.set(0);
    contentY.set(0);
  };
</script>

<div
    class="container"

    bind:this={container}
    class:debug={debug}

    on:mousemove={handleMouseMove}
    on:mouseleave={handleMouseLeave}

    aria-hidden="true"
>
  <div
      class="content"
      bind:this={content}
  >
    <slot/>
  </div>
</div>

<style lang="scss">
  .container {
    &.debug {
      background-color: rgba(255, 0, 0, 0.1);
      outline: 2px solid red;

      .content {
        background-color: rgba(0, 0, 255, 0.1);
        outline: 2px solid blue;
      }
    }

    .content {
      pointer-events: none;
    }
  }
</style>