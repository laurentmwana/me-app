// #/actions/project.action.ts
import { createServerFn } from "@tanstack/react-start";
import { prisma } from "#/lib/prisma";
import type { ProjectValues } from "#/schemas/project.schema";

export const findLatestPublishedProjectsFn = createServerFn({ method: "GET" })
	.validator((data: { limit?: number }) => data)
	.handler(async ({ data = { limit: 10 } }) => {
		return await prisma.project.findMany({
			where: { isPublished: true },
			orderBy: { start: "desc" },
			take: data.limit,
			include: {
				links: true,
			},
		});
	});

export const findPublishedProjectByIdFn = createServerFn({ method: "GET" })
	.validator((data: { id: string }) => data)
	.handler(async ({ data }) => {
		return await prisma.project.findUniqueOrThrow({
			where: { isPublished: true, id: data.id },
			include: { links: true },
		});
	});

export const findPaginatedProjectsPublished = createServerFn({
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
				prisma.project.count({ where: { isPublished: true } }),
				prisma.project.findMany({
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

export const countProjects = createServerFn({ method: "GET" })
	.validator((data: { isPublished: boolean | null }) => data)
	.handler(async ({ data }) => {
		if (data.isPublished) {
			return await prisma.project.count({
				where: { isPublished: data.isPublished },
			});
		}

		return await prisma.project.count();
	});

export const findPaginatedProjects = createServerFn({ method: "GET" })
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
				prisma.project.count({ where: searchCondition }),
				prisma.project.findMany({
					where: searchCondition,
					orderBy: {
						[data.orderBy as keyof typeof prisma.project.fields]: data.direction,
					},
					take: data.limit,
					skip: data.offset,
					include: { links: true },
				}),
			]);
			return { count, items };
		},
	);

export const findProject = createServerFn({ method: "GET" })
	.validator((data: { id: string }) => data)
	.handler(async ({ data }) => {
		return await prisma.project.findFirstOrThrow({
			where: { id: data.id },
			include: { links: true },
		});
	});

export const createProject = createServerFn({ method: "POST" })
	.validator((data: ProjectValues) => data)
	.handler(async ({ data }) => {
		return await prisma.project.create({
			data: {
				title: data.title,
				description: data.description,
				href: data.href || null,
				image: data.image || null,
				video: data.video || null,
				technologies: data.technologies
					? data.technologies.split(",").map((t) => t.trim()).filter(Boolean)
					: [],
				start: new Date(data.start),
				end: data.end ? new Date(data.end) : null,
				isPublished: data.isPublished,
			},
		});
	});

export const updateProject = createServerFn({ method: "POST" })
	.validator((data: { id: string; formData: ProjectValues }) => data)
	.handler(async ({ data }) => {
		return await prisma.project.update({
			where: { id: data.id },
			data: {
				title: data.formData.title,
				description: data.formData.description,
				href: data.formData.href || null,
				image: data.formData.image || null,
				video: data.formData.video || null,
				technologies: data.formData.technologies
					? data.formData.technologies.split(",").map((t) => t.trim()).filter(Boolean)
					: [],
				start: new Date(data.formData.start),
				end: data.formData.end ? new Date(data.formData.end) : null,
				isPublished: data.formData.isPublished,
			},
		});
	});

export const deleteProject = createServerFn({ method: "POST" })
	.validator((data: { id: string }) => data)
	.handler(async ({ data }) => {
		return await prisma.project.delete({ where: { id: data.id } });
	});
