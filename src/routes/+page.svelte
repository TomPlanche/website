<script lang="ts">
  import {gsap} from 'gsap';
  import {onMount} from "svelte";

  import ScrambleTextPlugin from "$lib/utils/ScrambleText";
  import SplitText from "$lib/utils/SplitText";

  gsap.registerPlugin(ScrambleTextPlugin);
  gsap.registerPlugin(SplitText);

  // Bindings
  let WIP: HTMLParagraphElement;

  let title = "Tom Planche";

  // Functions
  onMount(() => {
    const tl = gsap.timeline({
      defaults: {
        duration: 1,
        ease: "power2.out",
      },
    });

    const splittedTitle = new SplitText(WIP, {type: "chars"});

    console.log(splittedTitle.chars);

    tl
      .set(splittedTitle.chars, {opacity: 0})
      .to("h1",
        {
          scrambleText: {
            text: title,
            chars: title.replace(/a/g, '4').replace(/e/g, '3').replace(/o/g, 'O'),
            revealDelay: 0.625
          },
          duration: 1
        },
      )
      .fromTo(
        splittedTitle.chars,
        {
          opacity: 0,
          translateY: "1rem"
        },
        {
          opacity: 1,
          translateY: 0,
          stagger: 0.01,
          duration: 0.25
        }
      );

  })
</script>

<section>
  <h1>
    Tom Planche
  </h1>
  <p
      bind:this={WIP}
  >This website is a work in progress. Please check back later.</p>

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

    h1, p {
      text-shadow: 0 0 5px var(--text-color);
    }

    p {
      font-family: "Monorama", sans-serif;
      font-size: 3vw;
      text-align: justify;
      padding: 1rem;
      line-height: 1.5;
    }
  }
</style>