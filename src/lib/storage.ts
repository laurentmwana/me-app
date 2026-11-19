// #/lib/storage.ts
// Service de stockage de fichiers.
// En développement : stockage local dans ./public/uploads
// En production : à rediriger vers un stockage externe (Cloudflare R2 / S3)
// Toutes les fonctions sont conçues pour être interchangeables.

import { mkdir, writeFile, unlink, access } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";

const UPLOAD_DIR = join(process.cwd(), "public", "uploads");

export const ALLOWED_MIME_TYPES: Record<string, string> = {
	"application/pdf": "pdf",
	"image/png": "png",
	"image/jpeg": "jpg",
	"image/jpg": "jpg",
	"image/webp": "webp",
	"image/svg+xml": "svg",
	"image/gif": "gif",
};

export type FileCategory = "cv" | "logo" | "document" | "image";

export interface UploadResult {
	url: string;
	name: string;
	size: number;
	mimeType: string;
}

function getExtension(mimeType: string): string {
	return ALLOWED_MIME_TYPES[mimeType] || "bin";
}

async function ensureDir(category: FileCategory) {
	const dir = join(UPLOAD_DIR, category);
	try {
		await access(dir);
	} catch {
		await mkdir(dir, { recursive: true });
	}
	return dir;
}

export async function uploadFile(params: {
	file: File;
	category: FileCategory;
}): Promise<UploadResult> {
	const { file, category } = params;
	const ext = getExtension(file.type);
	const id = randomUUID();
	const filename = `${id}.${ext}`;
	const dir = await ensureDir(category);
	const filepath = join(dir, filename);

	const buffer = Buffer.from(await file.arrayBuffer());
	await writeFile(filepath, buffer);

	return {
		url: `/uploads/${category}/${filename}`,
		name: file.name,
		size: file.size,
		mimeType: file.type,
	};
}

export async function deleteFile(url: string): Promise<void> {
	if (!url || !url.startsWith("/uploads/")) return;
	const filepath = join(process.cwd(), "public", url);
	try {
		await unlink(filepath);
	} catch {
		// Fichier déjà absent — ignorer silencieusement
	}
}

export function isUploadUrl(url: string | null | undefined): boolean {
	return !!url && url.startsWith("/uploads/");
}