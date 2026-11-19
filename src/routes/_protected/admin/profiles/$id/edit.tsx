import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import type React from "react";
import { toast } from "sonner";
import { findProfile, updateProfile } from "#/actions/my-profile.action";
import { ProfileForm } from "#/features/my-profile/profile-form";
import { AdminLayout } from "#/layouts/admin-layout";
import type { MyProfileValues } from "#/schemas/my-profile.schema";
import { ServerError } from "#/shared/errors";
import { TableSkeleton } from "#/shared/table-skeleton";

export const Route = createFileRoute("/_protected/admin/profiles/$id/edit")({
	component: Page,
	pendingComponent: () => (<Layout><TableSkeleton columns={4} showHeader={true} /></Layout>),
	loader: async ({ params }) => findProfile({ data: { id: params.id } }),
});

function Page() {
	const profile = Route.useLoaderData();
	const navigate = useNavigate();
	const mutation = useMutation({
		mutationFn: async (values: MyProfileValues) => updateProfile({ data: { id: profile.id, formData: values } }),
		onSuccess: async () => { await navigate({ to: "/admin/profiles" }); toast.success("Profil modifié"); },
		onError: (e) => toast.error(e.message),
	});
	if (!profile) return (<Layout><ServerError title="Introuvable" message="Aucun profil" /></Layout>);
	return (<Layout><ProfileForm profile={profile} isPending={mutation.isPending} error={mutation.error?.message} onSubmit={(v) => mutation.mutate(v)} /></Layout>);
}

function Layout({ children }: { children: React.ReactNode }) {
	return (
		<AdminLayout breadcrumbs={[{ href: "/admin/profiles", title: "Profils" }, { href: "", title: "Édition" }]}>
			<div className="backoffice-container-md">
				<div className="mb-4"><h1 className="backoffice-title mb-2">Modifier le profil</h1></div>
				<section>{children}</section>
			</div>
		</AdminLayout>
	);
}