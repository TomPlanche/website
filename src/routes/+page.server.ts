import { API_KEY } from "$env/static/private";
import { logSource } from "$lib/services/analytics";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url }) => {
  const source = url.searchParams.get("source");

  if (source) {
    try {
      await logSource(source, API_KEY);
    } catch (error) {
      console.error("Failed to log source parameter:", error);
    }
  }
};
