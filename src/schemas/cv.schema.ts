import { z } from "zod";

export const cvSchema = z.object({
	title: z.string().min(1, "Le titre est requis"),
	language: z.string().min(1, "La langue est requise"),
	description: z.string().nullable(),
	pdfUrl: z.string().min(1, "Le fichier PDF est requis"),
	isActive: z.boolean().default(false),
	isPublished: z.boolean().default(false),
	version: z.string().nullable(),
});

export type CVValues = z.infer<typeof cvSchema>;