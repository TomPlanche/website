<script lang="ts">
  import { onMount } from "svelte";
  import { mainStore } from "$lib/stores/mainStore";
  import type { Sticker } from "$lib/types";

  // Get stickers from page data
  let { data } = $props();
  let stickers = $state<Sticker[]>(data.stickers);

  // Map state
  let mapContainer: HTMLDivElement;
  let map: any = null;
  let isMapLoaded = $state(false);
  let markerIcon: any = null;

  // Paris coordinates and zoom level for ~10km radius
  const PARIS_COORDINATES: [number, number] = [48.8566, 2.3522];
  const PARIS_ZOOM = 12; // Shows approximately 10km radius

  // Map tile configuration
  const mapTileConfig = {
    url: "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
    attribution: "© OpenStreetMap contributors © CARTO",
    options: {
      subdomains: "abcd",
      maxZoom: 20,
    },
  };

  // Initialize map
  const initializeMap = async () => {
    if (typeof window === "undefined") return;

    try {
      // Dynamic import of Leaflet
      const L = await import("leaflet");
      await import("leaflet/dist/leaflet.css");

      // Create map centered on Paris
      map = L.map(mapContainer).setView(PARIS_COORDINATES, PARIS_ZOOM);

      // Add tile layer
      L.tileLayer(mapTileConfig.url, {
        attribution: mapTileConfig.attribution,
        ...mapTileConfig.options,
      }).addTo(map);

      isMapLoaded = true;

      // Add stickers if already loaded
      if (stickers.length) {
        await addStickersToMap(L);
      }
    } catch (error) {
      console.error("Failed to initialize map:", error);
    }
  };

  // Add stickers to map
  const addStickersToMap = async (L: any) => {
    if (!map || !stickers.length) return;

    // Clear existing markers if any
    map.eachLayer((layer: any) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Ensure custom icon is created once
    if (!markerIcon) {
      markerIcon = L.icon({
        iconUrl: "/zoizo.png",
        iconSize: [48, 48],
        iconAnchor: [24, 40],
        popupAnchor: [0, -36],
        className: "zoizo-marker",
      });
    }

    // Add marker for each sticker
    stickers.forEach((sticker) => {
      console.log("Adding sticker to map:", sticker);

      const marker = L.marker([sticker.latitude, sticker.longitude], {
        icon: markerIcon,
      }).addTo(map);

      // Create popup content
      const popupContent = `
        <div style="font-family: 'Zed Plex Mono', monospace;">
          <strong>${sticker.name}</strong><br/>
          <em>${sticker.place_name}</em>
        </div>
      `;

      marker.bindPopup(popupContent);
    });
  };

  onMount(() => {
    $mainStore.hideBackground = true;
    initializeMap();

    console.log("Stickers data:", stickers);

    return () => {
      // Reset when leaving the page
      $mainStore.hideBackground = false;
    };
  });
</script>

<svelte:head>
  <title>Paris Map - Tom Planche</title>
  <meta
    content="Interactive map of Paris and its surroundings"
    name="description"
  />
</svelte:head>

<section class="map-section">
  <div bind:this={mapContainer} class="map-container">
    {#if !isMapLoaded}
      <div class="map-loading">
        <div class="loading-spinner"></div>
        <p>Loading map...</p>
      </div>
    {/if}
  </div>
</section>

<style lang="scss">
  @use "$lib/styles/variables";

  .map-section {
    min-height: 100dvh;
    padding: variables.$main-vertical-padding variables.$main-padding;
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .map-container {
    flex: 1;
    min-height: 70vh;
    border-radius: 1rem;
    overflow: hidden;
    position: relative;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .map-loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    z-index: 1000;

    p {
      font-family: "Zed Plex Mono", monospace;
      margin-top: 1rem;
      opacity: 0.8;
    }
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-top: 3px solid var(--text-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  // Enhanced map styling
  :global(.leaflet-container) {
    background: transparent !important;
    border-radius: 1rem;
  }

  // Tweak custom marker rendering on high-DPI screens
  :global(.zoizo-marker) {
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
  }

  :global(.leaflet-control-zoom) {
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
    border-radius: 0.5rem !important;
    background: #084ccf !important;
    backdrop-filter: blur(10px) !important;
  }

  :global(.leaflet-control-zoom a) {
    background: transparent !important;
    color: var(--text-color) !important;
    border: none !important;
    font-family: "Zed Plex Mono", monospace !important;
    font-weight: 600 !important;
  }

  :global(.leaflet-control-zoom a:hover) {
    background: rgba(255, 255, 255, 0.1) !important;
  }

  :global(.leaflet-control-attribution) {
    font-family: "Zed Plex Mono", monospace !important;
    font-size: 0.7rem !important;
    border-radius: 0.25rem !important;
    backdrop-filter: blur(10px) !important;
    background: rgba(255, 255, 255, 0.1) !important;
  }

  // Responsive design
  @media (max-width: 768px) {
    .map-section {
      padding: 1rem;
    }

    .map-container {
      min-height: 60vh;
    }
  }
</style>
