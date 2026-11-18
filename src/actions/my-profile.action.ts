import { createServerFn } from "@tanstack/react-start";
import { prisma } from "#/lib/prisma";
import type { MyProfileValues } from "#/schemas/my-profile.schema";

/* -------------------------------------------------------------------------- */
/*                                  LECTURE                                   */
/* -------------------------------------------------------------------------- */

export const findLatestPublishedProfilesFn = createServerFn({ method: "GET" })
	.validator((data: { limit?: number }) => data)
	.handler(async ({ data = { limit: 10 } }) => {
		return await prisma.profile.findMany({
			where: { isPublished: true },
			orderBy: { updatedAt: "desc" },
			take: data.limit,
		});
	});

export const findPublishedProfileByIdFn = createServerFn({ method: "GET" })
	.validator((data: { id: string }) => data)
	.handler(async ({ data }) => {
		return await prisma.profile.findFirstOrThrow({
			where: { isPublished: true, id: data.id },
		});
	});

export const findPaginatedProfilesPublished = createServerFn({
	method: "GET",
})
	.validator(
		(data: {
			limit?: number;
			page?: number;
			offset?: number;
			orderBy?: string;
			direction?: string;
			search?: string;
		}) => data,
	)
	.handler(
		async ({
			data = {
				limit: 10,
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

			const whereClause = {
				isPublished: true,
				...searchCondition,
			};

			const [count, items] = await prisma.$transaction([
				prisma.profile.count({ where: whereClause }),
				prisma.profile.findMany({
					where: whereClause,
					orderBy: {
						[data.orderBy as keyof typeof prisma.profile.fields]:
							data.direction,
					},
					take: data.limit,
					skip: data.offset,
				}),
			]);
			return { count, items };
		},
	);

export const findPaginatedProfiles = createServerFn({
	method: "GET",
})
	.validator(
		(data: {
			limit?: number;
			page?: number;
			offset?: number;
			orderBy?: string;
			direction?: string;
			search?: string|null;
		}) => data,
	)
	.handler(
		async ({
			data = {
				limit: 10,
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
				prisma.profile.count({
					where: searchCondition,
				}),
				prisma.profile.findMany({
					where: searchCondition,
					orderBy: {
						[data.orderBy as keyof typeof prisma.profile.fields]:
							data.direction,
					},
					take: data.limit,
					skip: data.offset,
				}),
			]);
			return { count, items };
		},
	);

export const deleteProfileFn = createServerFn({ method: "POST" })
	.validator((data: { id: string }) => data)
	.handler(async ({ data }) => {
		return await prisma.profile.delete({ where: { id: data.id } });
	});

export const findProfile = createServerFn({ method: "GET" })
	.validator((data: { id: string }) => data)
	.handler(async ({ data }) => {
		return await prisma.profile.findFirstOrThrow({
			where: { id: data.id },
		});
	});

/* -------------------------------------------------------------------------- */
/*                             MISE À JOUR (EDIT)                             */
/* -------------------------------------------------------------------------- */

export const updateProfile = createServerFn({ method: "POST" })
	.validator((data: { id: string; formData: MyProfileValues }) => data)
	.handler(async ({ data }) => {
		const existingProfile = await prisma.profile.findFirst({
			where: {
				title: data.formData.title,
				NOT: { id: data.id },
			},
		});

		if (existingProfile) {
			throw new Error("Un profil avec ce titre existe déjà.");
		}

		return await prisma.profile.update({
			where: { id: data.id },
			data: {
				title: data.formData.title,
				description: data.formData.description,
				content: data.formData.content,
				imageUrl: data.formData.imageUrl,
				pdfUrl: data.formData.pdfUrl,
				isPublished: data.formData.isPublished,
			},
		});
	});

/* -------------------------------------------------------------------------- */
/*                                  CRÉATION                                  */
/* -------------------------------------------------------------------------- */

export const createProfile = createServerFn({ method: "POST" })
	.validator((data: MyProfileValues) => data)
	.handler(async ({ data }) => {
		const existingProfile = await prisma.profile.findFirst({
			where: { title: data.title },
		});

		if (existingProfile) {
			throw new Error("Un profil avec ce titre existe déjà.");
		}

		return await prisma.profile.create({
			data: {
				title: data.title,
				description: data.description,
				content: data.content,
				imageUrl: data.imageUrl,
				pdfUrl: data.pdfUrl,
				isPublished: data.isPublished,
			},
		});
	});

/* -------------------------------------------------------------------------- */
/*                                  COMPTAGE                                  */
/* -------------------------------------------------------------------------- */

export const countProfiles = createServerFn({ method: "GET" })
	.validator((data: { isPublished: boolean | null }) => data)
	.handler(async ({ data }) => {
		if (data.isPublished) {
			return await prisma.profile.count({
				where: { isPublished: data.isPublished },
			});
		}

		return await prisma.profile.count();
	});
