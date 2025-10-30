import type { RequestHandler } from "@sveltejs/kit";
import { API_KEY } from "$env/static/private";
import { getSources } from "$lib/services/analytics";

export const GET: RequestHandler = async () => {
  const sources = await getSources(API_KEY);

  return new Response(JSON.stringify({ sources }), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
