<script lang="ts">
import Hoverable from "$lib/components/Hoverable.svelte";
import MusicPlaying from "$lib/components/MusicPlaying.svelte";
import { mainStore } from "$lib/stores/mainStore";
import { onMount } from "svelte";

// Lifecycle
onMount(() => {
	$mainStore.loadingAnimationIsDone = true;
});

// Methods
</script>

<article>
  <Hoverable><h1>TESTS !</h1></Hoverable>
</article>


<style lang="scss">
  article {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200vh;
    width: 100%;
  }
</style>
