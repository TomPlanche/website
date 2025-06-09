<script lang="ts">
// Imports
import "$lib/styles/main.scss";
import Cursor from "$lib/components/Cursor.svelte";
import Footer from "$lib/components/Footer.svelte";
import Header from "$lib/components/Header.svelte";
import { mainStore } from "$lib/stores/mainStore";
import { refStore } from "$lib/stores/refStore";
import type { SvelteComponent } from "svelte";

/**
 * Variables
 */
// Props
const { children } = $props();

// Bindings
let cursor: SvelteComponent | null = $state(null);

//Delay between each title update in milliseconds
const DELAY_MS: number = 200;
let titleScrollInterval: number;

// Title configuration
const TITLE = "TomPlanche";
let currentIndex = $state(0);

// Functions
/**
 * Returns the next state of the title by rotating through the characters
 * @returns The next state of the title
 */
const getNextTitle = (): string => {
  currentIndex = (currentIndex + 1) % TITLE.length;
  return TITLE.slice(currentIndex) + TITLE.slice(0, currentIndex);
};

/**
 * Initializes the scrolling title animation
 */
const initTitleScroll = (): void => {
  // Start the scroll animation
  titleScrollInterval = setInterval((): void => {
    document.title = getNextTitle();
  }, DELAY_MS);
};

// Watchers
$effect(() => {
  if (cursor) {
    $refStore.cursor = cursor;
  }
});

// Initialize
$effect(() => {
  if (typeof window === "undefined") return;

  // Check if device is touch-primary
  $mainStore.isMobileOrTablet = window.matchMedia(
    "(hover: none) and (pointer: coarse)",
  ).matches;

  // Start the animation when the page loads
  initTitleScroll();

  return () => {
    clearInterval(titleScrollInterval);
  };
});
</script>

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

  $spacing-between-dots: 20px;
  :global(body) {
    background-image: radial-gradient(color-mix(in srgb, var(--text-color) 25%, transparent), 1px, transparent 0);
    background-size: $spacing-between-dots $spacing-between-dots;
  }

  main {
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
