import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "#/layouts/admin-layout";

export const Route = createFileRoute("/_protected/admin/contact")({ component: Page });

function Page() {
	return (
		<AdminLayout breadcrumbs={[{ href: "/dashboard", title: "Tableau de bord" }, { href: "", title: "Contact" }]}>
			<div>
				<h1 className="backoffice-title mb-2">Contact</h1>
				<p className="backoffice-description">Gérez vos informations de contact.</p>
			</div>
		</AdminLayout>
	);
}
