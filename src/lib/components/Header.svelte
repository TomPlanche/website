<script lang="ts">
import { cursorEnter, cursorLeave } from "$lib/actions/cursor";
import LiveIndicator from "$lib/components/LiveIndicator.svelte";
import { BackendSongSchema, type TBackendSong } from "$lib/types/lastfm";
import { onMount } from "svelte";
import { fade } from "svelte/transition"; // Statee

// Statee
let currentTrack: TBackendSong | null = $state(null);
const isLive = $derived(() => currentTrack?.currently_playing);

// Functions
const fetchNowPlaying = async () => {
  try {
    const response = await fetch("/api-front/music/now-playing");

    const parse = BackendSongSchema.safeParse(await response.json());

    if (parse.success) {
      currentTrack = parse.data;
    } else {
      throw new Error(
        `Failed to parse now playing response: ${JSON.stringify(parse.error)}`,
      );
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
</style>