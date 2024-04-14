<script lang="ts">
  // Imports
  import { gsap } from 'gsap';
  import { ScrambleTextPlugin } from 'gsap/dist/ScrambleTextPlugin';
  import { onMount } from 'svelte';
  import Hoverable from '$lib/components/Hoverable.svelte';
  import { store } from '../appStore';
  import PrimaryButton from '$lib/components/PrimaryButton.svelte';
  import SongPlaying from '$lib/components/SongPlaying.svelte';

  // Register plugins
  gsap.registerPlugin(ScrambleTextPlugin);

  // Variables
  const title = 'Tom Planche';
  const subtitle = 'I do stuff with code';

  // Watchers

  // Methods
  onMount(() => {
    /**
     * Split h1 and h2 by words.
     * Each word will be wrapped in a span.
     *
     * Only the first letter of each word will be visible.
     *
     * Then, we animate the first letter of each word to make the full word appear.
     */
    const gsapTimeline = gsap.timeline({
      defaults: { duration: 0.5, ease: 'power2.out' },
      onStart: () => {
        $store.loadingAnimationIsDone = false;
      },
      onComplete: () => {
        $store.loadingAnimationIsDone = true;
      }
    });

    gsapTimeline
      .to(
        'h1',
        {
          scrambleText: {
            text: title,
            chars: title.replace(/a/g, '4').replace(/e/g, '3').replace(/o/g, 'O'),
            revealDelay: 0.625
          },
          duration: 1
        },
        '<'
      )
      .to(
        'h2',
        {
          scrambleText: {
            text: subtitle,
            chars: '<>[]{}@&#$*%()!=+-',
            revealDelay: 0.0625
          },
          duration: 1
        },
        '<'
      );
  });
</script>

<section>
  <div class="intro">
    <h1>Tom Planche</h1>
    <h2>I do <span>stuff</span> with code</h2>
  </div>
  {#if $store.loadingAnimationIsDone}
    <SongPlaying showIfNotPlaying />
  {/if}
</section>

<style lang="scss">
  @import '../lib/styles/variables';

  section {
    height: 100%;
    width: 100%;

    h1,
    h2 {
      text-align: left;
      font-family: 'PP Mondwest', serif;
      text-shadow: 0 0 5px $aled;

      color: $aled;

      @media (max-width: 860px) {
        text-align: center;
      }
    }

    h1 {
      font-size: 7vw;
      font-weight: 900;
    }

    h2 {
      font-size: 4vw;
      font-weight: 400;
    }

    .intro {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      @include no-user-select();
    }
  }
</style>
