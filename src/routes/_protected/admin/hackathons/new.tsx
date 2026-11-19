import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import type React from "react";
import { toast } from "sonner";
import { createHackathon } from "#/actions/hackthon.action";
import { HackathonForm } from "#/features/hackathon/hackathon-form";
import { AdminLayout } from "#/layouts/admin-layout";
import type { HackathonValues } from "#/schemas/hackathon.schema";

export const Route = createFileRoute("/_protected/admin/hackathons/new")({ component: Page });

function Page() {
	const navigate = useNavigate();
	const mutation = useMutation({
		mutationFn: async (values: HackathonValues) => createHackathon({ data: values }),
		onSuccess: async () => { await navigate({ to: "/admin/hackathons" }); toast.success("Hackathon créé"); },
		onError: (e) => toast.error(e.message),
	});
	return (<Layout><HackathonForm isPending={mutation.isPending} error={mutation.error?.message} onSubmit={(v) => mutation.mutate(v)} /></Layout>);
}

function Layout({ children }: { children: React.ReactNode }) {
	return (
		<AdminLayout breadcrumbs={[{ href: "/admin/hackathons", title: "Hackathons" }, { href: "", title: "Création" }]}>
			<div className="backoffice-container-md">
				<div className="mb-4"><h1 className="backoffice-title mb-2">Nouveau hackathon</h1></div>
				<section>{children}</section>
			</div>
		</AdminLayout>
	);
}