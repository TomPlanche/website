<script lang="ts">
import "$lib/styles/main.scss";
import { mainStore } from "$lib/mainStore";
import { onMount } from "svelte";

onMount(() => {
	$mainStore.loadingAnimationIsDone = true;
});
</script>

<h1>Hello !</h1>
