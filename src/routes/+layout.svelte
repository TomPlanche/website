<script lang="ts">
// Imports
import { onMount } from "svelte";

import Cursor from "$lib/components/Cursor.svelte";
import type TCursor from "$lib/components/Cursor.svelte";
import MusicPlaying from "$lib/components/MusicPlaying.svelte";

import { mainStore } from "$lib/stores/mainStore";

import "$lib/styles/main.scss";

import Footer from "$lib/components/Footer.svelte";
import NiceHeader from "$lib/components/NiceHeader.svelte";
import { gsap } from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

// Variables

let dimensions = {
	width: 0,
	height: 0,
};

// Binds
let cursor: TCursor;

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
<!--  <Header />-->
  <NiceHeader />
{/if}


<main>
  <div id="noise"></div>

  <slot></slot>

</main>

{#if dimensions.width > 768}
  <Cursor bind:this={cursor} />
<!--  <Footer />-->

<!--  <MusicPlaying debug={false} showIfNotPlaying={false}/>-->
{/if}

<style lang="scss">
  @import '$lib/styles/variables';

  main {
    min-height: $main-min-height;
    padding: $main-top-padding $main-padding;

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
