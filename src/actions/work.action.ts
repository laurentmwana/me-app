import { createServerFn } from "@tanstack/react-start";
import { prisma } from "#/lib/prisma";
import type { WorkValues } from "#/schemas/work.schema";

export const findLatestPublishedWorksFn = createServerFn({ method: "GET" })
	.validator((data: { limit?: number }) => data)
	.handler(async ({ data = { limit: 10 } }) => {
		return await prisma.work.findMany({
			where: { isPublished: true },
			orderBy: { start: "desc" },
			take: data.limit,
		});
	});

export const findPublishedWorkByIdFn = createServerFn({ method: "GET" })
	.validator((data: { id: string }) => data)
	.handler(async ({ data }) => {
		return await prisma.work.findUniqueOrThrow({
			where: { isPublished: true, id: data.id },
		});
	});

export const findPaginatedWorksPublished = createServerFn({
	method: "GET",
})
	.validator(
		(data: {
			limit?: number;
			page?: number;
			offset?: number;
			orderBy?: string;
			direction?: string;
		}) => {
			let safeOrderBy = data.orderBy || "updatedAt";
			if (safeOrderBy === "startAt") {
				safeOrderBy = "start";
			}

			const safeDirection = data.direction === "asc" ? "asc" : "desc";

			return {
				...data,
				orderBy: safeOrderBy,
				direction: safeDirection,
			};
		},
	)
	.handler(
		async ({
			data = {
				limit: 12,
				page: 1,
				offset: 0,
				orderBy: "updatedAt",
				direction: "desc",
			},
		}) => {
			const [count, items] = await prisma.$transaction([
				prisma.work.count({ where: { isPublished: true } }),
				prisma.work.findMany({
					where: { isPublished: true },
					orderBy: {
						[data.orderBy]: data.direction,
					},
					take: data.limit,
					skip: data.offset,
				}),
			]);
			return { count, items };
		},
	);

export const countWorks = createServerFn({ method: "GET" })
	.validator((data: { isPublished: boolean | null }) => data)
	.handler(async ({ data }) => {
		if (data.isPublished) {
			return await prisma.work.count({
				where: { isPublished: data.isPublished },
			});
		}

		return await prisma.work.count();
	});

export const findPaginatedWorks = createServerFn({ method: "GET" })
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
							{ company: { contains: data.search, mode: "insensitive" as const } },
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
				prisma.work.count({ where: searchCondition }),
				prisma.work.findMany({
					where: searchCondition,
					orderBy: {
						[data.orderBy as keyof typeof prisma.work.fields]: data.direction,
					},
					take: data.limit,
					skip: data.offset,
				}),
			]);
			return { count, items };
		},
	);

export const findWork = createServerFn({ method: "GET" })
	.validator((data: { id: string }) => data)
	.handler(async ({ data }) => {
		return await prisma.work.findFirstOrThrow({ where: { id: data.id } });
	});

export const createWork = createServerFn({ method: "POST" })
	.validator((data: WorkValues) => data)
	.handler(async ({ data }) => {
		return await prisma.work.create({
			data: {
				title: data.title,
				company: data.company,
				description: data.description,
				location: data.location || null,
				href: data.href || null,
				logoUrl: data.logoUrl || null,
				badges: data.badges
					? data.badges.split(",").map((b) => b.trim()).filter(Boolean)
					: [],
				start: new Date(data.start),
				end: data.end ? new Date(data.end) : null,
				isPublished: data.isPublished,
			},
		});
	});

export const updateWork = createServerFn({ method: "POST" })
	.validator((data: { id: string; formData: WorkValues }) => data)
	.handler(async ({ data }) => {
		return await prisma.work.update({
			where: { id: data.id },
			data: {
				title: data.formData.title,
				company: data.formData.company,
				description: data.formData.description,
				location: data.formData.location || null,
				href: data.formData.href || null,
				logoUrl: data.formData.logoUrl || null,
				badges: data.formData.badges
					? data.formData.badges
							.split(",")
							.map((b) => b.trim())
							.filter(Boolean)
					: [],
				start: new Date(data.formData.start),
				end: data.formData.end ? new Date(data.formData.end) : null,
				isPublished: data.formData.isPublished,
			},
		});
	});

export const deleteWork = createServerFn({ method: "POST" })
	.validator((data: { id: string }) => data)
	.handler(async ({ data }) => {
		return await prisma.work.delete({ where: { id: data.id } });
	});
