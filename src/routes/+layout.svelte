<script lang="ts">
  // Imports
  import {type Theme, theme} from "$lib/stores/theme";
  import "$lib/styles/main.scss";
  import {onMount} from "svelte";

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

<main>

  <slot></slot>
</main>

<style lang="scss">
  @use '$lib/styles/variables';

  main {
    padding: variables.$main-padding;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    overflow: hidden;
    position: relative;
  }
</style>
