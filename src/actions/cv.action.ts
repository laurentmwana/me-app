import { createServerFn } from "@tanstack/react-start";
import { prisma } from "#/lib/prisma";
import type { CVValues } from "#/schemas/cv.schema";

export const findPaginatedCVs = createServerFn({ method: "GET" })
	.validator(
		(data: {
			limit?: number;
			page?: number;
			offset?: number;
			orderBy?: string;
			direction?: string;
			search?: string | null;
		}) => data,
	)
	.handler(
		async ({
			data = {
				limit: 12,
				page: 1,
				offset: 0,
				orderBy: "createdAt",
				direction: "desc",
			},
		}) => {
			const searchCondition = data.search
				? {
						OR: [
							{ title: { contains: data.search, mode: "insensitive" as const } },
							{ language: { contains: data.search, mode: "insensitive" as const } },
							{
								description: {
									contains: data.search,
									mode: "insensitive" as const,
								},
							},
						],
					}
				: {};

			const [count, items] = await prisma.$transaction([
				prisma.cV.count({ where: searchCondition }),
				prisma.cV.findMany({
					where: searchCondition,
					orderBy: {
						[data.orderBy as keyof typeof prisma.cV.fields]: data.direction,
					},
					take: data.limit,
					skip: data.offset,
				}),
			]);
			return { count, items };
		},
	);

export const findCV = createServerFn({ method: "GET" })
	.validator((data: { id: string }) => data)
	.handler(async ({ data }) => {
		return await prisma.cV.findFirstOrThrow({ where: { id: data.id } });
	});

export const createCV = createServerFn({ method: "POST" })
	.validator((data: CVValues) => data)
	.handler(async ({ data }) => {
		return await prisma.cV.create({
			data: {
				title: data.title,
				language: data.language,
				description: data.description,
				pdfUrl: data.pdfUrl,
				isActive: data.isActive,
				isPublished: data.isPublished,
				version: data.version,
			},
		});
	});

export const updateCV = createServerFn({ method: "POST" })
	.validator((data: { id: string; formData: CVValues }) => data)
	.handler(async ({ data }) => {
		return await prisma.cV.update({
			where: { id: data.id },
			data: {
				title: data.formData.title,
				language: data.formData.language,
				description: data.formData.description,
				pdfUrl: data.formData.pdfUrl,
				isActive: data.formData.isActive,
				isPublished: data.formData.isPublished,
				version: data.formData.version,
			},
		});
	});

export const deleteCV = createServerFn({ method: "POST" })
	.validator((data: { id: string }) => data)
	.handler(async ({ data }) => {
		return await prisma.cV.delete({ where: { id: data.id } });
	});

export const findActivePublishedCVFn = createServerFn({ method: "GET" })
	.handler(async () => {
		return await prisma.cV.findFirst({
			where: { isActive: true, isPublished: true },
			orderBy: { createdAt: "desc" },
		});
	});

export const countCVs = createServerFn({ method: "GET" })
	.validator((data: { isPublished: boolean | null }) => data)
	.handler(async ({ data }) => {
		if (data.isPublished) {
			return await prisma.cV.count({ where: { isPublished: data.isPublished } });
		}
		return await prisma.cV.count();
	});