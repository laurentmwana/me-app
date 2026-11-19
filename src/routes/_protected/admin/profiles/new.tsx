import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import type React from "react";
import { toast } from "sonner";
import { createProfile } from "#/actions/my-profile.action";
import { ProfileForm } from "#/features/my-profile/profile-form";
import { AdminLayout } from "#/layouts/admin-layout";
import type { MyProfileValues } from "#/schemas/my-profile.schema";

export const Route = createFileRoute("/_protected/admin/profiles/new")({ component: Page });

function Page() {
	const navigate = useNavigate();
	const mutation = useMutation({
		mutationFn: async (values: MyProfileValues) => createProfile({ data: values }),
		onSuccess: async () => { await navigate({ to: "/admin/profiles" }); toast.success("Profil créé"); },
		onError: (e) => toast.error(e.message),
	});
	return (<Layout><ProfileForm isPending={mutation.isPending} error={mutation.error?.message} onSubmit={(v) => mutation.mutate(v)} /></Layout>);
}

function Layout({ children }: { children: React.ReactNode }) {
	return (
		<AdminLayout breadcrumbs={[{ href: "/admin/profiles", title: "Profils" }, { href: "", title: "Création" }]}>
			<div className="backoffice-container-md">
				<div className="mb-4"><h1 className="backoffice-title mb-2">Nouveau profil</h1></div>
				<section>{children}</section>
			</div>
		</AdminLayout>
	);
}