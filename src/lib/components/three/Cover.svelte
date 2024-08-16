<script lang="ts">
import type { TLovedTrack } from "$lib/LastFMMiddleware/LastFMHandler";
// Imports
import { T } from "@threlte/core";
import { ImageMaterial } from "@threlte/extras";
import { Text } from "@threlte/extras";
import { interactivity } from "@threlte/extras";
import { spring } from "svelte/motion";

interactivity();

// Variables
const scale = spring(1);

// Props
// biome-ignore lint/style/useConst: This is for a prop
export let position: [number, number, number] = [0, 0, 0];
// biome-ignore lint/style/useConst: This is for a prop
export let rotation: [number, number, number] = [0, 0, 0];
export let track: TLovedTrack;
// biome-ignore lint/style/useConst: This is for a prop
export let isCentered = false;

const localXRotation = spring(0);
const localYRotation = spring(0);

$: localRotation = [$localXRotation, $localYRotation, rotation[2]] as [
	number,
	number,
	number,
];

export let onClick: () => void;

const coverParams = {
	height: 31.43,
	width: 31.43,
	thickness: 1,
	zoom: 1,
	radius: 0,
};

const textPosition: [number, number, number] = [
	position[0],
	(position[1] + coverParams.height / 2) * 1.25,
	position[2],
];

$: if (!isCentered) {
	localYRotation.set(0);
	localXRotation.set(0);
}
</script>

<T.Group>
  <!-- Text information -->
  <Text
    position={textPosition}
    rotation={[0, 0, 0]}
    scale={[10, 10, 10]}
    text={track.name}

    color="red"
    anchorX="center"
    renderOrder={1}
  />

  <T.Mesh
    position={position}
    rotation={localRotation}
    scale={$scale}

    renderOrder={0}

    on:click={() => {
      onClick();
    }}

    on:pointerenter={() => {
      if (!isCentered ){
        return;
      }
      // find where the pointer is on the cover
      localYRotation.set(0);
    }}
    on:pointermove={(e) => {
      if (!isCentered ){
        return;
      }

      // x and y are the uv coordinates, so they are between 0 and 1
      const { x, y } = e.uv;
      const effectHardness = 0.75;

      // 3d card rotation effect
      localXRotation.set(
        (Math.PI / 4 * (y - .5) * effectHardness)
      );
      localYRotation.set(
        (Math.PI / 4 * (x - .5) * effectHardness)
      );
    }}

    on:pointerleave={() => {
      if (!isCentered ){
        return;
      }

      localYRotation.set(0);
      localXRotation.set(0);
    }}

  >
    <T.BoxGeometry args={[coverParams.width, coverParams.height, coverParams.thickness]}/>
    <ImageMaterial
      url={track.image[track.image.length - 1]["#text"]}
      radius={coverParams.radius}
      zoom={coverParams.zoom}

      depthWrite={false}
    />
  </T.Mesh>
</T.Group>
