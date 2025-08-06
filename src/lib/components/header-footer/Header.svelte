<script lang="ts">
  import { cursorEnter, cursorLeave } from "$lib/actions/cursor";
  import LiveIndicator from "$lib/components/LiveIndicator.svelte";
  import { scrollTrigger } from "$lib/components/header-footer/index"; // Statee
  import { BackendSongSchema, type TBackendSong } from "$lib/types/lastfm";

  import { onMount } from "svelte";
  import { fade } from "svelte/transition";

  // Statee
  let currentTrack: TBackendSong | null = $state(null);
  const isLive = $derived(() => currentTrack?.currently_playing);

  // Scroll effect state
  let scrollY = $state(0);
  const isScrolled = $derived(scrollY >= scrollTrigger);

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

    // Track scroll position
    const handleScroll = () => {
      scrollY = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      clearInterval(interval);
      window.removeEventListener("scroll", handleScroll);
    };
  });
</script>

<link href="shared.scss" rel="stylesheet" />

<nav class:scrolled={isScrolled}>
  <a class="title" href="/static" use:cursorEnter use:cursorLeave>Tom Planche</a
  >
  <span
    class="now-playing"
    in:fade={{ duration: 500 }}
    out:fade={{ duration: 500 }}
    use:cursorEnter
    use:cursorLeave
  >
    {#if isLive() && currentTrack}
      <LiveIndicator size="small" />
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
  @use "$lib/styles/variables" as v;
  @use "./shared" as s;

  nav {
    @include s.header-footer();

    height: v.$header-height;

    top: 0;

    // (excluding outline)
    transition:
      width 0.3s cubic-bezier(0.4, 0, 0.2, 1),
      left 0.3s cubic-bezier(0.4, 0, 0.2, 1),
      border-radius 0.3s cubic-bezier(0.4, 0, 0.2, 1),
      top 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    // Blurry background
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px); // Compatible with Safari

    &.scrolled {
      border-radius: v.$main-padding v.$main-padding 0 0;

      top: v.$main-padding;
    }

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
