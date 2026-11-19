import { createFileRoute, redirect } from "@tanstack/react-router";
import { findProfile } from "#/actions/my-profile.action";

export const Route = createFileRoute("/_protected/admin/profiles/$id/")({
	beforeLoad: async ({ params }) => {
		const profile = await findProfile({ data: { id: params.id } });
		if (profile?.id) {
			throw redirect({
				to: "/admin/profiles/$id/edit",
				params: { id: profile.id },
			});
		}
	},
	component: Page,
});

function Page() {
	return (
		<div className="flex h-full items-center justify-center">
			<p className="text-muted-foreground">Profil introuvable.</p>
		</div>
	);
}
