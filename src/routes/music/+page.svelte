<script lang="ts">
  import { songsStore } from "$lib/stores/songStore";
  import type { TBackendSong } from "$lib/types/lastfm";
  // Imports
  import { onMount } from "svelte";

  // Variables
  let songs = $state<TBackendSong[]>([]);

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
    // sort by date (.date.uts) but date can be undefined
    songs = $songsStore.sort((a: TBackendSong, b: TBackendSong) => {
      if (a.date && b.date) {
        return a.date.getDate() - b.date.getDate();
      }

      return 0;
    });
  });
</script>

<section class="music-section">
  <h1>Recently Played (last 100 songs)</h1>

  <div class="song-container">
    {#each songs as song}
      <article
          class="song-card"
      >
        <div class="left">
          <img
              src={song.image_url}
              alt={song.album}
              title={song.album}
          />
          <div class="infos">
            <h2
                class="song-name"
                title={song.name}
            >
              {song.name}
            </h2>
            <p
                class="artist-name"
                title={song.artist}
            >
              {song.artist}
            </p>
          </div>
        </div>
        <span class="play-count">{formatPlayCount(song.play_count)}&nbsp;play{song.play_count > 1 ? 's' : ''}</span>
      </article>
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
    padding-bottom: calc(variables.$footer-height + $top-padding);

    h1 {
      align-self: flex-start;
      padding: $top-padding;
    }

    .song-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: $top-padding;

      width: 90%;
      max-width: 900px;

      .song-card {
        height: $line-height;
        width: 100%;

        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        padding: .5rem;
        border: 1px solid var(--text-color);
        border-radius: 6px;

        transition: background-color 0.3s, padding-left 0.3s;

        .left {
          height: 100%;
          width: 100%;
          
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: center;


          img {
            height: 100%;
            width: auto;
            border-radius: 2px;
            margin-right: 1rem;
          }

          .infos {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;

            .song-name, .artist-name {
              // limit to 2 lines
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
              font-family: "Supply Mono", monospace;
              margin-right: 1rem;
            }

            .song-name {
              font-size: 1.125rem;
              text-align: left;
            }

            .artist-name {
              font-size: 1rem;
            }
          }
        }
      }

      .play-count {
        font-size: .85rem;
        font-family: "Supply Mono", monospace;
        margin-right: 1rem;
      }

    }
  }
</style>
