<script lang="ts">
import Contact from "$lib/components/Contact.svelte";
import { mainStore } from "$lib/stores/mainStore";
import { onMount } from "svelte";

// Lifecycle
onMount(() => {
	$mainStore.loadingAnimationIsDone = true;
});

// Methods
</script>

<article>
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
