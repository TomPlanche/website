<script lang="ts">
import MusicPlaying from "$lib/components/MusicPlaying.svelte";
import { mainStore } from "$lib/stores/mainStore";
import { onMount } from "svelte";

onMount(() => {
	$mainStore.loadingAnimationIsDone = true;
});
</script>

<h1>TESTS !</h1>


<MusicPlaying debug={true}/>
