<script lang="ts">
import { mainStore } from "$lib/stores/mainStore";
import { onMount } from "svelte";

import { gsap } from "gsap";
import { ScrambleTextPlugin } from "gsap/dist/ScrambleTextPlugin";

// Register plugins
gsap.registerPlugin(ScrambleTextPlugin);

// Variables
const titleContent = "Tom Planche";

// Binds
let title: HTMLHeadingElement;
let subtitle: HTMLHeadingElement;

// Lifecycle
onMount(() => {
	$mainStore.loadingAnimationIsDone = true;

	const mainTimeline = gsap.timeline({
		defaults: { duration: 0.5, ease: "power2.out" },
		onStart: () => {
			$mainStore.loadingAnimationIsDone = false;
		},
		onComplete: () => {
			$mainStore.loadingAnimationIsDone = true;
		},
	});

	mainTimeline
		.set([title, subtitle], { opacity: 0 })
		.set(subtitle, { y: "50%" })
		.to(title, {
			opacity: 1,
			duration: 1,
			scrambleText: {
				text: titleContent,
				chars: `${titleContent
					.replace(/a/g, "4")
					.replace(/e/g, "3")
					.replace(/o/g, "O")}@#&<>()!;`,
				revealDelay: 0.625,
			},
		})
		.to(subtitle, {
			opacity: 1,
			y: "0%",
			duration: 0.5,
			ease: "power2.out",
		});
});
</script>

<h1 bind:this={title}>{titleContent}</h1>
<h2 bind:this={subtitle}>I do <span>stuff</span> with code</h2>

<style lang="scss">
  @import '../lib/styles/variables';


  h1,
  h2 {
    @include no-user-select();

    text-align: left;
    font-family: 'Mondwest', serif;
    text-shadow: 0 0 5px $main-color;
  }

  h1 {
    font-size: 7vw;
    font-weight: 900;
  }

  h2 {
    font-size: 4vw;
    font-weight: 400;
  }
</style>
