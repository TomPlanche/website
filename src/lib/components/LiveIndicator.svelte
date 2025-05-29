<script lang="ts">
  export const size = "small";
  export const color = "#35d151";
</script>

<div class="live-indicator {size}" style="--indicator-color: {color}">
  <div class="dot"></div>
  <div class="pulse"></div>
</div>

<style lang="scss">
  @use '$lib/styles/variables' as vars;

  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 0.7;
    }
    70% {
      transform: scale(2);
      opacity: 0;
    }
    100% {
      transform: scale(1);
      opacity: 0;
    }
  }

  .live-indicator {
    position: relative;
    display: inline-flex;
    align-items: center;

    &.small {
      .dot, .pulse {
        width: 8px;
        height: 8px;
      }
    }

    &.medium {
      .dot, .pulse {
        width: 12px;
        height: 12px;
      }
    }

    .dot, .pulse {
      background-color: var(--indicator-color, vars.$gh-green-active);
      border-radius: 50%;
    }

    .pulse {
      position: absolute;
      animation: pulse 2s ease-in-out infinite;
      opacity: 0.7;
    }
  }
</style>
