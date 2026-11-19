import { z } from "zod";
import { optionalUrl } from "#/lib/validators";

export const projectSchema = z.object({
	title: z.string().min(1, "Le titre est requis"),
	description: z.string().min(1, "La description est requise"),
	href: optionalUrl,
	image: optionalUrl,
	video: optionalUrl,
	technologies: z.string().optional().or(z.literal("")),
	start: z.string().min(1, "La date de début est requise"),
	end: z.string().optional().or(z.literal("")),
	isPublished: z.boolean().default(false),
});

export type ProjectValues = z.infer<typeof projectSchema>;