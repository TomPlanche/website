import { z } from "zod";

// IP INFO
export const IpInfoResponseSchema = z.object({
	ip: z.string().regex(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/),
	city: z.string(),
	region: z.string(),
	country: z.string(),
	loc: z.string().regex(/^\d{1,3}.\d{1,5},\d{1,3}.\d{1,5}$/),
	org: z.string(),
	postal: z.string(),
	timezone: z.string(),
});

export type TIpInfoResponse = z.infer<typeof IpInfoResponseSchema>;

export const UserLocationSchema = z.object({
	location: z.string(),
	coords: z.object({
		lat: z.number(),
		lon: z.number(),
	}),
	ip: z.string(),
});

export type TUserLocation = z.infer<typeof UserLocationSchema>;

// CURSOR
export type CursorParams = {
	size?: number;
	background?: string;
	opacity?: number;
	blur?: number;
	stiffness?: number;
	damping?: number;
};

// PLAYGROUND
export type TFile = {
	name: string;
	link: string;
};

// WORK
export type TWorkTag = {
	name: string;
	color?: string;
	background?: string;
};

export type TWork = {
	title: string;
	company: string;
	description: string;

	from: string;
	to?: string;

	image?: string;
	tags?: TWorkTag[];
};
