<script lang="ts">
  import {onMount} from 'svelte';

  /**
   * The text to be scrambled.
   */
  export let text: string = '';

  /**
   * The duration of the scrambling effect in milliseconds.
   */
  export let duration: number = 2000;

  /**
   * The speed of the scrambling effect in milliseconds.
   */
  export let scrambleSpeed: number = 50;

  /**
   * The characters used for scrambling.
   */
  export let characters: string = '@#$%^&*()_+';

  /**
   * Callback function called when the animation starts.
   */
  export let onStart: (() => void) | undefined = undefined;

  /**
   * Callback function called when the animation completes.
   */
  export let onComplete: (() => void) | undefined = undefined;

  /**
   * The text currently being displayed.
   */
  let displayText: string = '';

  /**
   * Get a random character from the characters string.
   */
  const getRandomChar = () => {
    return characters[Math.floor(Math.random() * characters.length)];
  }

  /**
   * Scramble the text.
   */
  const scramble = () => {
    const finalText = text;
    const steps = Math.floor(duration / scrambleSpeed);
    const incrementPerStep = finalText.length / steps;
    let currentStep = 0;

    onStart?.();

    const interval = setInterval(() => {
      const progress = Math.floor(currentStep * incrementPerStep);
      
      displayText = finalText
        .split('')
        .map((char, index) => {
          if (index < progress) {
            return finalText[index];
          }
          return getRandomChar();
        })
        .join('');

      currentStep++;

      if (currentStep >= steps) {
        clearInterval(interval);
        displayText = finalText;

        onComplete?.();
      }
    }, scrambleSpeed);
  }

  onMount(() => {
    scramble();
  });

</script>

<span>
  {displayText}
</span>

<style lang="scss">
  span {
    display: inline-block;
    font-family: inherit;
    font-size: inherit;
    font-weight: inherit;
    color: inherit;
  }
</style> 