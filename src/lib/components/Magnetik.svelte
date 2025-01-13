<script lang="ts">
  // Imports
  import {gsap} from 'gsap';
  import type {Snippet} from "svelte";

  // Types

  type TProps = {
    /**
     * @type {number | 'full'} - The size of the field compared to passed slot
     */
    fieldSize: number | 'full';
    /**
     * @property {fieldForce} number The force of the field:
     * 1 means the passed slot will follow the mouse exactly.
     * .5 means the passed slot will move half the distance of the mouse.
     * default: .5 (50%)
     */
    fieldForce: number;
    centered: boolean;
    block: boolean;
    debug: boolean;

    children?: Snippet;
  };

  // Props
  const {
    fieldSize = 2,
    fieldForce = .5,
    centered = true,
    block = false,
    debug = false,

    children,
  }: Partial<TProps> = $props();

  // Normal variables
  let container_ref: HTMLDivElement;
  let passed_slot_ref: HTMLDivElement;

  $effect(() => {
    if (container_ref) {
      container_ref.style.setProperty(
        '--field-size',
        `calc(100% * ${fieldSize === 'full' ? 1 : fieldSize})`
      );
    }
  });

  // Watchers

  // Methods
  const handleMagnetikFieldMouseMove = (e: MouseEvent) => {
    if (!passed_slot_ref || block) return;

    const {clientX, clientY} = e;
    const mainContainerRect = container_ref.getBoundingClientRect();

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
      ? (mainContainerInfos.width / 2) * sideRatioX * fieldForce
      : ((passedInfos.width - mainContainerInfos.width) / -2) * sideRatioX * fieldForce;

    const translateY = centered
      ? (mainContainerInfos.height / 2) * sideRatioY * fieldForce
      : ((passedInfos.height - mainContainerInfos.height) / -2) * sideRatioY * fieldForce;

    gsap.to(passed_slot_ref, {
      duration: 0.3,
      x: translateX,
      y: translateY,
      ease: 'power2.out'
    });
  };

  const handleMagnetikFieldMouseLeave = () => {
    if (!container_ref || block || fieldSize === 'full') return;

    gsap.to(passed_slot_ref, {
      duration: 0.3,
      x: 0,
      y: 0,
      ease: 'power2.out'
    });
  };
</script>

<div
    aria-hidden="true"
    class="container{debug ? ' debug' : ''}"
    onmouseleave={handleMagnetikFieldMouseLeave}
    onmousemove={handleMagnetikFieldMouseMove}
    bind:this={container_ref}
>
  <div
      class="field-area"
      aria-hidden="true"
  ></div>
  <div class="slot-container" bind:this={passed_slot_ref}>
    {@render children?.()}
  </div>
</div>

<style lang="scss">
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;

    &.debug {
      border: 2px dotted blue;

      .field-area {
        border: 2px dotted red;
      }

      .slot-container {
        border: 2px dotted green;
      }
    }

    .field-area {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: var(--field-size);
      height: var(--field-size);
    }
  }
</style>
