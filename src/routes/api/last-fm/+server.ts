import { LASTFM_API_KEY } from "$env/static/private";
import { type RequestHandler, json } from "@sveltejs/kit";
import axios from "axios";

// Type(s)
export const POST: RequestHandler = async ({ request }) => {
	const { url, options } = await request.json();

	return axios
		.get(url, {
			params: {
				api_key: LASTFM_API_KEY,
				format: "json",
				...options,
			},
		})
		.then((response) => {
			const data = response.data;

			return json({
				status: 200,
				body: {
					data,
				},
			});
		})
		.catch((error) => {
			console.error(error);

			return json({
				status: 500,
				body: {
					error: error.message,
				},
			});
		});
};
