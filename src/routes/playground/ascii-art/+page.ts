/**
 * @file src/routes/work/ascii-art/+page.ts
 * @description +page
 * @author Tom Planche
 */
import type {TFile} from "$lib/types";

export const load = async ({ fetch }) => {
	const { files } = await fetch("/playground/ascii-art").then(
		(response) => response.json() as Promise<{ files: TFile[] }>,
	);
	return {
		files,
	};
};

/**
 * End of file src/routes/work/ascii-art/+page.ts
 */
