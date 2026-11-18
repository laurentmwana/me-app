import { AdminLayout } from "#/layouts/admin-layout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/admin/profiles/$id/")({
  component: Page,
});

function Page() {
  return (
    <AdminLayout>
      <div>Hello "/_protected/admin/profile/$id/"!</div>
    </AdminLayout>
  );
}
