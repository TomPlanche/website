<script lang="ts">
import type { TLovedTrack } from "$lib/LastFMMiddleware/LastFMHandler";
import App from "$lib/components/three/App.svelte";
import { mainStore } from "$lib/stores/mainStore";
import { onMount } from "svelte";

type TData = {
	lovedTracks: Array<TLovedTrack>;
};

/**
 * Data received from the server.
 *
 * @type {TGetUserLovedTracksResponse}
 */
export let data: TData;

// Lifecycle
onMount(() => {
	$mainStore.loadingAnimationIsDone = true;
	$mainStore.hideFooter = true;
});

// Methods
</script>

<article>
  <App tracks={data.lovedTracks}/>
</article>

<style lang="scss">
  article {
    height: 80vh;
    width: 100%;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

  }
</style>
