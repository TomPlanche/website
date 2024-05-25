<script lang="ts">
  import { onMount } from 'svelte';
  import { LINKS, store } from '$lib/appStore';

  onMount(() => {
    $store.currentLink = LINKS.ABOUT;
    $store.isFirstLoad = false;
    $store.loadingAnimationIsDone = true;
  });
</script>

<section>
  <h1>About</h1>
  <p>
    I'm a software engineer with a passion for web development. I'm currently working at <a
      href="https://www.avenuecode.com/">Avenue Code</a
    > as a Frontend Engineer.
  </p>
  <p>
    I have experience with a wide range of technologies, including JavaScript, TypeScript, React,
    Svelte, Node.js, Express, MongoDB, and PostgreSQL.
  </p>
  <p></p>
</section>

<style lang="scss">
  section {
    height: 100vh;
    width: 100%;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    background: red;
  }
</style>
