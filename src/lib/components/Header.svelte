<script lang="ts">
  import {onMount} from "svelte";
  import {gsap} from "gsap";
  import {cursorEnter, cursorLeave} from '$lib/actions/cursor';
  import Magnetik from "$lib/components/Magnetik.svelte";
  import {toggleTheme} from "$lib/stores/themeStore";
  import type {TRecentTrack} from "$lib/types/lastfm";
  import LiveIndicator from '$lib/components/LiveIndicator.svelte';

  // Bindings
  let button: HTMLButtonElement = $state();
  let isAnimating = false;

  // State
  let currentTrack: TRecentTrack | null = $state(null);
  const isLive = $derived(!!currentTrack?.['@attr']?.nowplaying);

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

  const fetchNowPlaying = async () => {
    try {
      const response = await fetch("api/music/now-playing");
      currentTrack = await response.json();
    } catch (error) {
      console.error("Error fetching now playing:", error);
    }
  };

  // Lifecycle
  onMount(() => {
    (async () => {
      await fetchNowPlaying();
    })();

    // Refresh every 10 seconds
    const interval = setInterval(fetchNowPlaying, 10000);

    return () => clearInterval(interval);
  });
</script>

<nav>
  <span class="now-playing">
    {#if isLive}
      <div>
        <LiveIndicator size="small"/>
        <span class="text-sm">Live: </span>
      </div>
      <span class="track-info">
        {currentTrack.name} - {currentTrack.artist['#text']}
      </span>
    {/if}
  </span>
  <Magnetik>
    <button
        bind:this={button}
        onclick={handleToggleTheme}
        onmouseenter={handleMouseEnter}
        onmouseleave={handleMouseLeave}

        use:cursorEnter
        use:cursorLeave

        aria-label="Toggle theme change"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
        <path fill="currentColor"
              d="M16 2h-2v2h2v2H4v2H2v5h2V8h12v2h-2v2h2v-2h2V8h2V6h-2V4h-2zM6 20h2v2h2v-2H8v-2h12v-2h2v-5h-2v5H8v-2h2v-2H8v2H6v2H4v2h2z"/>
      </svg>
    </button>
  </Magnetik>
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
        width: 1.5rem;
        height: 1.5rem;
      }
    }
  }

  .now-playing {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    opacity: 0.75;

    .track-info {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 300px;
    }
  }
</style>