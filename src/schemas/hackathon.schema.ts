import { z } from "zod";
import { optionalUrl } from "#/lib/validators";

export const hackathonSchema = z.object({
	title: z.string().min(1, "Le titre est requis"),
	location: z.string().optional().or(z.literal("")),
	description: z.string().min(1, "La description est requise"),
	image: optionalUrl,
	mlh: optionalUrl,
	win: z.string().optional().or(z.literal("")),
	icon: z.string().optional().or(z.literal("")),
	start: z.string().min(1, "La date de début est requise"),
	end: z.string().optional().or(z.literal("")),
	isPublished: z.boolean().default(false),
});

export type HackathonValues = z.infer<typeof hackathonSchema>;