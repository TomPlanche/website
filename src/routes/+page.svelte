<script lang="ts">
  import ScrambleText from '$lib/components/ScrambleText.svelte';
  import {gsap} from 'gsap';

  // Bindings
</script>

<section>
  <h1>
    <ScrambleText
        duration={1000}
        scrambleSpeed={75}
        text="Tom Planche"
    />
  </h1>

</section>

<style lang="scss">
  section {
    height: 100%;
    width: 100%;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    h1 {
      font-family: "Mondwest", monospace;
      font-size: 9vw;
      text-shadow: 0 0 5px var(--text-color);
      font-weight: 900;
      text-align: left;
    }

    p {
      font-family: "Departure Mono", monospace;
      font-size: 3vw;
      text-align: center;
      font-kerning: none;
      letter-spacing: -.1ch;

      opacity: 0;
    }

    h1, p {
      text-shadow: 0 0 5px var(--text-color);
    }
  }
</style>