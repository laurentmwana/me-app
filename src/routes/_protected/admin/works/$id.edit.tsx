import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import type React from "react";
import { toast } from "sonner";
import { findWork, updateWork } from "#/actions/work.action";
import { WorkForm } from "#/features/work/work-form";
import { AdminLayout } from "#/layouts/admin-layout";
import type { WorkValues } from "#/schemas/work.schema";
import { ServerError } from "#/shared/errors";
import { TableSkeleton } from "#/shared/table-skeleton";

export const Route = createFileRoute("/_protected/admin/works/$id/edit")({
	component: Page,
	pendingComponent: () => (
		<Layout>
			<TableSkeleton columns={4} showHeader={true} />
		</Layout>
	),
	loader: async ({ params }) => findWork({ data: { id: params.id } }),
});

function Page() {
	const work = Route.useLoaderData();
	const navigate = useNavigate();
	const mutation = useMutation({
		mutationFn: async (values: WorkValues) => updateWork({ data: { id: work.id, formData: values } }),
		onSuccess: async () => {
			await navigate({ to: "/admin/works" });
			toast.success("Expérience modifiée");
		},
		onError: (e) => toast.error(e.message),
	});
	if (!work) {
		return (
			<Layout>
				<ServerError title="Introuvable" message="Aucune expérience" />
			</Layout>
		);
	}
	return (
		<Layout>
			<WorkForm work={work} isPending={mutation.isPending} error={mutation.error?.message} onSubmit={(v) => mutation.mutate(v)} />
		</Layout>
	);
}

function Layout({ children }: { children: React.ReactNode }) {
	return (
		<AdminLayout breadcrumbs={[{ href: "/admin/works", title: "Expériences" }, { href: "", title: "Édition" }]}>
			<div className="backoffice-container-md">
				<div className="mb-4">
					<h1 className="backoffice-title mb-2">Modifier l'expérience</h1>
				</div>
				<section>{children}</section>
			</div>
		</AdminLayout>
	);
}