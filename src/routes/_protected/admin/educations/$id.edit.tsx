import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import type React from "react";
import { toast } from "sonner";
import { findEducation, updateEducation } from "#/actions/education.action";
import { EducationForm } from "#/features/education/education-form";
import { AdminLayout } from "#/layouts/admin-layout";
import type { EducationValues } from "#/schemas/education.schema";
import { ServerError } from "#/shared/errors";
import { TableSkeleton } from "#/shared/table-skeleton";

export const Route = createFileRoute("/_protected/admin/educations/$id/edit")({
	component: Page,
	pendingComponent: () => (<Layout><TableSkeleton columns={4} showHeader={true} /></Layout>),
	loader: async ({ params }) => findEducation({ data: { id: params.id } }),
});

function Page() {
	const education = Route.useLoaderData();
	const navigate = useNavigate();
	const mutation = useMutation({
		mutationFn: async (values: EducationValues) => updateEducation({ data: { id: education.id, formData: values } }),
		onSuccess: async () => { await navigate({ to: "/admin/educations" }); toast.success("Formation modifiée"); },
		onError: (e) => toast.error(e.message),
	});
	if (!education) return (<Layout><ServerError title="Introuvable" message="Aucune formation" /></Layout>);
	return (
		<Layout>
			<EducationForm education={education} isPending={mutation.isPending} error={mutation.error?.message} onSubmit={(v) => mutation.mutate(v)} />
		</Layout>
	);
}

function Layout({ children }: { children: React.ReactNode }) {
	return (
		<AdminLayout breadcrumbs={[{ href: "/admin/educations", title: "Formations" }, { href: "", title: "Édition" }]}>
			<div className="backoffice-container-md">
				<div className="mb-4"><h1 className="backoffice-title mb-2">Modifier la formation</h1></div>
				<section>{children}</section>
			</div>
		</AdminLayout>
	);
}