<script lang="ts">
  import {onMount} from 'svelte';
  import {PUBLIC_PROD} from "$env/static/public";

  // Replace with your Stats server URL
  const STATS_URL = "http://127.0.0.1:5775";
  const isProd = PUBLIC_PROD === 'true';


  onMount(async () => {
    const head = document.head || document.getElementsByTagName("head")[0];
    let ip = '';

    if (isProd) {
      try {
        const response = await fetch('/ip');
        const data = await response.json();

        if (!data.ip) {
          throw new Error('No IP found');
        }

        ip = data.ip;
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'IP:', error);
      }
    } else {
      ip = "2001:818:da57:6100:d152:17c3:e8f5:fe75";
    }

    const script = document.createElement("script");
    script.setAttribute("src", `${STATS_URL}/stats.js?ip=${ip}`);
    script.setAttribute("onload", () => window.collectStats());
    script.setAttribute("type", "text/javascript");
    script.setAttribute("charset", "utf8");
    script.setAttribute("async", "");
    head.appendChild(script);
  });
</script>
