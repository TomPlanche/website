<script lang="ts">
  import {onMount} from 'svelte';

  // Replace with your Stats server URL
  const STATS_URL = "http://127.0.0.1:5775";

  onMount(() => {
    const head = document.head || document.getElementsByTagName("head")[0];
    const script = document.createElement("script");
    script.setAttribute("src", "http://localhost:5775/stats.js"); // REPLACE WITH ACTUAL URL
    script.setAttribute("onload", () => window.collectStats());
    script.setAttribute("type", "text/javascript");
    script.setAttribute("charset", "utf8");
    script.setAttribute("async", "");
    head.appendChild(script);
  });
</script>
