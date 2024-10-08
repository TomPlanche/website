<script lang="ts">
import Contact from "$lib/components/Contact.svelte";
import { mainStore } from "$lib/stores/mainStore";
import { gsap } from "gsap";
// Imports
import { onMount } from "svelte";

// Variables
let footer: HTMLElement;

// Functions

onMount(() => {
	gsap.to(footer, {
		yPercent: -100,
		ease: "none",
		stagger: 0.5,
		scrollTrigger: {
			trigger: "main",
			start: "bottom bottom",
			end: `+=${footer.clientHeight * 0.75}`,
			scrub: true,
			pin: true,

			onUpdate: ({ progress }) => {
				if (footer) {
					$mainStore.musicPlayingYDistance = progress * footer.offsetHeight;
				}
			},
		},
	});
});
</script>

<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0">
  <defs>
    <filter id="svgfilter">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.3"
        numOctaves="1"
        seed="0"
        stitchTiles="stitch"
        result="feTurbulence-391ac80d"
      ></feTurbulence>
      <feGaussianBlur
        in="SourceGraphic"
        stdDeviation="2"
        edgeMode="duplicate"
        result="feGaussianBlur-85e146a6"
      ></feGaussianBlur>
      <feDisplacementMap
        in="feGaussianBlur-85e146a6"
        in2="feTurbulence-391ac80d"
        scale="37"
        xChannelSelector="A"
        yChannelSelector="A"
      ></feDisplacementMap>
    </filter>
  </defs>
</svg>

<footer
    bind:this={footer}
>
  <h1>✨&nbsp;made by Tom Planche&nbsp;©</h1>

  <div class="links">
    <Contact />
  </div>
</footer>


<style lang="scss">
  footer {
    height: 10vh;
    width: 100%;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    padding: 2rem;

    position: absolute;
    will-change: transform;

    backdrop-filter: url('#svgfilter');

    h1 {
      font-family: "Mondwest", sans-serif;
      font-size: 3rem;
      font-weight: 900;
    }

    .links {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
      gap: 1rem;

      a {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 1rem;

        svg {
          height: 3rem;
          width: auto;
        }
      }
    }
  }
</style>
