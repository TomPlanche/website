<script lang="ts">
  import {gsap} from "gsap";
  import {toggleTheme} from "$lib/stores/themeStore";
  import {cursorEnter, cursorLeave} from '$lib/actions/cursor';


  // Bindings
  let button: HTMLButtonElement;
  let isAnimating = false;

  // Functions
  const handleToggleTheme = () => {
    toggleTheme();

    const timeline = gsap.timeline();

    timeline
      .to(button, {
        rotate: 360,
        duration: 0.5,
        ease: "power2.out",
        onStart: () => {
          isAnimating = true;
        },
        onComplete: () => {
          timeline.to(button, {
            rotate: 0,
            duration: 0,

            onComplete: () => {
              isAnimating = false;
            },
          });
        },
      });
  }

  const handleMouseEnter = () => {
    if (isAnimating) {
      return;
    }

    gsap.to(button, {
      rotate: 12,
      duration: 0.2,
    });
  }

  const handleMouseLeave = () => {
    if (isAnimating) {
      return;
    }

    gsap.to(button, {
      rotate: 0,
      duration: 0.2,
    });
  }
</script>

<nav>
  <span></span>
  <button
      bind:this={button}
      on:click={handleToggleTheme}
      on:mouseenter={handleMouseEnter}
      on:mouseleave={handleMouseLeave}

      use:cursorEnter
      use:cursorLeave

      aria-label="Toggle theme change"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...$$props}>
      <path fill="currentColor"
            d="M16 2h-2v2h2v2H4v2H2v5h2V8h12v2h-2v2h2v-2h2V8h2V6h-2V4h-2zM6 20h2v2h2v-2H8v-2h12v-2h2v-5h-2v5H8v-2h2v-2H8v2H6v2H4v2h2z"/>
    </svg>
  </button>
</nav>

<style lang="scss">
  @use '$lib/styles/variables';

  $double-padding: variables.$main-padding * 2;
  $light-color: color-mix(in srgb, var(--text-color) 50%, transparent);

  nav {
    height: variables.$header-height;
    width: calc(100% - #{$double-padding});
    
    position: fixed;
    top: variables.$main-padding;
    left: variables.$main-padding;
    z-index: 1000;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    outline: 1px solid $light-color;
    border-radius: 1rem 1rem 0 0;

    padding: 1rem;

    // Blurry background
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px); // Compatible with Safari

    button {
      background: none;
      border: none;
      cursor: pointer;

      opacity: .75;

      transition: opacity .2s ease-in-out;

      &:hover {
        opacity: 1;
      }

      svg {
        width: 2rem;
        height: 2rem;
      }
    }
  }
</style>