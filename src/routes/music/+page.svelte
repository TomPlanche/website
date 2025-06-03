<script lang="ts">
import { songsStore } from "$lib/stores/songStore";
import type { TBackendSong } from "$lib/types/lastfm";
import { onMount } from "svelte";

/**
 * Variables
 */
let songs = $state<TBackendSong[]>([]);
let grid: HTMLDivElement | null = $state(null);

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
  }, 0);
});
</script>

<section class="music-section">
  <h1>Recently Played (last {songs.length} songs)</h1>

  <div bind:this={grid} class="song-container">
    {#if songs.length === 0}
      <p>No songs found.</p>
    {/if}
    {#each songs as song}
      <figure class="grid__item">
        <div class="grid__item-img" style="background-image: url({song.image_url})"></div>
      </figure>
    {/each}
  </div>
</section>

<style lang="scss">
  @use '$lib/styles/variables';

  $line-height: 5rem;
  $top-padding: .5rem;

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
      grid-template-columns: repeat(var(--column-count), minmax($column-size, 1fr));
      grid-column-gap: $c-gap;
      grid-row-gap: $r-gap;

      @media screen and (min-width: 768px) {
        --column-count: 7;
      }

      .grid__item {
        height: 100%;
        width: 100%;
        margin: 0;
        overflow: hidden;

        .grid__item-img {
          aspect-ratio: 1 / 1;
          background-size: cover;
          background-position: center;

          &:hover {
            transform: scale(1.05);
            transition: transform 0.3s ease-in-out;
          }
        }

        //.grid__item-caption {
        //  font-size: 11px;
        //  font-weight: 500;
        //  margin-top: 0.15rem;
        //}
      }
    }
  }
</style>
