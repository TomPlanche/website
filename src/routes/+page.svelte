<script lang="ts">
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { SplitText } from "gsap/SplitText";
import { onMount } from "svelte";

gsap.registerPlugin(ScrambleTextPlugin);
gsap.registerPlugin(SplitText);
gsap.registerPlugin(Flip);

const title = "Tom Planche";

// Bindings
let titleRef: HTMLHeadingElement;
let WIPRef: HTMLParagraphElement;

let introAnimationIsOver = $state(false);

// Initialize animations
onMount(() => {
  if (!titleRef || !WIPRef) {
    console.error("Title or WIP reference is not set");
    return;
  }

  document.fonts.ready.then(() => {
    const splittedTitle = new SplitText(WIPRef, { type: "chars" });

    const tl = gsap.timeline({
      defaults: {
        duration: 1,
        ease: "power2.out",
      },
    });

    tl.set(splittedTitle.chars, { opacity: 0 })
      .to(titleRef, {
        scrambleText: {
          text: title,
          chars: title.replace(/a/g, "4").replace(/e/g, "3").replace(/o/g, "O"),
          revealDelay: 0.625,
        },
        duration: 1,
      })
      .fromTo(
        splittedTitle.chars,
        {
          opacity: 0,
          translateY: "1rem",
        },
        {
          opacity: 1,
          translateY: 0,
          stagger: 0.01,
          duration: 0.25,
          onComplete: () => {
            splittedTitle.revert();

            introAnimationIsOver = true;
          },
        },
      );
  });
});
</script>

<section
    id="intro"
>
  <div class="title">
    <h1
        bind:this={titleRef}
    >
      Tom Planche
    </h1>
    <h2
      bind:this={WIPRef}
    >
      French Software Engineer based in Paris.
    </h2>
  </div>
</section>


<style lang="scss">
  @use '$lib/styles/variables';

  #intro {
    min-height: 100svh;
    height: 100%;
    width: 100%;

    padding: variables.$main-padding;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    h1, h2 {
      text-shadow: 0 0 5px var(--text-color);
      font-family: "Mondwest", sans-serif;
    }

    h1 {
      font-family: "Mondwest", monospace;
      font-size: 9vw;
      text-shadow: 0 0 5px var(--text-color);
      font-weight: 900;
      text-align: center;
    }

    h2 {
      font-family: "PP Supply Mono", sans-serif;
      font-kerning: none;
      font-size: 3vw;
    }
  }
</style>