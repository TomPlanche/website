<script lang="ts">
// Imports
import io from "@pm2/io";
import { onMount } from "svelte";

const currentReqs = io.counter({
  name: "Realtime request count",
  id: "app/realtime/requests",
});

onMount(() => {
  // Increment the counter every time a request is made
  currentReqs.inc();

  return () => {
    // Decrement the counter when the component is destroyed
    currentReqs.dec();
  };
});
</script>

