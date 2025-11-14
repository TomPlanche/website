<script lang="ts">
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { cursorEnter, cursorLeave } from "$lib/actions/cursor";
  import { scrollTrigger } from "$lib/components/header-footer/index"; // Statee
  import LiveIndicator from "$lib/components/LiveIndicator.svelte";
  import { BackendSongSchema, type TBackendSong } from "$lib/types/lastfm";

  // Statee
  let currentTrack: TBackendSong | null = $state(null);
  const isLive = $derived(() => currentTrack?.currently_playing);

  // Scroll effect state
  let scrollY: number = $state(0);
  let canScroll: boolean = $state(false);
  const isScrolled: boolean = $derived(!canScroll || scrollY >= scrollTrigger);

  // Functions
  const fetchNowPlaying = async () => {
    try {
      const response = await fetch("/api-front/music/now-playing");

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");
        console.error(
          `Failed to fetch now playing: ${response.status} - ${errorText}`,
        );
        return;
      }

      const data = await response.json().catch((err) => {
        console.error(
          "Failed to parse response as JSON:",
          err instanceof Error ? err.message : "Unknown error",
        );
        return null;
      });

      if (!data) {
        return;
      }

      const parse = BackendSongSchema.safeParse(data);

      if (parse.success) {
        currentTrack = parse.data;
      } else {
        console.error(
          "Failed to parse now playing response:",
          parse.error.issues.map((i) => i.message).join(", "),
        );
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.error("Error fetching now playing:", message);
    }
  };

  // Lifecycle
  onMount(() => {
    (async () => {
      await fetchNowPlaying();
    })();

    // Refresh every 10 seconds
    const interval = setInterval(fetchNowPlaying, 10000);

    const updateScrollY = (): void => {
      scrollY = window.scrollY;
    };

    const updateCanScroll = (): void => {
      canScroll = document.documentElement.scrollHeight > window.innerHeight;
    };

    const updateAll = (): void => {
      updateScrollY();
      updateCanScroll();
    };

    // Initial update
    updateAll();

    window.addEventListener("scroll", updateScrollY);
    window.addEventListener("resize", updateAll);

    return (): void => {
      clearInterval(interval);

      window.removeEventListener("scroll", updateScrollY);
      window.removeEventListener("resize", updateAll);
    };
  });
</script>

<nav class:scrolled={isScrolled}>
  <a class="title" href="/" use:cursorEnter use:cursorLeave>Tom Planche</a>
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
