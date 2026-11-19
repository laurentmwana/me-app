import { z } from "zod";

/**
 * Accepte une URL absolue (http/https) ou un chemin local ("/image.png").
 * Les assets du seed vivent dans /public et sont référencés par un chemin.
 */
export const optionalUrl = z
	.string()
	.refine(
		(value) =>
			value === "" ||
			value.startsWith("/") ||
			/^https?:\/\/\S+$/i.test(value),
		{ message: "URL ou chemin invalide" },
	)
	.optional();
