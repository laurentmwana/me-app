import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import type React from "react";
import { toast } from "sonner";
import { createWork } from "#/actions/work.action";
import { WorkForm } from "#/features/work/work-form";
import { AdminLayout } from "#/layouts/admin-layout";
import type { WorkValues } from "#/schemas/work.schema";

export const Route = createFileRoute("/_protected/admin/works/new")({ component: Page });

function Page() {
	const navigate = useNavigate();
	const mutation = useMutation({
		mutationFn: async (values: WorkValues) => createWork({ data: values }),
		onSuccess: async () => {
			await navigate({ to: "/admin/works" });
			toast.success("Expérience créée");
		},
		onError: (e) => toast.error(e.message),
	});
	return (
		<Layout>
			<WorkForm isPending={mutation.isPending} error={mutation.error?.message} onSubmit={(v) => mutation.mutate(v)} />
		</Layout>
	);
}

function Layout({ children }: { children: React.ReactNode }) {
	return (
		<AdminLayout breadcrumbs={[{ href: "/admin/works", title: "Expériences" }, { href: "", title: "Création" }]}>
			<div className="backoffice-container-md">
				<div className="mb-4">
					<h1 className="backoffice-title mb-2">Nouvelle expérience</h1>
				</div>
				<section>{children}</section>
			</div>
		</AdminLayout>
	);
}