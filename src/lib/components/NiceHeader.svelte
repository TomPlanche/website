<script lang="ts">
// Imports
import { gsap } from "gsap";
import { onMount } from "svelte";

// Variables
// Binds
let nav: HTMLElement;
let svg: HTMLOrSVGElement;

let isAnimating = false;
let isNavOpen = false;

$: if (isNavOpen) {
	const timeline = gsap.timeline({
		defaults: { duration: 0.6, ease: "power2.out" },
	});
}

// Functions
const handleNavClick = () => {
	if (isAnimating) return;

	const onClickIsNavOpen = isNavOpen;

	const timeline = gsap.timeline({
		defaults: { duration: 0.6, ease: "power2.out" },
		onStart: () => {
			isAnimating = true;

			if (onClickIsNavOpen) {
				isNavOpen = false;
			}
		},
		onComplete: () => {
			isAnimating = false;

			if (!onClickIsNavOpen) {
				isNavOpen = true;
			}
		},
	});

	if (isNavOpen) {
		timeline
			.to(nav, {
				height: "8vh",
			})
			.to(
				svg,
				{
					rotate: 180,
				},
				"<",
			)
			.set(svg, {
				rotate: 0,
			});
	} else {
		timeline
			.to(nav, {
				height: "30vh",
			})
			.to(
				svg,
				{
					rotate: 135,
				},
				"<",
			);
	}
};

onMount(() => {
	console.log("NiceHeader mounted");
});
</script>


<div
    id="nav-container"
>
  <nav
    bind:this={nav}
    on:click={handleNavClick}
    aria-hidden="true"
  >
    <div class="top">
      <h1>Tom Planche.</h1>

      <svg
        bind:this={svg}

        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 4C11.4477 4 11 4.44772 11 5V11H5C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13H11V19C11 19.5523 11.4477 20 12 20C12.5523 20 13 19.5523 13 19V13H19C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11H13V5C13 4.44772 12.5523 4 12 4Z"
          fill="currentColor"
        />
      </svg>
    </div>

    {#if isNavOpen}
      <div class="content">
        <h2>ZIZI</h2>
      </div>
    {/if}
  </nav>
</div>

<style lang="scss">
  $nav-height: 8vh;
  $nav-padding: 2rem;

  #nav-container {
    position: fixed;
    top: 0;
    left: 0;

    height: 100vh;
    width: 100vw;

    padding: 1rem;

    nav {
      height: $nav-height;
      max-height: 30vh;
      width: 100%;

      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;

      padding: $nav-padding;

      background: #1c3b4f;
      background: red;

      border-radius: 1rem;

      z-index: 10;

      .top {
        height: calc(#{$nav-height} - #{$nav-padding * 2});
        width: 100%;

        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        svg {
          $svg-size: 3vh;

          height: $svg-size;
          width: $svg-size;

          cursor: pointer;

        }

      }
    }
  }
</style>
