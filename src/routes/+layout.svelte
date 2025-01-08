<script lang="ts">
  // Imports
  import "$lib/styles/main.scss";

  // Variables

  // Functions
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
