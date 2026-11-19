import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "#/layouts/admin-layout";

export const Route = createFileRoute("/_protected/admin/about")({ component: Page });

function Page() {
	return (
		<AdminLayout breadcrumbs={[{ href: "/dashboard", title: "Tableau de bord" }, { href: "", title: "À propos" }]}>
			<div>
				<h1 className="backoffice-title mb-2">À propos</h1>
				<p className="backoffice-description">Gérez la section « À propos » de votre portfolio.</p>
			</div>
		</AdminLayout>
	);
}
