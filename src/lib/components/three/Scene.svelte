<script lang="ts">
import type { TLovedTrack } from "$lib/LastFMMiddleware/LastFMHandler";
import { T } from "@threlte/core";
import { Text, interactivity } from "@threlte/extras";
import { Vector3 } from "three";
import { Inspector } from "three-inspect";

import Cover from "$lib/components/three/Cover.svelte";
import { onMount } from "svelte";
import { spring } from "svelte/motion";

import { OrbitControls } from "@threlte/extras";
import AxesHelper from "./AxesHelper.svelte";

interactivity();

// Props
// biome-ignore lint/style/useConst: This is for a prop
export let tracks: TLovedTrack[] = [];

const fakeTracksCount = 10;

// These are the fake tracks that will be used to fake the infinite scroll effect.
const xFirstTracks = tracks.slice(0, fakeTracksCount + 1);
const xLastTracks = tracks
	.slice(tracks.length - fakeTracksCount, tracks.length)
	.reverse();

// Variables

const coverGap = spring(40);
// The less the value, the faster the scroll.
const groupScrollSpeed = 500;

let scrollTimeout: NodeJS.Timeout;

// ThreeJS vars
const position = spring(0, {
	stiffness: 0.1,
	damping: 0.8,
});

$: groupPosition = new Vector3(
	-$position / (groupScrollSpeed / $coverGap),
	0,
	0,
);

// $: console.log($position);

// Functions
/**
 * Handles the wheel event (~= scroll).
 *
 * @param event {WheelEvent} The event object.
 */
const handleWheel = (event: WheelEvent) => {
	// Prevent the default behavior of the event.
	event.preventDefault();

	// Update the position store.
	position.update(
		(p) => {
			// We mod the new position by the total length of the tracks to create the infinite scroll effect.
			const newPosition =
				(p + event.deltaY) % (tracks.length * groupScrollSpeed);

			// If the new position is less than 0, we set it to the last track.
			return newPosition < 0 ? tracks.length * groupScrollSpeed : newPosition;
		},
		{
			hard: true,
		},
	);

	handleSnap();
};

/**
 * Snaps to the closest track.
 */
const snapToClosest = () => {
	// We calculate the closest track to the current position.
	const closestTrack = $position / groupScrollSpeed;

	// We animate the position to the new position.
	$position = Math.round(closestTrack) * groupScrollSpeed;
};

/**
 * Handles the snap effect.
 * It waits for the user to stop scrolling for a certain amount of time before snapping to the closest track.
 */
const handleSnap = () => {
	if (scrollTimeout) clearTimeout(scrollTimeout);
	scrollTimeout = setTimeout(snapToClosest, 300);
};

/**
 * Handles the click event.
 * Scrolls to the clicked track.
 *
 * @param index {number} The index of the clicked track.
 */
const handleOnClicked = async (index: number) => {
	console.log(`Clicked on track ${index} - ${index * groupScrollSpeed}`);

	if (index === tracks.length - 1) {
		// We animate the position to the new position.
		await position.set(tracks.length * groupScrollSpeed, {
			hard: true,
		});
	}

	// We animate the position to the new position.
	await position.set(index * groupScrollSpeed);

	if (index >= tracks.length) {
		// We animate the position to the new position.
		await position.set(0, { hard: true });
	}
};

// Lifecycle
onMount(() => {
	// Add the event listener to the window.
	window.addEventListener("wheel", handleWheel, { passive: false });

	// Cleanup
	return () => {
		// Remove the event listener from the window.
		window.removeEventListener("wheel", handleWheel);
	};
});
</script>

<T.PerspectiveCamera
    makeDefault
    position={[0, 5, 60]}
    on:create={({ ref }) => {
        ref.lookAt(0, 1, 0);
    }}
>
    <OrbitControls />
</T.PerspectiveCamera>

<T.DirectionalLight position={[0, 10, 10]} />

<Text
    position={[0, 25, 0]}
    rotation={[0, 0, 0]}
    scale={[10, 10, 10]}
    text={$position.toString()}
    color="red"
    anchorX="center"
    renderOrder={1}
/>

<T.Group position={groupPosition.toArray()}>
    <!--
  This group is to fake the "infinite" scroll effect.
  It's the tracks that will go before the first track.
  -->
    {#each xLastTracks as before, i}
        <Cover
            position={[-(i + 1) * $coverGap, 0, 0]}
            rotation={[0, Math.PI / 2, 0]}
            track={before}
            onClick={() => handleOnClicked(tracks.length - i - 1)}
        />
    {/each}

    <!--
  This group is the main group of tracks.
  -->
    {#each tracks as track, i}
        <Cover
            position={[i * $coverGap, 0, 0]}
            rotation={[
                0,
                /**
                 * The rotation.y should be:
                 * - 0 for the cover at i * groupScrollSpeed = $position
                 * else Math.PI / 2
                 *
                 * lerp the rotation.y between 0 and Math.PI / 2
                 */
                Math.PI / 2,
                0,
            ]}
            {track}
            isCentered={i * groupScrollSpeed * 0.95 <= $position &&
                $position <= i * groupScrollSpeed * 1.05}
            onClick={() => handleOnClicked(i)}
        />
    {/each}

    <!--
  This group is to fake the "infinite" scroll effect.
  It's the tracks that will go after the last track.
  -->
    {#each xFirstTracks as after, i}
        <Cover
            position={[(tracks.length + i) * $coverGap, 0, 0]}
            rotation={[0, Math.PI / 2, 0]}
            track={after}
            onClick={() => handleOnClicked(tracks.length + i)}
        />
    {/each}
</T.Group>

<!--<Inspector />-->
<AxesHelper />
