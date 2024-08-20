<script lang="ts">
// Imports
import { fade } from "svelte/transition";

import { onClickOutside } from "$lib/actions/onClickOutside";
import { LINKS, mainStore } from "$lib/stores/mainStore";

import { gsap } from "gsap";

// Variables
// Binds
let nav: HTMLElement;
let svg: HTMLOrSVGElement;
let linksContainer: HTMLElement;

let isAnimating = false;
let isNavOpen = false;

$: if (isNavOpen && linksContainer) {
	const timeline = gsap.timeline({
		defaults: { duration: 0.6, ease: "power2.out" },
	});

	timeline.fromTo(
		".content a",
		{
			opacity: 0,
			y: 10,
		},
		{
			opacity: 1,
			y: 0,
			stagger: 0.1,
		},
	);
}

// Timelines
const timelineDefaults = {
	defaults: { duration: 0.6, ease: "power2.out" },
};

let openTimeline: gsap.core.Timeline;
let closeTimeline: gsap.core.Timeline;

// Watchers
$: if (svg && nav) {
	closeTimeline = gsap
		.timeline(timelineDefaults)
		.to(nav, {
			height: "10vh",
		})
		.to(
			svg,
			{
				rotate: 180,
			},
			"<",
		)
		.to(
			"#nav-container",
			{
				// css `backdrop-filter` property
				backdropFilter: "blur(0px)",
			},
			"<",
		)
		.set(svg, {
			rotate: 0,
		})
		.pause();

	openTimeline = gsap
		.timeline(timelineDefaults)
		.to(nav, {
			height: "40vh",
		})
		.to(
			svg,
			{
				rotate: 135,
			},
			"<",
		)
		.to(
			"#nav-container",
			{
				backdropFilter: "blur(4px)",
			},
			"<",
		)
		.pause();
}

// Functions
const handleOnStart = (onClickIsNavOpen: boolean) => {
	isAnimating = true;

	if (onClickIsNavOpen) {
		isNavOpen = false;
	}
};

const handleOnComplete = (onClickIsNavOpen: boolean) => {
	isAnimating = false;

	if (!onClickIsNavOpen) {
		isNavOpen = true;
	}
};

const handleNavClick = () => {
	if (isAnimating) return;

	const onClickIsNavOpen = isNavOpen;

	const timeline: gsap.core.Timeline = isNavOpen ? closeTimeline : openTimeline;

	timeline.eventCallback("onStart", () => {
		handleOnStart(onClickIsNavOpen);
	});

	timeline.eventCallback("onComplete", () => {
		handleOnComplete(onClickIsNavOpen);
	});

	timeline.restart();
	timeline.play();
};

const handleClickOutside = () => {
	const timeline = gsap.timeline({
		defaults: { duration: 0.6, ease: "power2.out" },
		onStart: () => {
			isAnimating = true;
			isNavOpen = false;
		},
		onComplete: () => {
			isAnimating = false;
		},
	});

	if (isNavOpen) {
		timeline
			.to(nav, {
				height: "10vh",
			})
			.to(
				svg,
				{
					rotate: 180,
				},
				"<",
			)
			.to(
				"#nav-container",
				{
					// css `backdrop-filter` property
					backdropFilter: "blur(0px)",
				},
				"<",
			)
			.set(svg, {
				rotate: 0,
			});
	}
};
</script>


<div
    id="nav-container"
    in:fade={{ duration: 200 }}
>
  <nav
    bind:this={nav}
    on:click={handleNavClick}

    use:onClickOutside={handleClickOutside}

    aria-hidden="true"
  >
    <div class="top">
      <div class="infos">
        <h1>Tom Planche.</h1>
        <h2>French software engineer.</h2>
      </div>

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
      <div
          class="content"

          bind:this={linksContainer}
      >
        {#each LINKS as link, i}
          <a
              href={link.href}

              class:active={link.title === $mainStore.currentLink.title}
          >
            <span>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.85046 13.4005C5.74589 13.4005 4.85046 12.5051 4.85046 11.4005V3.40051H2.85046V11.4005C2.85046 13.6097 4.64132 15.4005 6.85046 15.4005H17.156L13.3714 19.1852L14.7856 20.5994L21.1495 14.2354L14.7856 7.87146L13.3714 9.28567L17.4862 13.4005H6.85046Z"
                  fill="currentColor"
                />
              </svg>
            </span>
            {link.description}
          </a>
        {/each}
      </div>
    {/if}
  </nav>
</div>

<style lang="scss">
  @import "src/lib/styles/variables.scss";

  $nav-height: 10vh;
  $nav-height-padding: 1rem;
  $nav-width-padding: 2rem;

  #nav-container {
    position: fixed;
    top: 0;
    left: 0;

    height: 100vh;
    width: 100vw;

    padding: 1rem;

    pointer-events: none;

    * {
      @include no-user-select();

      pointer-events: all;
    }

    nav {
      height: $nav-height;
      max-height: 40vh;
      width: 100%;

      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-start;

      padding: $nav-height-padding $nav-width-padding;

      background: #1c3b4f;

      border-radius: 1rem;

      z-index: 10;

      .top {
        height: calc(#{$nav-height} - #{$nav-height-padding * 2});
        width: 100%;

        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        .infos {
          display: flex;
          flex-direction: column;
          align-items: flex-start;

          h2 {
            font-size: 1.75rem;
            font-weight: 400;
          }

        }

        svg {
          $svg-size: 3vh;

          height: $svg-size;
          width: $svg-size;

          cursor: pointer;

        }
      }

      .content {
        width: 100%;

        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: flex-start;

        a {
          width: 100%;

          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: center;

          margin-left: .5rem;

          font-size: 2.5rem;

          span {
            opacity: 0;

            height: 2rem;
            width: 0;

            margin-right: 1rem;

            transition:
              opacity 0.2s ease-in-out,
              width 0.2s ease-in-out;
          }

          &:not(.active) {
            opacity: .8;
          }

          &:hover,
          &.active {
            span {
              opacity: 1;
              width: 2rem;
            }
          }
        }
      }
    }
  }
</style>
