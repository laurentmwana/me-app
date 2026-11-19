import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import type React from "react";
import { toast } from "sonner";
import { findHackathon, updateHackathon } from "#/actions/hackthon.action";
import { HackathonForm } from "#/features/hackathon/hackathon-form";
import { AdminLayout } from "#/layouts/admin-layout";
import type { HackathonValues } from "#/schemas/hackathon.schema";
import { ServerError } from "#/shared/errors";
import { TableSkeleton } from "#/shared/table-skeleton";

export const Route = createFileRoute("/_protected/admin/hackathons/$id/edit")({
	component: Page,
	pendingComponent: () => (<Layout><TableSkeleton columns={4} showHeader={true} /></Layout>),
	loader: async ({ params }) => findHackathon({ data: { id: params.id } }),
});

function Page() {
	const hackathon = Route.useLoaderData();
	const navigate = useNavigate();
	const mutation = useMutation({
		mutationFn: async (values: HackathonValues) => updateHackathon({ data: { id: hackathon.id, formData: values } }),
		onSuccess: async () => { await navigate({ to: "/admin/hackathons" }); toast.success("Hackathon modifié"); },
		onError: (e) => toast.error(e.message),
	});
	if (!hackathon) return (<Layout><ServerError title="Introuvable" message="Aucun hackathon" /></Layout>);
	return (<Layout><HackathonForm hackathon={hackathon} isPending={mutation.isPending} error={mutation.error?.message} onSubmit={(v) => mutation.mutate(v)} /></Layout>);
}

function Layout({ children }: { children: React.ReactNode }) {
	return (
		<AdminLayout breadcrumbs={[{ href: "/admin/hackathons", title: "Hackathons" }, { href: "", title: "Édition" }]}>
			<div className="backoffice-container-md">
				<div className="mb-4"><h1 className="backoffice-title mb-2">Modifier le hackathon</h1></div>
				<section>{children}</section>
			</div>
		</AdminLayout>
	);
}