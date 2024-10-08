<script lang="ts">
// Imports
import { gsap } from "gsap";

// Variables

// Binds
let copied: HTMLElement;

// Functions
const handleOnClick = () => {
	const timeline = gsap.timeline({
		defaults: {
			duration: 0.2,
			ease: "power2.inOut",
		},
	});

	timeline
		.set(copied, { zIndex: 2 })
		.fromTo(
			copied,
			{
				opacity: 0,
				y: "-100%",
			},
			{
				opacity: 1,
				y: 0,
			},
		)
		.to(
			copied,
			{
				opacity: 0,
				y: "100%",
			},
			"+=1",
		);
};
</script>

<div
    class="container"

    on:click={handleOnClick}

    aria-hidden="true"
>
  <span>contact</span>
  <div class="right">
    <div class="first">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15.0378 6.34317L13.6269 7.76069L16.8972 11.0157L3.29211 11.0293L3.29413 13.0293L16.8619 13.0157L13.6467 16.2459L15.0643 17.6568L20.7079 11.9868L15.0378 6.34317Z"
          fill="currentColor"
        />
      </svg>
    </div>
    <div class="second">
      <p>MAIL</p>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M13 7H7V5H13V7Z" fill="currentColor" />
        <path d="M13 11H7V9H13V11Z" fill="currentColor" />
        <path d="M7 15H13V13H7V15Z" fill="currentColor" />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M3 19V1H17V5H21V23H7V19H3ZM15 17V3H5V17H15ZM17 7V19H9V21H19V7H17Z"
          fill="currentColor"
        />
      </svg>
    </div>
  </div>

  <div class="copied" bind:this={copied}>
    <p>copied</p>
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.5858 13.4142L7.75735 10.5858L6.34314 12L10.5858 16.2427L17.6568 9.1716L16.2426 7.75739L10.5858 13.4142Z"
        fill="currentColor"
      />
    </svg>
  </div>
</div>

<style lang="scss">
$container-height: 3rem;
$background: #1c3b4f;

.container {
  height: $container-height;
  width: 20vw;

  border-radius: calc($container-height / 2);

  display: flex;
  flex-direction: row;

  position: relative;
  overflow: hidden;

  &:hover {
    span {
      padding-left: 5rem;
      opacity: 0;
    }

    .right {
      width: 100%;

      .first {
        width: 0;
        opacity: 0;
      }

      .second {
        width: 100%;
        opacity: 1;
        padding: 0 1rem;
      }
    }
  }

  span, .right {
    height: 100%;
    width: 50%;

    border-radius: calc($container-height / 2);
  }

  span {
    display: flex;
    justify-content: center;
    align-items: center;


    font-family: "Neue Bit", sans-serif;
    text-transform: uppercase;
    font-size: 2rem;
    font-weight: 900;

    transition:
      opacity 0.2s ease-in-out,
      padding-left 0.2s ease-in-out;
  }

  .right {
    position: absolute;
    right: 0;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    background: $background;

    transition: width 0.2s ease-in-out;

    .first {
      transition: opacity 0.2s ease-in-out;
    }

    .second {
      height: 100%;
      width: 0;

      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      opacity: 0;

      transition:
        width 0.2s ease-in-out,
        opacity 0.2s ease-in-out;

      p {
        height: 100%;

        display: flex;
        justify-content: center;
        align-items: center;


        font-family: "Neue Bit", sans-serif;
        font-size: 3vh;
        font-weight: 700;
      }

      svg {
        height: 1.5rem;
      }
    }

    svg {
      height: 3rem;
      width: 3rem;
    }
  }

  .copied {
    position: absolute;
    top: 0;
    right: 0;

    height: 100%;
    width: 100%;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;


    background: $background;

    opacity: 0;

    p {
      font-size: 2vh;
      font-weight: 700;

      text-transform: uppercase;
    }

    svg {
      height: 3rem;
      width: 3rem;
    }
  }
}
</style>
