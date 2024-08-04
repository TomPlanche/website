import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ resolve, event }) => {
	const protectedPaths = ["/api"];

	for (const path of protectedPaths) {
		if (event.url.pathname.startsWith(path)) {
			if (event.request.method === "OPTIONS") {
				return new Response(null, {
					status: 200,
					headers: {
						"Access-Control-Allow-Methods":
							"GET, POST, PUT, DELETE, PATCH, OPTIONS",
						"Access-Control-Allow-Origin": "IDK",
						"Access-Control-Allow-Headers": "*",
					},
				});
			}
		}
	}

	const response = await resolve(event);

	for (const path of protectedPaths) {
		if (event.url.pathname.startsWith(path)) {
			response.headers.set("Access-Control-Allow-Origin", "IDK");
		}
	}

	return response;
};
