<script lang="ts">
import type { TLovedTrack } from "$lib/LastFMMiddleware/LastFMHandler";
import { T } from "@threlte/core";
import { ImageMaterial } from "@threlte/extras";
import { DoubleSide, Vector3 } from "three";

import { onMount } from "svelte";
import { writable } from "svelte/store";

// Props
// biome-ignore lint/style/useConst: This is for a prop
export let tracks: TLovedTrack[] = [];

const fakeTracksCount = 6;

// These are the fake tracks that will be used to fake the infinite scroll effect.
const xFirstTracks = tracks.slice(0, fakeTracksCount + 1);
const xLastTracks = tracks
	.slice(tracks.length - fakeTracksCount, tracks.length)
	.reverse();

// Variables
const coverDimensions = {
	height: 31.43,
	width: 31.43,
	thickness: 1,
};

$: groupPosition = new Vector3(-$position / 100, 0, 0);

const position = writable(0);
const handleWheel = (event: WheelEvent) => {
	event.preventDefault();
	position.update((p) => {
		const newPosition = (p + event.deltaY) % (tracks.length * 1000);

		return newPosition < 0 ? tracks.length * 1000 : newPosition;
	});

	console.log($position);
};

onMount(() => {
	window.addEventListener("wheel", handleWheel, { passive: false });
	return () => {
		window.removeEventListener("wheel", handleWheel);
	};
});
</script>


<T.PerspectiveCamera
  makeDefault
  position={[0, 10, 60]}
  on:create={({ ref }) => {
    ref.lookAt(0, 1, 0)
  }}
/>

<T.DirectionalLight position={[0, 10, 10]}/>

<T.Group position={groupPosition.toArray()}>
  <!--
  This group is to fake the "infinite" scroll effect.
  -->
  {#each xLastTracks as before, i}
    <T.Mesh
      position={[-(i + 1) * 10, 0, 0]}
      rotation={[0, Math.PI / 2, 0]}
    >
      <T.BoxGeometry args={[coverDimensions.width, coverDimensions.height, coverDimensions.thickness]}/>
      <ImageMaterial
        transparent
        side={DoubleSide}
        url={before.image[3]["#text"]}
        radius={0.1}
        zoom={1.1}
      />
    </T.Mesh>
  {/each}

  {#each tracks as track, i}
    <T.Mesh
      position={[i * 10, 0, 0]}
      rotation={[0, Math.PI / 2, 0]}
    >
      <T.BoxGeometry args={[coverDimensions.width, coverDimensions.height, coverDimensions.thickness]}/>
      <ImageMaterial
        transparent
        side={DoubleSide}
        url={track.image[3]["#text"]}
        radius={0.1}
        zoom={1.1}
      />
    </T.Mesh>
  {/each}

  {#each xFirstTracks as after, i}
    <T.Mesh
      position={[(tracks.length + i) * 10, 0, 0]}
      rotation={[0, Math.PI / 2, 0]}
    >
      <T.BoxGeometry args={[coverDimensions.width, coverDimensions.height, coverDimensions.thickness]}/>
      <ImageMaterial
        transparent
        side={DoubleSide}
        url={after.image[3]["#text"]}
        radius={0.1}
        zoom={1.1}
      />
    </T.Mesh>
  {/each}
</T.Group>
