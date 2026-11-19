import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import type React from "react";
import { toast } from "sonner";
import { createProject } from "#/actions/project.action";
import { ProjectForm } from "#/features/project/project-form";
import { AdminLayout } from "#/layouts/admin-layout";
import type { ProjectValues } from "#/schemas/project.schema";

export const Route = createFileRoute("/_protected/admin/projects/new")({ component: Page });

function Page() {
	const navigate = useNavigate();
	const mutation = useMutation({
		mutationFn: async (values: ProjectValues) => createProject({ data: values }),
		onSuccess: async () => { await navigate({ to: "/admin/projects" }); toast.success("Projet créé"); },
		onError: (e) => toast.error(e.message),
	});
	return (<Layout><ProjectForm isPending={mutation.isPending} error={mutation.error?.message} onSubmit={(v) => mutation.mutate(v)} /></Layout>);
}

function Layout({ children }: { children: React.ReactNode }) {
	return (
		<AdminLayout breadcrumbs={[{ href: "/admin/projects", title: "Projets" }, { href: "", title: "Création" }]}>
			<div className="backoffice-container-md">
				<div className="mb-4"><h1 className="backoffice-title mb-2">Nouveau projet</h1></div>
				<section>{children}</section>
			</div>
		</AdminLayout>
	);
}