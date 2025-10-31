import type { RequestHandler } from "@sveltejs/kit";
import { sourceService } from "$lib/services/sourceService.server";

export const GET: RequestHandler = async () => {
  const sources = await sourceService.getSources();

  return new Response(JSON.stringify({ sources }), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
