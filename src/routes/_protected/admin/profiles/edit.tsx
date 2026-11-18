import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/admin/profiles/edit")({
  component: Page,
});

function Page() {
  return <div>Hello "/_protected/admin/profile/edit"!</div>;
}
