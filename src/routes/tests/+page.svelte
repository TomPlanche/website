<script lang="ts">
import Hoverable from "$lib/components/Hoverable.svelte";
import { mainStore } from "$lib/stores/mainStore";
import { onMount } from "svelte";

// Lifecycle
onMount(() => {
	$mainStore.loadingAnimationIsDone = true;
});

// Methods
</script>

<article>
  <Hoverable
      on:click={() => {
        console.log("hihihi");
      }}
  ><h1>TESTS !</h1></Hoverable>
<!--  <Experiences />-->

<!--  <Link href="www.aled.com">hihihi</Link>-->
</article>

<style lang="scss">
  article {
    height: 100%;
    width: 100%;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

  }
</style>
