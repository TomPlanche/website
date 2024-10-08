<script lang="ts">
import type { TLovedTrack } from "$lib/LastFMMiddleware/LastFMHandler";
import Contact from "$lib/components/Contact.svelte";
import App from "$lib/components/three/App.svelte";
import { mainStore } from "$lib/stores/mainStore";
import { onMount } from "svelte";

// get `tracks` from the `+page.ts` file
export let data: { lovedTracks: TLovedTrack[] };

$: console.log(data);

// Lifecycle
onMount(() => {
	$mainStore.loadingAnimationIsDone = true;
});

// Methods
</script>

<article>
  <App tracks={data.lovedTracks}/>
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
