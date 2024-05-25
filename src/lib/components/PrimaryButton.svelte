<script lang="ts">
  // Imports

  // Variables
  // types
  import Hoverable from '$lib/components/Hoverable.svelte';

  type TIconPosition = 'left' | 'right';

  // props
  /**
   * Button type
   *
   * @type {TButton} buttonType
   */
  export let buttonType: TIconPosition = 'right';

  /**
   *
   */
  export let title: string = 'Please add a title';

  // Functions
</script>

<Hoverable>
  <button class="button {buttonType === 'right' ? 'rv' : 'r'}">
    <span class="svg-container">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
        ><path
          d="M10.5253 5.49475L10.5206 7.49475L15.0782 7.50541L5.47473 17.0896L6.88752 18.5052L16.5173 8.89479L16.5065 13.5088L18.5065 13.5134L18.5253 5.51345L10.5253 5.49475Z"
          fill="currentColor"
        /></svg
      >
    </span>
    <span class="title">
      {title}
    </span>
  </button>
</Hoverable>

<style lang="scss">
  @import 'src/lib/styles/variables';

  $main: $blue;
  $secondary: white;
  $main-padding: 4px;

  button {
    height: 3rem;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: $main-padding;

    background: $secondary;
    border-radius: $main-padding;
    padding: $main-padding;
    color: $main;

    transition: all 0.2s ease-in-out;

    cursor: none;

    &:hover {
      background: $main;
      color: $secondary;
      padding: 0 0 0 $main-padding;
      gap: 0;
    }

    &.rv {
      flex-direction: row-reverse;
    }

    .svg-container {
      height: 100%;
      width: auto;
      aspect-ratio: 1/1;

      display: flex;
      justify-content: center;
      align-items: center;

      background: $main;
      border-radius: $main-padding;

      animation-direction: alternate;
    }

    svg {
      height: 70%;
      width: auto;
      aspect-ratio: 1/1;

      color: $secondary;
    }

    .title {
      text-transform: uppercase;
      padding: 0 0.25rem;
    }
  }
</style>
