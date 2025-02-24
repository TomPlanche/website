<script lang="ts">
  import {gsap} from 'gsap';

  import ScrambleTextPlugin from "$lib/utils/gsap/ScrambleText";
  import SplitText from "$lib/utils/gsap/SplitText";

  gsap.registerPlugin(ScrambleTextPlugin);
  gsap.registerPlugin(SplitText);

  import {cursorEnter, cursorLeave} from "$lib/actions/cursor";

  // Bindings
  let WIP: HTMLParagraphElement;

  const title = "Tom Planche";

  // Initialize animations
  $effect(() => {
    if (typeof window === 'undefined') return;

    const splittedTitle = new SplitText(WIP, {type: "chars"});

    const tl = gsap.timeline({
      defaults: {
        duration: 1,
        ease: "power2.out",

      },
    });


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
          duration: 0.25,
          onComplete: () => {
            splittedTitle.revert();
          }
        },
      );
  });
</script>

<section>
  <h1>
    Tom Planche
  </h1>
  <p
      bind:this={WIP}
  >
    This website is a work in progress. Please check back later. <br>
    <span>
      While waiting, you can check out what I've listened to recently <a use:cursorEnter
                                                                         use:cursorLeave href="/music">here</a>.
    </span>
  </p>

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

      span {
        display: block;
        font-size: 1.5rem;
        margin-top: 1rem;
        text-align: center;

        a {
          text-decoration: underline !important;
        }
      }
    }
  }
</style>