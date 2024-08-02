<script lang="ts">
// Imports
import Header from "$lib/components/Header.svelte";
import { pageSizeWithPadding, style_vars } from "$lib/globals";
import { mainStore } from "$lib/mainStore";

// Variables
const { mainPadding, headerHeight } = style_vars;

// Functions
</script>

{#if $mainStore.loadingAnimationIsDone}
  <Header />
{/if}

<div id="noise"></div>

<main style="padding: {mainPadding} 0;">

  <slot></slot>
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
