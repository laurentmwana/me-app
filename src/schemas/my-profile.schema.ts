import { z } from "zod";

export const profileSchema = z.object({
	title: z
		.string()
		.min(2, "Le titre doit contenir au moins 2 caractères")
		.max(200, "Le titre ne peut pas dépasser 200 caractères"),
	description: z
		.string()
		.min(2, "La description doit contenir au moins 2 caractères"),
	content: z.string().optional(),
	imageUrl: z.string().url("URL d'image invalide").optional().or(z.literal("")),
	pdfUrl: z.string().url("URL du PDF invalide").optional().or(z.literal("")),
	isPublished: z.boolean().default(false),
});

export type MyProfileValues = z.infer<typeof profileSchema>;
