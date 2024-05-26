<script lang="ts">
  // Imports
  import { onMount } from 'svelte';
  import { scale, fade } from 'svelte/transition';
  import { gsap } from 'gsap/dist/gsap';
  import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

  import { style_vars } from '$lib/globals';
  import { store } from '$lib/appStore';
  import type { TRecentTracksTrackAll } from '$lib/LastFMHandler';
  import Hoverable from '$lib/components/Hoverable.svelte';

  gsap.registerPlugin(ScrollTrigger);
  // Variables
  // Props
  /**
   * Debug mode
   *
   * @type {boolean}
   */
  export let debug: boolean = false;

  /**
   * Show even if the song is not playing.
   * Use fake data.
   *
   * @type {boolean}
   */
  export let showIfNotPlaying: boolean = false;

  const defaultSong = {
    artist: { mbid: 'fda925d2-7af4-4b67-b8c1-692292c9cb18', '#text': 'Cosmo Sheldrake' },
    streamable: false,
    image: [
      {
        size: 'small',
        '#text': 'https://lastfm.freetls.fastly.net/i/u/34s/742460b81269acbe6b34acc5cc6fdf22.jpg'
      },
      {
        size: 'medium',
        '#text': 'https://lastfm.freetls.fastly.net/i/u/64s/742460b81269acbe6b34acc5cc6fdf22.jpg'
      },

      {
        size: 'large',
        '#text': 'https://lastfm.freetls.fastly.net/i/u/174s/742460b81269acbe6b34acc5cc6fdf22.jpg'
      },
      {
        size: 'extralarge',
        '#text':
          'https://lastfm.freetls.fastly.net/i/u/300x300/742460b81269acbe6b34acc5cc6fdf22.jpg'
      }
    ],
    mbid: 'f111f625-b623-4554-bc6f-dfa64c33b262',
    album: { mbid: '', '#text': 'Stop the Music - Single' },
    name: 'Does The Swallow Dream Of Flying',
    '@attr': { nowplaying: 'true' },
    url: 'https://www.last.fm/music/Cosmo+Sheldrake/_/Does+The+Swallow+Dream+Of+Flying'
  };

  // Refs
  let container: HTMLDivElement;
  let infos: HTMLDivElement;

  let fetchInterval: number;

  // Style
  let padding = style_vars.main_padding;

  let finalStyle = `
    bottom: ${padding};
    right: ${padding};
  `;

  if (debug) {
    finalStyle += `
        border: 2px dashed red;
    `;
  }

  // gsap
  let gsapTimeline: gsap.core.Timeline;

  // Types
  type T_Size = 'small' | 'large';
  type T_compareTracks = (
    track1: TRecentTracksTrackAll,
    track2: TRecentTracksTrackAll | null
  ) => boolean;

  // States
  let size: T_Size = 'small';
  let song = $store.songCurrentlyPlaying;

  // Other
  let isAnimating = false;

  // Watchers
  // $: if ($store.hideIsPlaying) {
  //   song = null;
  // }

  // Functions
  const handleClick = async (): Promise<void> => {
    return new Promise((resolve) => {
      if (isAnimating) return;

      if (size === 'small') {
        size = 'large';

        gsapTimeline
          .to(container, {
            duration: 0.5,
            height: '6rem',
            width: '6rem'
          })
          .to(container, {
            duration: 1,
            width: 'auto',

            onComplete: () => {
              resolve();
            }
          });
      } else {
        gsapTimeline
          .to(infos, {
            opacity: 0,
            duration: 0.5
          })
          .to(
            infos,
            {
              duration: 1,
              width: 0,
              padding: 0,
              onComplete: () => {
                size = 'small';
              }
              // 500ms delay to let the animation finish
            },
            '<.35'
          )
          .to(
            container,
            {
              padding: '4px',
              gap: 0
            },
            '<'
          )
          .to(container, {
            duration: 0.5,
            height: '4rem',
            width: '4rem',

            onComplete: () => {
              resolve();
            }
          });
      }
    });
  };

  /**
   * Compare two tracks to see if they are the same.
   *
   * @param track1 {TRecentTracksTrackAll} The first track to compare
   * @param track2 {TRecentTracksTrackAll | null} The second track to compare
   *
   * @returns {boolean} True if the tracks are the same, false otherwise
   */
  const compareTracks: T_compareTracks = (
    track1: TRecentTracksTrackAll,
    track2: TRecentTracksTrackAll | null
  ): boolean => {
    if (!track2) {
      return false;
    }

    if (track1.mbid !== '' && track2.mbid !== '') {
      return track1.mbid === track2.mbid;
    }

    return track1.name === track2.name && track1.artist['#text'] === track2.artist['#text'];
  };

  /**
   * Fetch the current song from LastFM
   */
  const fetchSong = async () => {
    debug && console.log(`[SongContainer] Fetching song...`);

    await $store.lastFMHandlerInstance
      .ifNowPlaying()
      .then(async (track: TRecentTracksTrackAll) => {
        debug &&
          console.log(`[SongContainer] Song fetched: ${track.name} - ${track.artist['#text']}`);

        if (song) {
          debug && console.log(`[SongContainer] Comparing songs...`);
          if (compareTracks(track, song)) return;

          switch (size) {
            case 'small':
              song = null;

              setTimeout(() => {
                song = track;
              }, 1000);
              break;
            case 'large':
              handleClick().then(async () => {
                song = track;

                await handleClick();
              });
              break;
          }
        } else {
          debug && console.log(`[SongContainer] Song is null, setting it...`);
          song = track;
        }
      })
      .catch(() => {
        if (!showIfNotPlaying) {
          song = null;
        }
      });
  };

  // Watchers
  $: if ($store.songCurrentlyPlaying === true) {
    fetchSong();
  }

  // Mount
  onMount(() => {
    fetchSong()
      .then(() => {
        debug && console.log(`[SongContainer] Song fetched on mount: ${song?.name}`);

        if (!song && showIfNotPlaying) {
          song = defaultSong;
        }

        fetchInterval = setInterval(() => {
          fetchSong();
        }, 5000);

        gsapTimeline = gsap.timeline({
          defaults: {
            ease: 'power4.inOut'
          },
          onStart: () => {
            isAnimating = true;
          },
          onComplete: () => {
            isAnimating = false;
          }
        });
      })
      .catch(() => {
        if (!showIfNotPlaying) {
          song = null;
        }
      });

    return () => {
      clearInterval(fetchInterval);
    };
  });
</script>

{#if song && !$store.hideIsPlaying}
  <Hoverable
    onEnterOptions={{
      opacity: 0.125,
      innerText: '🎧'
    }}
  >
    <div
      class="song_container"
      style={finalStyle}
      aria-disabled="true"
      bind:this={container}
      on:click={handleClick}
      in:scale={{ duration: 200 }}
      out:scale={{ duration: 400 }}
      aria-hidden="true"
    >
      <div class="img-container">
        <img src={song.image[song.image.length - 1]['#text']} alt="Song cover" />

        {#if size === 'small'}
          <div class="overlay">
            <i class="gg-loadbar-sound"></i>
          </div>
        {/if}
      </div>

      {#if size === 'large'}
        <div
          class="song_container__infos"
          bind:this={infos}
          in:fade={{ duration: 200, delay: 1500 }}
          out:fade={{ duration: 200 }}
        >
          <p>{song.name}</p>
          <p class="artist">{song.artist['#text']}</p>
        </div>
      {/if}
    </div>
  </Hoverable>
{/if}

<style lang="scss">
  @import '../styles/variables';

  .song_container {
    position: fixed;

    bottom: 1rem;
    right: 1rem;

    height: 4rem;
    max-height: 6rem;
    width: 4rem;
    max-width: 20rem;

    border-radius: 8px;
    padding: 4px;

    outline: 1px solid $outline-dark;

    // Blurry background
    background-color: rgba(205, 201, 255, 0.2);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px); // Compatible with Safari

    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    z-index: 900;

    @include no-user-select();

    .img-container {
      height: 100%;
      width: max-content;
      border-radius: 4px;

      position: relative;

      img {
        height: 100%;
        width: auto;
        border-radius: 4px;
      }

      .overlay {
        position: absolute;
        top: 0;
        left: 0;

        height: 100%;
        width: 100%;

        display: flex;
        justify-content: center;
        align-items: center;

        opacity: 0;

        border-radius: 4px;

        transition: opacity 200ms ease;

        z-index: 1000;

        &:hover {
          opacity: 1;

          // Blurry background
          background-color: #eeeeee25;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px); // Compatible with Safari
        }

        @keyframes gg-bar {
          10% {
            box-shadow: inset 0 -4px 0;
          }
          30% {
            box-shadow: inset 0 -10px 0;
          }
          60% {
            box-shadow: inset 0 -6px 0;
          }
          80% {
            box-shadow: inset 0 -8px 0;
          }
          to {
            box-shadow: inset 0 -2px 0;
          }
        }

        .gg-loadbar-sound,
        .gg-loadbar-sound::after,
        .gg-loadbar-sound::before {
          display: block;
          box-sizing: border-box;
          width: 2px;
          height: 12px;
          box-shadow: inset 0 -12px 0;
          animation: gg-bar 1.3s ease infinite alternate;
        }

        .gg-loadbar-sound {
          position: relative;
          transform: scale(2);
        }

        .gg-loadbar-sound::after,
        .gg-loadbar-sound::before {
          content: '';
          position: absolute;
          bottom: 0;
        }

        .gg-loadbar-sound::before {
          left: -4px;
          animation-delay: -2.4s;
        }

        .gg-loadbar-sound::after {
          right: -4px;
          animation-delay: -3.7s;
        }
      }
    }

    &__infos {
      width: max-content;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      gap: 0.5rem;
      padding: 0 1rem;

      p {
        text-align: left;
        font-family: 'Radikal', serif;
        font-size: 1.1rem;
        font-weight: bold;
        // if the text is more than 2 lines, we want to hide the overflow
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;

        // balance the text
        max-inline-size: 15ch;
        text-wrap: balance;

        &.artist {
          font-weight: bolder;
          font-size: 0.9rem;
        }
      }
    }
  }
</style>
