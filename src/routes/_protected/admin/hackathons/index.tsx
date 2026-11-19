import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { findPaginatedHackathons } from "#/actions/hackthon.action";
import { ButtonLink } from "#/components/ui/button-link";
import { DataPagination } from "#/components/ui/data-pagination";
import { SearchInput } from "#/components/ui/search-input";
import { HackathonsTable } from "#/features/hackathon/hackathons-table";
import { AdminLayout } from "#/layouts/admin-layout";
import { offsetPagination } from "#/lib/number";
import { paginationQuerySchema } from "#/schemas/default.schema";
import { TableSkeleton } from "#/shared/table-skeleton";

export const Route = createFileRoute("/_protected/admin/hackathons/")({
	component: Page,
	pendingComponent: () => (<Layout><TableSkeleton columns={5} showHeader={true} /></Layout>),
	validateSearch: paginationQuerySchema,
	loaderDeps: ({ search }) => search,
	loader: async ({ deps }) => {
		const limit = deps.limit ?? 12;
		const page = deps.page ?? 1;
		const offset = offsetPagination(page, limit);
		return await findPaginatedHackathons({ data: { limit, page, offset, direction: "desc", orderBy: "createdAt", search: deps.q } });
	},
});

function Page() {
	const search = Route.useSearch();
	const navigate = Route.useNavigate();
	const { count, items: hackathons } = Route.useLoaderData();
	const [searchTerm, setSearchTerm] = useState(search.q || "");
	useEffect(() => setSearchTerm(search.q || ""), [search.q]);
	useEffect(() => {
		const timer = setTimeout(() => {
			if (searchTerm !== (search.q || "")) {
				navigate({ search: (old) => ({ ...old, page: 1, q: searchTerm ? searchTerm : undefined }), replace: true });
			}
		}, 300);
		return () => clearTimeout(timer);
	}, [searchTerm, navigate, search.q]);
	const onSearch = (q?: string | null) => setSearchTerm(q || "");
	return (
		<Layout onSearch={onSearch} searchValue={searchTerm}>
			<HackathonsTable hackathons={hackathons ?? []} />
			<DataPagination itemsPerPage={search.limit || 12} totalItems={count} page={search.page || 1} href="/admin/hackathons" onPageChange={(page) => navigate({ search: (old) => ({ ...old, page }) })} />
		</Layout>
	);
}

function Layout({ children, onSearch, searchValue }: { children: React.ReactNode; onSearch?: (v?: string | null) => void; searchValue?: string }) {
	return (
		<AdminLayout breadcrumbs={[{ href: "/dashboard", title: "Tableau de bord" }, { href: "", title: "Hackathons" }]}>
			<div className="w-full">
				<div className="mb-4 flex w-full flex-col gap-6 md:gap-4 md:flex-row md:items-center md:justify-between">
					<div>
						<h1 className="backoffice-title mb-2">Hackathons</h1>
						<p className="backoffice-description">Gérez vos hackathons</p>
					</div>
					<div className="flex w-full items-center gap-4 md:w-auto">
						{onSearch && <SearchInput clearable placeholder="Rechercher" value={searchValue || ""} onChange={(e) => onSearch(e.target.value ?? "")} />}
						<ButtonLink size="sm" href="/admin/hackathons/new"><Plus size={15} /><span className="sr-only">Nouveau</span></ButtonLink>
					</div>
				</div>
				<section>{children}</section>
			</div>
		</AdminLayout>
	);
}