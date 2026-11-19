import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { findPaginatedCVs } from "#/actions/cv.action";
import { ButtonLink } from "#/components/ui/button-link";
import { DataPagination } from "#/components/ui/data-pagination";
import { SearchInput } from "#/components/ui/search-input";
import { CVsTable } from "#/features/cv/cvs-table";
import { AdminLayout } from "#/layouts/admin-layout";
import { offsetPagination } from "#/lib/number";
import { paginationQuerySchema } from "#/schemas/default.schema";
import { TableSkeleton } from "#/shared/table-skeleton";

export const Route = createFileRoute("/_protected/admin/cvs/")({
	component: Page,
	pendingComponent: () => (<Layout><TableSkeleton columns={5} showHeader={true} /></Layout>),
	validateSearch: paginationQuerySchema,
	loaderDeps: ({ search }) => search,
	loader: async ({ deps }) => {
		const limit = deps.limit ?? 12;
		const page = deps.page ?? 1;
		const offset = offsetPagination(page, limit);
		return await findPaginatedCVs({ data: { limit, page, offset, direction: "desc", orderBy: "createdAt", search: deps.q } });
	},
});

function Page() {
	const search = Route.useSearch();
	const navigate = Route.useNavigate();
	const { count, items: cvs } = Route.useLoaderData();
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
			<CVsTable cvs={cvs ?? []} />
			<DataPagination itemsPerPage={search.limit || 12} totalItems={count} page={search.page || 1} href="/admin/cvs" onPageChange={(page) => navigate({ search: (old) => ({ ...old, page }) })} />
		</Layout>
	);
}

function Layout({ children, onSearch, searchValue }: { children: React.ReactNode; onSearch?: (v?: string | null) => void; searchValue?: string }) {
	return (
		<AdminLayout breadcrumbs={[{ href: "/dashboard", title: "Tableau de bord" }, { href: "", title: "CVs" }]}>
			<div className="w-full">
				<div className="mb-4 flex w-full flex-col gap-6 md:gap-4 md:flex-row md:items-center md:justify-between">
					<div>
						<h1 className="backoffice-title mb-2">CVs</h1>
						<p className="backoffice-description">Gérez vos CVs</p>
					</div>
					<div className="flex w-full items-center gap-4 md:w-auto">
						{onSearch && <SearchInput clearable placeholder="Rechercher" value={searchValue || ""} onChange={(e) => onSearch(e.target.value ?? "")} />}
						<ButtonLink size="sm" href="/admin/cvs/new"><Plus size={15} /><span className="sr-only">Nouveau</span></ButtonLink>
					</div>
				</div>
				<section>{children}</section>
			</div>
		</AdminLayout>
	);
}