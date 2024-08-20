import { z } from "zod";

const zodStringBoolean = z
	.union([z.literal("false"), z.literal("true")])
	.transform((value) => value.toLowerCase() === "true");

export const zodBooleanUnion = z.union([
	z.literal(0).transform(() => false),
	z.literal(1).transform(() => true),
	z
		.union([z.literal("0"), z.literal("1")])
		.transform((v) => !!Number.parseInt(v, 10)),
	z
		.string()
		.transform((v) => v.toLowerCase())
		.pipe(zodStringBoolean),

	z.boolean(),
]);
