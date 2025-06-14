import { API_KEY } from "$env/static/private";
import { logSource } from "$lib/services/analytics";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url }) => {
  const source = url.searchParams.get("source");

  if (source) {
    await logSource(source, API_KEY);
  }
};
