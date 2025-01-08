<script lang="ts">
  import {gsap} from "gsap";
  import {theme, toggleTheme} from "$lib/stores/theme";

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
  <button
      bind:this={button}
      on:click={handleToggleTheme}
      on:mouseenter={handleMouseEnter}
      on:mouseleave={handleMouseLeave}

      aria-label="Toggle theme change"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...$$props}>
      <path fill="currentColor"
            d="M16 2h-2v2h2v2H4v2H2v5h2V8h12v2h-2v2h2v-2h2V8h2V6h-2V4h-2zM6 20h2v2h2v-2H8v-2h12v-2h2v-5h-2v5H8v-2h2v-2H8v2H6v2H4v2h2z"/>
    </svg>
  </button>
</nav>

<style lang="scss">
  nav {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 1000;

    padding: 1rem;

    button {
      background: none;
      border: none;
      cursor: pointer;
      padding: 1rem;

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