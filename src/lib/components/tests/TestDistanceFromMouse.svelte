<script lang="ts">
// Imports
import { distanceFromMouse } from "$lib/actions/distanceFromMouse";
import type { DistanceEvent, ReferencePoint } from "$lib/types";

// Variables
let distance = 0;
const refPoint: ReferencePoint = "center";

// Methods
function handleDistance(event: DistanceEvent) {
	distance = event.distance;
}
</script>

<div use:distanceFromMouse={[handleDistance, refPoint]}>
  Distance from {refPoint}: {distance.toFixed(0)}px
</div>

<style lang="scss">
div {
  border: 1px dotted red;
  padding: .5rem;
}
</style>