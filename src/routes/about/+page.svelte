<script lang="ts">
import { LINKS, mainStore } from "$lib/stores/mainStore";
// Imports
import { onMount } from "svelte";

// Variables

// Functions

onMount(() => {
	$mainStore.currentLink = LINKS[1];
});
</script>

<h1>ABOUT</h1>


<style lang="scss">

</style>
