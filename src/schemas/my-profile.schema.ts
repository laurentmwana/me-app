import { z } from "zod";
import { optionalUrl } from "#/lib/validators";

export const profileSchema = z.object({
	title: z
		.string()
		.min(2, "Le titre doit contenir au moins 2 caractères")
		.max(200, "Le titre ne peut pas dépasser 200 caractères"),
	description: z
		.string()
		.min(2, "La description doit contenir au moins 2 caractères"),
	content: z.string().optional(),
	imageUrl: optionalUrl,
	pdfUrl: optionalUrl,
	isPublished: z.boolean().default(false),
});

export type MyProfileValues = z.infer<typeof profileSchema>;
