<script lang="ts">
// Imports
import { cursorEnter, cursorLeave } from "$lib/actions/cursor";

// Variables
const e_m_a_i_l = "tom" + "planche" + "@" + "icloud.com";
</script>

<footer>
  <span><span class="light">©2025</span> Paris</span>
  <span class="right">
    <span class="links">
      <a
          href="mailto:{e_m_a_i_l}"

          use:cursorEnter
          use:cursorLeave
      >email</a>
      <a
          href="https://github.com/tomplanche"

          use:cursorEnter
          use:cursorLeave
      >github</a>
    </span>
    <span class="name">
      Tom Planche
      <svg class="arrow" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path class="arrow-tip" d="M21 11V3h-8v2h4v2h-2v2h-2v2h-2v2H9v2h2v-2h2v-2h2V9h2V7h2v4z"
              fill="currentColor"/>
        <path d="M 19 5 z M 11 5 H 3 v 16 h 16 v -8 h -2 v 6 H 5 V 7 h 6 z"
              fill="currentColor"/>
      </svg>
    </span>
  </span>
</footer>

<style lang="scss">
  @use '$lib/styles/variables';

  $double-padding: variables.$main-padding * 2;
  $light-color: color-mix(in srgb, var(--text-color) 50%, transparent);
  $font-size: 1.25rem;

  footer {
    position: fixed;
    bottom: variables.$main-padding;
    left: variables.$main-padding;

    outline: 1px solid $light-color;
    border-radius: 0 0 1rem 1rem;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    height: variables.$footer-height;
    width: calc(100% - #{$double-padding});

    // Blurry background
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px); // Compatible with Safari

    padding: 1rem;

    font-family: "Monorama", monospace;
    font-size: $font-size;
    font-weight: 100;
    text-transform: uppercase;
    z-index: 1000;

    .right {
      text-transform: initial;
      position: relative;
      display: flex;
      gap: $font-size;
      align-items: center;

      .links {
        display: flex;
        gap: $font-size;
        opacity: 0;
        transform: translateX(1rem);
        transition: 
          opacity 0.3s ease 0.15s,
          transform 0.3s ease 0.15s;
        cursor: pointer;

        a {
          color: $light-color;
          text-decoration: none;

          &:hover {
            color: var(--text-color);
          }
        }
      }

      &:hover {
        .links {
          opacity: 1;
          transform: translateX(0);
          transition: 
            opacity 0.3s ease,
            transform 0.3s ease;
        }

        .arrow-tip {
          transform: translate(calc($font-size / 6), calc($font-size / -6));
        }
      }

      .name {
        display: flex;
        align-items: center;
        gap: calc($font-size / 2);
        white-space: nowrap;

        .arrow-tip {
          vertical-align: middle;
        }

        svg {
          width: $font-size;
          height: $font-size;
          fill: $light-color;

          .arrow-tip {
            transition: transform 0.3s ease;
          }
        }
      }
    }

    .light {
      color: $light-color;
    }
  }
</style>
