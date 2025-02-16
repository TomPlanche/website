<script lang="ts">
  // Imports
  import {onMount} from "svelte";
  import {songsStore} from "$lib/stores/songStore";
  import {cursorEnter, cursorLeave} from "$lib/actions/cursor";
  import type {TCurrentlyPlayedSong} from "$lib/types/song";
  import {Spring} from "svelte/motion";

  // Variables
  let songs = $state<TCurrentlyPlayedSong[]>([]);
  let hoveredSong = $state<TCurrentlyPlayedSong | null>(null);

  // Springs
  const coords = new Spring(
    {
      x: 0,
      y: 0
    },
    {stiffness: 0.3, damping: 0.8}
  );

  // Functions
  const formatPlayCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }

    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  // Lifecycle
  onMount(() => {
    // sort by play count
    songs = $songsStore.sort((a, b) => b.play_count - a.play_count).splice(0, 25);
  });
</script>

<svelte:window
    onmousemove={(e) => {
      coords.target = {
        x: e.clientX,
        y: e.clientY
      };
    }}
/>

<section class="music-section">
  <h1>Recently Played</h1>

  <div class="songs-table"
       aria-hidden="true"

       onmouseleave={() => hoveredSong = null}
  >
    {#each songs as song}
      <article
          class="song-card"
          use:cursorEnter={{opacity: 0}}
          use:cursorLeave

          onmouseenter={() => hoveredSong = song}
      >
        <!--        <div class="image-container">-->
        <!--          <img-->
        <!--              src={song.image_url}-->
        <!--              alt={`${song.name} by ${song.artist}`}-->
        <!--              loading="lazy"-->
        <!--          />-->
        <!--        </div>-->
        <div class="infos">
          <h2 class="song-name">{song.name}</h2>
          <p class="artist-name">{song.artist}</p>
          <p class="album-name">{song.album}</p>
        </div>
        <span class="play-count">{formatPlayCount(song.play_count)}&nbsp;play{song.play_count > 1 ? 's' : ''}</span>
      </article>
    {/each}
  </div>

  {#if hoveredSong}
    <div class="album-cover"
         style="top: {coords.current.y}px; left: {coords.current.x}px;"
    >
      <img
          src={hoveredSong.image_url}
          alt={`${hoveredSong.name} by ${hoveredSong.artist}`}
          loading="lazy"
      />
    </div>
  {/if}
</section>


<style lang="scss">
  @use '$lib/styles/variables';

  $line-height: 5rem;

  .music-section {
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;

    h1 {
      font-size: 3rem;
      margin-bottom: 2rem;
      font-family: "Mondwest", monospace;
      text-align: left;
    }


    .songs-table {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      width: 100%;

      .song-card {
        height: $line-height;
        width: 100%;

        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        padding: 1rem;
        border-bottom: 1px solid var(--text-color);

        transition: background-color 0.3s, padding-left 0.3s;

        &:hover {
          background-color: var(--background-color);
          padding-left: 2rem;
        }

        .infos {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;

          .song-name {
            font-size: 1.5rem;
            font-family: "Mondwest", monospace;
            margin-right: 1rem;
          }

          .artist-name {
            font-size: 1.25rem;
            font-family: "Mondwest", monospace;
            margin-right: 1rem;
          }

          .album-name {
            font-size: 1.125rem;
            font-family: "Mondwest", monospace;
            margin-right: 1rem;
          }
        }
      }

      .play-count {
        font-size: 1.5rem;
        font-family: "Mondwest", monospace;
        margin-right: 1rem;
      }

    }

    .album-cover {
      position: fixed;
      top: 0;
      left: 0;
      transform: translate(-50%, -50%);
      z-index: 9999;
      pointer-events: none;

      img {
        width: 200px;
        height: 200px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
      }
    }
  }


</style>
