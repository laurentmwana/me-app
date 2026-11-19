import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import type React from "react";
import { toast } from "sonner";
import { createCV } from "#/actions/cv.action";
import { CVForm } from "#/features/cv/cv-form";
import { AdminLayout } from "#/layouts/admin-layout";
import type { CVValues } from "#/schemas/cv.schema";

export const Route = createFileRoute("/_protected/admin/cvs/new")({ component: Page });

function Page() {
	const navigate = useNavigate();
	const mutation = useMutation({
		mutationFn: async (values: CVValues) => createCV({ data: values }),
		onSuccess: async () => { await navigate({ to: "/admin/cvs" }); toast.success("CV créé"); },
		onError: (e) => toast.error(e.message),
	});
	return (<Layout><CVForm isPending={mutation.isPending} error={mutation.error?.message} onSubmit={(v) => mutation.mutate(v)} /></Layout>);
}

function Layout({ children }: { children: React.ReactNode }) {
	return (
		<AdminLayout breadcrumbs={[{ href: "/admin/cvs", title: "CVs" }, { href: "", title: "Création" }]}>
			<div className="backoffice-container-md">
				<div className="mb-4"><h1 className="backoffice-title mb-2">Nouveau CV</h1></div>
				<section>{children}</section>
			</div>
		</AdminLayout>
	);
}