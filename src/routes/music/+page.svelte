<script lang="ts">
  import { onMount } from "svelte";
  import { songsStore } from "$lib/stores/songStore";
  import type { TBackendSong } from "$lib/types/lastfm";

  /**
   * Variables
   */
  let fetchingSongs = $state(true);
  let songs = $state<TBackendSong[]>([]);
  let grid: HTMLDivElement | null = $state(null);

  let imageLoadStates = $state<
    Map<string, { loaded: boolean; error: boolean }>
  >(new Map());

  /**
   * Functions
   */
  const handleImageLoad = (songId: string) => {
    const currentState = imageLoadStates.get(songId) || {
      loaded: false,
      error: false,
    };
    imageLoadStates.set(songId, { ...currentState, loaded: true });
    // Trigger reactivity
    imageLoadStates = new Map(imageLoadStates);
  };

  const handleImageError = (songId: string) => {
    const currentState = imageLoadStates.get(songId) || {
      loaded: false,
      error: false,
    };
    imageLoadStates.set(songId, { ...currentState, error: true });
    // Trigger reactivity
    imageLoadStates = new Map(imageLoadStates);
  };

  const getImageState = (songId: string) => {
    return imageLoadStates.get(songId) || { loaded: false, error: false };
  };

  /**
   * Lifecycle
   */
  onMount(() => {
    // Filter out songs without a proper image URL
    songs = $songsStore.filter((song: TBackendSong) => {
      return (
        song.image_url &&
        song.image_url.length > 0 &&
        !song.image_url?.includes("2a96cbd8b46e442fc41c2b86b821562f")
      );
    });

    // Initialize loading states for all songs
    for (const song of songs) {
      const songId = `${song.artist}-${song.name}`;
      imageLoadStates.set(songId, { loaded: false, error: false });
    }
    imageLoadStates = new Map(imageLoadStates);

    setTimeout(() => {
      if (!grid) {
        console.warn("Grid element is not defined.");
        return;
      }

      const gridStyles = window.getComputedStyle(grid);
      const columnsRaw = gridStyles.getPropertyValue("grid-template-columns");

      const numColumns = columnsRaw.split(" ").filter(Boolean).length;

      // slice the songs array to match the number of columns for modulo
      songs = songs.slice(0, songs.length - (songs.length % numColumns));

      fetchingSongs = false;
    }, 0);
  });
</script>

<section class="music-section">
  <h1>Recently Played (last {songs.length} songs)</h1>

  <div bind:this={grid} class="song-container">
    {#if fetchingSongs}
      <div class="song-container__item">Loading...</div>
    {:else if songs.length === 0}
      <div class="song-container__item">No songs found</div>
    {:else}
      {#each songs as song}
        {@const songId = `${song.artist}-${song.name}`}
        {@const imageState = getImageState(songId)}
        <div class="song-container__item">
          <!-- Loading placeholder -->
          {#if !imageState.loaded && !imageState.error}
            <div class="image-placeholder">
              <div class="skeleton-loader"></div>
            </div>
          {/if}

          <!-- Error placeholder -->
          {#if imageState.error}
            <div class="image-error">
              <span>♪</span>
            </div>
          {/if}

          <!-- Actual image -->
          <img
            alt=""
            src={song.image_url}
            title={`${song.name} by ${song.artist}`}
            class:loaded={imageState.loaded}
            class:error={imageState.error}
            onload={() => handleImageLoad(songId)}
          />
        </div>
      {/each}
    {/if}
  </div>
</section>

<style lang="scss">
  @use "$lib/styles/variables";

  $line-height: 5rem;
  $top-padding: 0.5rem;

  .music-section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    width: 100%;
    margin: variables.$main-elem-padding;
    padding: variables.$main-padding;

    h1 {
      align-self: flex-start;
      padding: $top-padding;
    }

    .song-container {
      $page-padding: 5vw;
      $c-gap: 1vmin;
      $r-gap: $c-gap;
      $column-size: 80px;
      --column-count: 3;

      width: 100%;

      display: grid;
      grid-template-columns: repeat(
        var(--column-count),
        minmax($column-size, 1fr)
      );
      grid-column-gap: $c-gap;
      grid-row-gap: $r-gap;

      @media screen and (min-width: 768px) {
        --column-count: 7;
      }

      .song-container__item {
        height: 100%;
        width: 100%;

        margin: 0;
        overflow: hidden;

        position: relative;
        aspect-ratio: 1 / 1;

        &:hover {
          img.loaded {
            transform: scale(1.75);
          }
        }

        // Loading placeholder
        .image-placeholder {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(128, 128, 128, 0.1);
          border-radius: 4px;

          .skeleton-loader {
            width: 100%;
            height: 100%;
            background: linear-gradient(
              90deg,
              rgba(128, 128, 128, 0.1) 25%,
              rgba(128, 128, 128, 0.2) 50%,
              rgba(128, 128, 128, 0.1) 75%
            );
            background-size: 200% 100%;
            animation: skeleton-loading 2s infinite;
          }
        }

        // Error placeholder
        .image-error {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(128, 128, 128, 0.1);
          border-radius: 4px;
          color: rgba(128, 128, 128, 0.6);
          font-size: 1.5rem;
        }

        img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          aspect-ratio: 1 / 1;
          object-fit: cover;

          // Hide by default
          opacity: 0;
          transition:
            opacity 0.3s ease-in-out,
            transform 0.3s ease-in-out;

          // Show when loaded
          &.loaded {
            opacity: 1;
          }

          // Hide when error
          &.error {
            display: none;
          }
        }
      }
    }
  }

  @keyframes skeleton-loading {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
</style>
