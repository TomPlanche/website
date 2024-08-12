<script lang="ts">
// Imports
import type {
	TGetUserLovedTracksResponse,
	TLovedTrack,
} from "$lib/LastFMMiddleware/LastFMHandler";
import { LINKS, mainStore } from "$lib/stores/mainStore";

import { onMount } from "svelte";

// Variables
type TData = {
	lovedTracks: Array<TLovedTrack>;
};

/**
 * Data received from the server.
 *
 * @type {TGetUserLovedTracksResponse}
 */
export let data: TData;

$: console.log(data.lovedTracks[0]);

// Functions

onMount(() => {
	$mainStore.loadingAnimationIsDone = true;
	$mainStore.currentLink = LINKS[2];
});
</script>

<h1>MUSIC</h1>

<style lang="scss">

</style>
