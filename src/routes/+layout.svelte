<script lang="ts">
  // Imports
  import "$lib/styles/main.scss";
  import {type SvelteComponent} from "svelte";
  import Header from "$lib/components/Header.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import Cursor from "$lib/components/Cursor.svelte";
  import {refStore} from "$lib/stores/refStore";
  import {mainStore} from "$lib/stores/mainStore";
  import Analytics from "$lib/components/Analytics.svelte";


  // Variables
  // Props
  let {children} = $props();

  // Bindings
  let cursor: SvelteComponent | null = $state(null);

  /**
   * Delay between each title update in milliseconds
   */
  const DELAY_MS: number = 200;

  let titleScrollInterval: number;

  // Functions
  /**
   * Returns the next state of the title by moving the first character to the end
   * @param currentTitle - The current title string
   * @returns The next state of the title
   */
  const getNextTitle = (currentTitle: string): string => {
    if (!currentTitle) {
      throw new Error('Title cannot be empty');
    }
    return currentTitle.slice(1) + currentTitle[0];
  }

  /**
   * Initializes the scrolling title animation
   */
  const initTitleScroll = (): void => {
    // Store the original title
    let currentTitle = "Tom Planche's website ";

    // Start the scroll animation
    titleScrollInterval = setInterval((): void => {
      currentTitle = getNextTitle(currentTitle);
      document.title = currentTitle;
    }, DELAY_MS);
  }

  // Watchers
  $effect(() => {
    if (cursor) {
      $refStore.cursor = cursor;
    }
  });

  // Initialize
  $effect(() => {
    if (typeof window === 'undefined') return;

    // Check if device is touch-primary
    $mainStore.isMobileOrTablet = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

    // Start the animation when the page loads
    initTitleScroll();

    return () => {
      clearInterval(titleScrollInterval);
    };
  });
</script>

<Analytics/>

<div id="noise"></div>
{#if !$mainStore.isMobileOrTablet}
  <Cursor bind:this={cursor}/>
{/if}

{#if !$mainStore.clearPage}
  <Header/>
{/if}

<main>
  {@render children()}
</main>


{#if !$mainStore.clearPage}
  <Footer/>
{/if}


<style lang="scss">
  @use '$lib/styles/variables';

  main {
    padding: calc(#{variables.$main-padding} + #{variables.$header-height}) variables.$main-padding variables.$main-padding;

    min-height: variables.$min-main-height;
    width: 100%;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    overflow: hidden;
    position: relative;
  }

  #noise {
    pointer-events: none;
    z-index: 99999;
    opacity: .06;
    background-image: url(/noise.gif);
    background-position: 0 0;
    background-size: 250px;
    background-attachment: fixed;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
</style>
