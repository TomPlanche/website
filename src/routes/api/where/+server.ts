import { IPINFO_TOKEN } from "$env/static/private";
import {
	IpInfoResponseSchema,
	type TIpInfoResponse,
	type TUserLocation,
	UserLocationSchema,
} from "$lib/types";
import { type RequestHandler, json } from "@sveltejs/kit";
import axios from "axios";

const getIp = (req: Request) => {
	return req.headers.get("x-forwarded-for")?.split(/\s*,\s*/)[0];
};

const prepareResponse = (res: TIpInfoResponse): TUserLocation => {
	const { city, country, ip, loc } = res.data;

	const [lat, lon] = loc.split(",").map(Number.parseFloat);

	return UserLocationSchema.parse({
		location: `${city}, ${country}`,
		coords: {
			lat,
			lon,
		},
		ip,
	} as TUserLocation);
};

export const GET: RequestHandler = async ({ request }) => {
	const clientIp = getIp(request) || "";

	const url = `https://ipinfo.io/${clientIp}/json`;

	try {
		const parsedResponse = IpInfoResponseSchema.parse(
			await axios.get(url, {
				params: {
					token: IPINFO_TOKEN,
				},
			}),
		);

		return json(prepareResponse(parsedResponse));
	} catch (error) {
		console.error(error);

		/**
		 * TODO: Remove this block of code when tests are done.
		 */
		return json({
			location: "Anglet, France TEST",
			coords: {
				lat: 43.3112,
				lon: -0.3558,
			},
			ip: "194.167.154.34",
		} as TUserLocation);
	}
};
