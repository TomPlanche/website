<script lang="ts">
  import {onMount} from "svelte";
  import {fade} from "svelte/transition";
  import {gsap} from "gsap";
  import {cursorEnter, cursorLeave} from '$lib/actions/cursor';
  import Magnetik from "$lib/components/Magnetik.svelte";
  import {toggleTheme} from "$lib/stores/themeStore";
  import LiveIndicator from '$lib/components/LiveIndicator.svelte';
  import {BackendSongSchema, type TBackendSong} from "$lib/types/lastfm";

  // Bindings
  let button: HTMLButtonElement = $state();
  let isAnimating = false;

  // Statee
  let currentTrack: TBackendSong | null = $state(null);
  const isLive = $derived(() => currentTrack?.currently_playing);

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
      const response = await fetch("/music/now-playing");

      const parse = BackendSongSchema.safeParse(await response.json());

      if (parse.success) {
        currentTrack = parse.data;
      } else {
        throw new Error(`Failed to parse now playing response: ${JSON.stringify(parse.error)}`);
      }
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
  <div class="left">
    <a
        class="title"
        href="/"
        use:cursorEnter
        use:cursorLeave
    >Tom Planche</a>
    <span
        class="now-playing"
        in:fade={{duration: 500}}
        out:fade={{duration: 500}}

        use:cursorEnter
        use:cursorLeave
    >
      {#if isLive() && currentTrack}
        <LiveIndicator size="small"/>
        Live:
        <a
            class="track-info"
            href={currentTrack.url}
            target="_blank"
            rel="noopener noreferrer"

            title="{currentTrack.name} - {currentTrack.artist}"
        >
          {currentTrack.name} - {currentTrack.artist}
        </a>
      {/if}
    </span>
  </div>
  <Magnetik>
    <button
        bind:this={button}
        use:cursorEnter
        use:cursorLeave

        onclick={handleToggleTheme}
        onmouseenter={handleMouseEnter}
        onmouseleave={handleMouseLeave}


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

    .left {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;

      .title {
        font-family: "Mondwest", monospace;
        font-size: 1.5rem;
        font-weight: 900;
        text-align: left;
        text-shadow: 0 0 5px var(--text-color);
        margin-right: 1rem;

        @media (max-width: 768px) {
          font-size: 1.5rem;
        }
      }

      .now-playing {
        display: flex;
        align-items: baseline;
        gap: 0.5rem;
        font-size: 1rem;
        opacity: 0.95;
        font-family: "Mondwest", monospace;

        text-shadow: 0 0 1px var(--text-color);

        .track-info {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 300px;
          cursor: pointer;
        }
      }

    }

    button {
      background: none;
      border: none;
      cursor: pointer;

      transition: opacity .2s ease-in-out;

      &:hover {
        opacity: 1;
      }

      svg {
        width: 1.5rem;
        height: 1.5rem;

        * {
          fill: var(--text-color);
          color: var(--text-color);
        }
      }
    }
  }


</style>