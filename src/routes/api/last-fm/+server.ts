import axios from 'axios';
import { json, type RequestHandler } from '@sveltejs/kit';
import { LASTFM_API_KEY } from '$env/static/private';

// Type(s)

// Other(s)
const URL = {
	end: `&api_key=${LASTFM_API_KEY}&format=json`
};

// @ts-expect-error TS2322
export const POST: RequestHandler = async ({ request }) => {
	const { url } = await request.json();

	const finalURL = url + URL.end;

	return axios
		.get(finalURL)
		.then((response) => {
			if (response.status === 200) {
				const data = response.data;

				return json({
					status: 200,
					body: {
						data
					}
				});
			}
		})
		.catch((error) => {
			return json({
				status: 500,
				body: {
					error: error.message
				}
			});
		});
};
