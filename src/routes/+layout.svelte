<script lang="ts">
  // Imports
  import type { SvelteComponent } from 'svelte';
  import { style_vars } from '$lib/globals';
  import '$lib/styles/main.scss';
  import Cursor from '$lib/components/Cursor.svelte';
  import { store } from '$lib/appStore';
  import Footer from '$lib/components/Footer.svelte';
  import Header from '$lib/components/Header.svelte';
  import SongPlaying from '$lib/components/SongPlaying.svelte';

  // Variables
  let headerHeight = style_vars.header_height;
  let padding = style_vars.main_padding;

  export const padding_top = `calc(2 * ${padding} + ${headerHeight})`;

  let cursor: SvelteComponent;

  $: if (cursor) {
    $store.cursor = cursor;
  }
</script>

<main style="padding: 0 {padding};">
  <Cursor bind:this={cursor} />
  {#if $store.loadingAnimationIsDone}
    <Header />
  {/if}

  <slot />

  {#if $store.loadingAnimationIsDone}
    <SongPlaying />
    <Footer />
  {/if}
</main>

<style lang="scss">
  @import '$lib/styles/reset';
  @import '$lib/styles/base';
  @import '$lib/styles/variables';

  main {
    min-height: 100vh;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;

    /* cursor: none; */

    background-color: $app-bg-light;
    transition: background-color 0.5s ease-in-out;

    :global(body.dark) & {
      color: $gh-text;
      background-color: $app-bg-dark;
    }

    cursor: none;
  }
</style>
