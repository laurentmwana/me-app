import { createServerFn } from "@tanstack/react-start";
import { prisma } from "#/lib/prisma";
import type { HackathonValues } from "#/schemas/hackathon.schema";

export const findLatestPublishedHackathonsFn = createServerFn({ method: "GET" })
	.validator((data: { limit?: number }) => data)
	.handler(async ({ data = { limit: 10 } }) => {
		return await prisma.hackathon.findMany({
			where: { isPublished: true },
			orderBy: { start: "desc" },
			take: data.limit,
			include: {
				links: true,
			},
		});
	});

export const findPublishedHackathonByIdFn = createServerFn({ method: "GET" })
	.validator((data: { id: string }) => data)
	.handler(async ({ data }) => {
		return await prisma.hackathon.findUniqueOrThrow({
			where: { isPublished: true, id: data.id },
			include: { links: true },
		});
	});

export const findPaginatedHackathonsPublished = createServerFn({
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
				prisma.hackathon.count({ where: { isPublished: true } }),
				prisma.hackathon.findMany({
					where: { isPublished: true },
					orderBy: {
						[data.orderBy]: data.direction,
					},
					take: data.limit,
					skip: data.offset,
					include: { links: true },
				}),
			]);
			return { count, items };
		},
	);

export const countHackathons = createServerFn({ method: "GET" })
	.validator((data: { isPublished: boolean | null }) => data)
	.handler(async ({ data }) => {
		if (data.isPublished) {
			return await prisma.hackathon.count({
				where: { isPublished: data.isPublished },
			});
		}

		return await prisma.hackathon.count();
	});

export const findPaginatedHackathons = createServerFn({ method: "GET" })
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
							{ location: { contains: data.search, mode: "insensitive" as const } },
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
				prisma.hackathon.count({ where: searchCondition }),
				prisma.hackathon.findMany({
					where: searchCondition,
					orderBy: {
						[data.orderBy as keyof typeof prisma.hackathon.fields]: data.direction,
					},
					take: data.limit,
					skip: data.offset,
					include: { links: true },
				}),
			]);
			return { count, items };
		},
	);

export const findHackathon = createServerFn({ method: "GET" })
	.validator((data: { id: string }) => data)
	.handler(async ({ data }) => {
		return await prisma.hackathon.findFirstOrThrow({
			where: { id: data.id },
			include: { links: true },
		});
	});

export const createHackathon = createServerFn({ method: "POST" })
	.validator((data: HackathonValues) => data)
	.handler(async ({ data }) => {
		return await prisma.hackathon.create({
			data: {
				title: data.title,
				location: data.location || null,
				description: data.description,
				image: data.image || null,
				mlh: data.mlh || null,
				win: data.win || null,
				icon: data.icon || null,
				start: new Date(data.start),
				end: data.end ? new Date(data.end) : null,
				isPublished: data.isPublished,
			},
		});
	});

export const updateHackathon = createServerFn({ method: "POST" })
	.validator((data: { id: string; formData: HackathonValues }) => data)
	.handler(async ({ data }) => {
		return await prisma.hackathon.update({
			where: { id: data.id },
			data: {
				title: data.formData.title,
				location: data.formData.location || null,
				description: data.formData.description,
				image: data.formData.image || null,
				mlh: data.formData.mlh || null,
				win: data.formData.win || null,
				icon: data.formData.icon || null,
				start: new Date(data.formData.start),
				end: data.formData.end ? new Date(data.formData.end) : null,
				isPublished: data.formData.isPublished,
			},
		});
	});

export const deleteHackathon = createServerFn({ method: "POST" })
	.validator((data: { id: string }) => data)
	.handler(async ({ data }) => {
		return await prisma.hackathon.delete({ where: { id: data.id } });
	});
