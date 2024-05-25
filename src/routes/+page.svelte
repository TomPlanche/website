<script lang="ts">
  // Imports
  import { onMount } from 'svelte';
  import { ScrambleTextPlugin } from 'gsap/dist/ScrambleTextPlugin';
  import { LINKS, store } from '$lib/appStore';
  import SongPlaying from '$lib/components/SongPlaying.svelte';
  import { gsap } from 'gsap';

  // Register plugins
  gsap.registerPlugin(ScrambleTextPlugin);

  // Variables
  const title = 'Tom Planche';
  const subtitle = 'I do stuff with code';

  let startState: Flip.FlipState;

  // Watchers

  // Functions

  // Methods
  onMount(() => {
    $store.currentLink = LINKS.HOME;

    if (!$store.isFirstLoad) {
      return;
    }

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
        $store.isFirstLoad = false;
      }
    });

    gsapTimeline
      .set('#my-ugly-face', { height: 0, opacity: 0 })
      .to(
        '#title',
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
      )
      .to('#my-ugly-face', { height: '20rem', duration: 0.5 })
      .to('#home', { gap: '5rem', duration: 0.5 }, '<')
      .to(
        '#my-ugly-face',
        {
          opacity: 1,
          duration: 0.5
        },
        '<0.25'
      );
  });
</script>

<section id="home" style={(!$store.isFirstLoad && 'gap: 5rem;') || null}>
  <img src="/imgs/me-blue.png" alt="My ugly face" id="my-ugly-face" />
  <div class="intro">
    <h1 id="title">Tom Planche</h1>
    <h2>I do <span>stuff</span> with code</h2>
  </div>
</section>

<style lang="scss">
  @import '../lib/styles/variables';

  #home {
    height: 100vh;
    width: 100%;

    display: flex;
    flex-direction: row-reverse;
    justify-content: center;
    align-items: center;

    h1,
    h2 {
      text-align: left;
      font-family: 'Mondwest', serif;
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

    img {
      height: 20rem;
      width: auto;
      text-shadow: 0 0 5px $aled;
    }
  }
</style>
