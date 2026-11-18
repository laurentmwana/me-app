import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/admin/profiles/$id/edit")({
  component: Page,
});

function Page() {
  return <div>Hello "/_protected/admin/profile/$id/edit"!</div>;
}
