<script lang="ts">
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
    <a href="mailto:tomplanche@icloud.com">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M3.00977 5.83789C3.00977 5.28561 3.45748 4.83789 4.00977 4.83789H20C20.5523 4.83789 21 5.28561 21 5.83789V17.1621C21 18.2667 20.1046 19.1621 19 19.1621H5C3.89543 19.1621 3 18.2667 3 17.1621V6.16211C3 6.11449 3.00333 6.06765 3.00977 6.0218V5.83789ZM5 8.06165V17.1621H19V8.06199L14.1215 12.9405C12.9499 14.1121 11.0504 14.1121 9.87885 12.9405L5 8.06165ZM6.57232 6.80554H17.428L12.7073 11.5263C12.3168 11.9168 11.6836 11.9168 11.2931 11.5263L6.57232 6.80554Z"
          fill="currentColor"
        />
      </svg>
    </a>
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
