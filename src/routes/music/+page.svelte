<script lang="ts">
  // Imports
  import {onMount} from "svelte";
  import {songsStore} from "$lib/stores/songStore";
  import {cursorEnter, cursorLeave} from "$lib/actions/cursor";
  import type {TCurrentlyPlayedSong} from "$lib/types/song";

  // Variables
  let songs = $state<TCurrentlyPlayedSong[]>([]);

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

<section class="music-section">
  <h1>Recently Played</h1>

  <div class="songs-table">
    {#each songs as song}
      <article
          class="song-card"
          use:cursorEnter
          use:cursorLeave
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

        transition: background-color 0.3s;

        &:hover {
          background-color: var(--background-color);
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
  }


</style>
