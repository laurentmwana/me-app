import { z } from "zod";
import { optionalUrl } from "#/lib/validators";

export const workSchema = z.object({
	title: z.string().min(1, "Le titre est requis"),
	company: z.string().min(1, "L'entreprise est requise"),
	description: z.string().min(1, "La description est requise"),
	location: z.string().optional().or(z.literal("")),
	href: optionalUrl,
	logoUrl: optionalUrl,
	badges: z.string().optional().or(z.literal("")),
	start: z.string().min(1, "La date de début est requise"),
	end: z.string().optional().or(z.literal("")),
	isPublished: z.boolean().default(false),
});

export type WorkValues = z.infer<typeof workSchema>;