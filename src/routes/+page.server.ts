import { sourceService } from "$lib/services/sourceService.server";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url }) => {
  const source = url.searchParams.get("source");

  if (source) {
    try {
      await sourceService.logSource(source);
    } catch (error) {
      console.error("Failed to log source parameter:", error);
    }
  }
};
