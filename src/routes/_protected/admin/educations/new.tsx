import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import type React from "react";
import { toast } from "sonner";
import { createEducation } from "#/actions/education.action";
import { EducationForm } from "#/features/education/education-form";
import { AdminLayout } from "#/layouts/admin-layout";
import type { EducationValues } from "#/schemas/education.schema";

export const Route = createFileRoute("/_protected/admin/educations/new")({ component: Page });

function Page() {
	const navigate = useNavigate();
	const mutation = useMutation({
		mutationFn: async (values: EducationValues) => createEducation({ data: values }),
		onSuccess: async () => { await navigate({ to: "/admin/educations" }); toast.success("Formation créée"); },
		onError: (e) => toast.error(e.message),
	});
	return (
		<Layout>
			<EducationForm isPending={mutation.isPending} error={mutation.error?.message} onSubmit={(v) => mutation.mutate(v)} />
		</Layout>
	);
}

function Layout({ children }: { children: React.ReactNode }) {
	return (
		<AdminLayout breadcrumbs={[{ href: "/admin/educations", title: "Formations" }, { href: "", title: "Création" }]}>
			<div className="backoffice-container-md">
				<div className="mb-4"><h1 className="backoffice-title mb-2">Nouvelle formation</h1></div>
				<section>{children}</section>
			</div>
		</AdminLayout>
	);
}