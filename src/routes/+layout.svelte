<script lang="ts">
  // Imports
  import {type Theme, theme} from "$lib/stores/theme";
  import "$lib/styles/main.scss";
  import {onMount} from "svelte";
  import Header from "$lib/components/Header.svelte";

  // Variables

  // Functions

  // Lifecycle
  onMount(() => {
    // Get theme from localStorage and apply it
    const storedTheme = localStorage.getItem("selected-theme") as Theme;
    if (storedTheme) {
      theme.set(storedTheme);
    }
  });
</script>


<div id="noise"></div>

<main>
  <Header />
  <slot></slot>
</main>

<style lang="scss">
  @use '$lib/styles/variables';

  main {
    padding: variables.$main-padding;

    min-height: 100vh;
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
