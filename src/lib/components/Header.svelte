<script lang="ts">
import { style_vars } from "$lib/globals";
import { LINKS, mainStore } from "$lib/stores/mainStore";
import { fade } from "svelte/transition";

// Variables
const links = Object.values(LINKS);

// Functions
const handleFontChange = () => {
	document.body.classList.toggle("colored");
};

const handleMouseHoverLink = (itemId: string) => {
	// const link = document.querySelector(`#${itemId} .link`);
	// const splitText = new SplitText(link, { type: 'words,chars' });
	// const combinedCharsAnimated = 2;
	// const duration = 0.5; // per character
	//
	// const tl = gsap.timeline({
	//   defaults: {
	//     duration: duration,
	//     ease: 'power2.out',
	//     stagger: duration / splitText.chars.length / combinedCharsAnimated
	//   }
	// });
	//
	// tl.to(splitText.chars, {
	//   backgroundColor: 'rgb(24 41 56 / 1)',
	//   color: '#080a13'
	// }).to(
	//   splitText.chars,
	//   {
	//     backgroundColor: 'rgb(24 41 56 / 1)',
	//     color: 'rgba(205, 201, 255)'
	//   },
	//   `<${duration / 2}`
	// );
};
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

<header
  style="padding: 1rem; height: {style_vars.headerHeight}"
  in:fade={{ duration: 200 }}
  out:fade={{ duration: 200 }}
>
  <span>
<!--    <Hoverable>-->
<!--      <button aria-hidden="true" on:click={handleFontChange}> T </button>-->
<!--    </Hoverable>-->
  </span>

  <nav>
    <ul>
      {#each links as link}
        <li>
<!--          <Hoverable>-->
            <a
              class={link === $mainStore.currentLink ? 'active' : ''}
              id={`link_${link}`}
              href={`/${link === LINKS.HOME ? '' : link}`}
              on:mouseenter={() => handleMouseHoverLink(`link_${link}`)}
            >
              [<span>+</span>]<span class="link">{link}</span>
            </a>
<!--          </Hoverable>-->
        </li>
      {/each}
    </ul>
  </nav>
</header>

<style lang="scss">
  @import '$lib/styles/variables';

  header {
    backdrop-filter: url('#svgfilter');
    position: fixed;
    top: 0;
    left: 0;

    display: flex;
    justify-content: space-between;
    align-items: center;

    width: 100%;

    span {
      button {
        font-family: 'ColorFont', sans-serif;
        font-size: 2.5rem;
      }
    }

    nav {
      ul {
        display: flex;
        gap: 2rem;

        li {
          list-style: none;

          a {
            color: $aled;
            text-transform: uppercase;

            display: inline-flex;

            font-family: 'Monocraft', sans-serif;
            font-weight: 900;
            font-size: 1.25rem;
            font-kerning: none;

            span:not(.link) {
              opacity: 0;
              margin: 0 0.125rem;

              transition: opacity 0.2s ease-in-out;
            }

            span.link {
              margin-left: .5rem;
            }

            &:hover {
              span:not(.link) {
                opacity: 0.5;
              }
            }

            &.active {
              span:not(.link) {
                opacity: 1;
              }
            }
          }
        }
      }
    }
  }
</style>
