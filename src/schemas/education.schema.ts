import { z } from "zod";
import { optionalUrl } from "#/lib/validators";

export const educationSchema = z.object({
	school: z.string().min(1, "L'école est requise"),
	degree: z.string().min(1, "Le diplôme est requis"),
	description: z.string().optional().or(z.literal("")),
	href: optionalUrl,
	logoUrl: optionalUrl,
	start: z.string().min(1, "La date de début est requise"),
	end: z.string().optional().or(z.literal("")),
	isPublished: z.boolean().default(false),
});

export type EducationValues = z.infer<typeof educationSchema>;