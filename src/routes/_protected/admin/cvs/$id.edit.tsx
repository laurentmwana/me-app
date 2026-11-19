import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import type React from "react";
import { toast } from "sonner";
import { findCV, updateCV } from "#/actions/cv.action";
import { CVForm } from "#/features/cv/cv-form";
import { AdminLayout } from "#/layouts/admin-layout";
import type { CVValues } from "#/schemas/cv.schema";
import { ServerError } from "#/shared/errors";
import { TableSkeleton } from "#/shared/table-skeleton";

export const Route = createFileRoute("/_protected/admin/cvs/$id/edit")({
	component: Page,
	pendingComponent: () => (<Layout><TableSkeleton columns={4} showHeader={true} /></Layout>),
	loader: async ({ params }) => findCV({ data: { id: params.id } }),
});

function Page() {
	const cv = Route.useLoaderData();
	const navigate = useNavigate();
	const mutation = useMutation({
		mutationFn: async (values: CVValues) => updateCV({ data: { id: cv.id, formData: values } }),
		onSuccess: async () => { await navigate({ to: "/admin/cvs" }); toast.success("CV modifié"); },
		onError: (e) => toast.error(e.message),
	});
	if (!cv) return (<Layout><ServerError title="Introuvable" message="Aucun CV" /></Layout>);
	return (<Layout><CVForm cv={cv} isPending={mutation.isPending} error={mutation.error?.message} onSubmit={(v) => mutation.mutate(v)} /></Layout>);
}

function Layout({ children }: { children: React.ReactNode }) {
	return (
		<AdminLayout breadcrumbs={[{ href: "/admin/cvs", title: "CVs" }, { href: "", title: "Édition" }]}>
			<div className="backoffice-container-md">
				<div className="mb-4"><h1 className="backoffice-title mb-2">Modifier le CV</h1></div>
				<section>{children}</section>
			</div>
		</AdminLayout>
	);
}