<script lang="ts">
  import {onMount} from 'svelte';

  // Replace with your Stats server URL
  const STATS_URL = "http://localhost:5775"; // or your production URL

  onMount(() => {
    const script = document.createElement('script');
    script.setAttribute("src", `${STATS_URL}/stats.js`);
    script.setAttribute("onload", "window.stats_collect()");
    script.setAttribute("type", "text/javascript");
    script.setAttribute("charset", "utf8");
    script.setAttribute("async", "");
    document.head.appendChild(script);
  });
</script>