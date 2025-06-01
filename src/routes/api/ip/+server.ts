/**
 * @file src/routes/api/ip/+server.ts
 * @description +server
 * @author Tom Planche
 */
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = ({ request }) => {
  const ip =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("cf-connecting-ip");

  return new Response(JSON.stringify({ ip }), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

/**
 * End of file src/routes/api/ip/+server.ts
 */
