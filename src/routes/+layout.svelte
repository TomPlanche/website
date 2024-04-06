<script lang="ts">
	// Imports
	import { style_vars } from '$lib/globals';
	import '$lib/styles/main.scss';

	// Variables
	let headerHeight = style_vars.header_height;
	let padding = style_vars.main_padding;

	export const padding_top = `calc(2 * ${padding} + ${headerHeight})`;
</script>

<main style="padding: 0 {padding};">
	<slot />
</main>

<style lang="scss">
	@import '$lib/styles/reset';
	@import '$lib/styles/base';
	@import '$lib/styles/variables';

	main {
		min-height: 100vh;

		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;

		/* cursor: none; */

		background-color: $app-bg-light;
		transition: background-color 0.3s ease-in-out;

		:global(body.dark) & {
			color: $gh-text;
			background-color: $app-bg-dark;
		}
	}
</style>
