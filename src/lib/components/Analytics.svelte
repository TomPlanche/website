<script lang="ts">
  import {onMount} from 'svelte';

  // Replace with your Stats server URL
  const STATS_URL = "http://127.0.0.1:5775";

  onMount(async () => {
    const head = document.head || document.getElementsByTagName("head")[0];
    let ip = '';

    try {
      const response = await fetch('/api/ip');
      const data = await response.json();
      ip = data.ip;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'IP:', error);
    }

    console.log('IP:', ip);

    const script = document.createElement("script");
    script.setAttribute("src", `${STATS_URL}/stats.js`);
    script.setAttribute("onload", () => window.collectStats());
    script.setAttribute("type", "text/javascript");
    script.setAttribute("charset", "utf8");
    script.setAttribute("async", "");
    head.appendChild(script);
  });
</script>
