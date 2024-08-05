<script lang="ts">
// Imports
import Header from "$lib/components/Header.svelte";
import { style_vars } from "$lib/globals";
import { mainStore } from "$lib/stores/mainStore";
import "$lib/styles/main.scss";
import Cursor from "$lib/components/Cursor.svelte";
import MusicPlaying from "$lib/components/MusicPlaying.svelte";
import { type SvelteComponent, onMount } from "svelte";

// Variables
const { mainPadding } = style_vars;

let dimensions = {
	width: 0,
	height: 0,
};

// Binds
let cursor: SvelteComponent;

// Watchers
$: if (cursor) {
	$mainStore.cursor = cursor;
}

// Lifecycle
onMount(() => {
	dimensions = {
		width: window.innerWidth,
		height: window.innerHeight,
	};
});

// Functions
</script>

<svelte:window on:resize={() => {
  dimensions.width = window.innerWidth;
  dimensions.height = window.innerHeight;
}} />

{#if $mainStore.loadingAnimationIsDone}
  <Header />
{/if}

<div id="noise"></div>

<main style="padding: {mainPadding} 0;">

  <slot></slot>

  {#if dimensions.width > 768}
    <MusicPlaying debug={false}/>
    <Cursor bind:this={cursor} />
  {/if}
</main>

<style lang="scss">
  main {
    min-height: 100vh;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
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
