<script lang="ts">
  /**
   * TODO: Handle the `recentered` prop.
   */

  // Imports
  import { gsap } from 'gsap';

  // Types
  type T_recenteredTrue = {
    verticalUp: boolean;
    horizontalLeft: boolean;
  };

  // Props
  /**
   * @type {number | 'full'} - The size of the field compared to passed slot
   */
  export let field_size: number | 'full' = 2;
  export let field_force = 0.1;
  export let centered = true;
  export let recentered: T_recenteredTrue | false = false;
  export let block = false;
  export let debug = false;

  // Normal variables
  let container_ref: HTMLDivElement;
  let passed_slot_ref: HTMLDivElement;
  let debug_infos_ref: HTMLDivElement;

  // Watchers

  // Methods
  const handleMagnetikContainerMouseMove = (e: MouseEvent) => {
    if (!passed_slot_ref || block) return;

    const { clientX, clientY } = e;
    const mainContainerRect = container_ref.getBoundingClientRect();
    // @ts-ignore
    // (TS2339: Property 'current' does not exist on type '((instance: HTMLElement | null) => void) | MutableRefObject<HTMLElement | null>'.
    const passedRect = passed_slot_ref.getBoundingClientRect();

    const mainContainerInfos = {
      top: mainContainerRect.top,
      left: mainContainerRect.left,
      width: mainContainerRect.width,
      height: mainContainerRect.height
    };

    const passedInfos = {
      top: passedRect.top,
      left: passedRect.left,
      width: passedRect.width,
      height: passedRect.height
    };

    const centerX = mainContainerInfos.left + mainContainerInfos.width / 2;
    const centerY = mainContainerInfos.top + mainContainerInfos.height / 2;

    const sideRatioX =
      Math.floor(((clientX - centerX) / (mainContainerInfos.width / 2)) * 100) / 100;
    const sideRatioY =
      Math.floor(((clientY - centerY) / (mainContainerInfos.height / 2)) * 100) / 100;

    const translateX = centered
      ? (mainContainerInfos.width / 2) * sideRatioX * field_force
      : ((passedInfos.width - mainContainerInfos.width) / -2) * sideRatioX * field_force;

    const translateY = centered
      ? (mainContainerInfos.height / 2) * sideRatioY * field_force
      : ((passedInfos.height - mainContainerInfos.height) / -2) * sideRatioY * field_force;

    // @ts-ignore
    // (TS2339: Property 'current' does not exist on type '((instance: HTMLElement | null) => void) | MutableRefObject<HTMLElement | null>'.
    gsap.to(passed_slot_ref, {
      duration: 0.3,
      x: translateX,
      y: translateY,
      ease: 'power2.out'
    });
  };

  const handleMagnetikContainerMouseLeave = () => {
    if (!container_ref || block || field_size === 'full') return;

    gsap.to(passed_slot_ref, {
      duration: 0.3,
      x: 0,
      y: 0,
      ease: 'power2.out'
    });
  };
</script>

<div
  class="container{debug ? ' debug' : ''}"
  bind:this={container_ref}
  on:mousemove={handleMagnetikContainerMouseMove}
  on:mouseleave={handleMagnetikContainerMouseLeave}
  aria-hidden="true"
>
  <div class="slot-container" bind:this={passed_slot_ref}>
    <slot />
  </div>
</div>

<style lang="scss">
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    &.debug {
      border: 2px dotted blue;
    }

    .slot-container {
      pointer-events: none;
    }
  }
</style>
