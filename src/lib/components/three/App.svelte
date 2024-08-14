<script lang="ts">
import { Canvas } from "@threlte/core";
import Scene from "./Scene.svelte";

import type { TLovedTrack } from "$lib/LastFMMiddleware/LastFMHandler";

// biome-ignore lint/style/useConst: This is for a prop
export let tracks: TLovedTrack[] = [];
</script>

<div id="canvas-container">
  <Canvas>
    <Scene tracks={tracks}/>
  </Canvas>
</div>

<style>
  #canvas-container {
    width: 100%;
    height: 100%;

    padding-top: 10vh;
  }
</style>
