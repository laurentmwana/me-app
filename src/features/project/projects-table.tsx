import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Pen, Trash } from "lucide-react";
import { toast } from "sonner";
import { deleteProject } from "#/actions/project.action";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { ButtonLink } from "#/components/ui/button-link";
import { DeleteResourceDialog } from "#/components/ui/confirmation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "#/components/ui/table";
import type { Project } from "#/generated/prisma/client";
import { ago } from "#/lib/format-date";
import { excerpt } from "#/lib/string";
import { DefaultDataEmpty } from "#/shared/data-empty";

type Props = { projects: Project[] };

export const ProjectsTable = ({ projects }: Props) => {
	const navigate = useNavigate();
	const deleteMutation = useMutation({
		mutationFn: async (id: string) => deleteProject({ data: { id } }),
		onSuccess: async () => { toast.success("Projet supprimé"); await navigate({ to: "/admin/projects" }); },
		onError: (error) => toast.error(error.message || "Erreur"),
	});
	if (!Array.isArray(projects) || projects.length === 0) {
		return (<DefaultDataEmpty><ButtonLink variant="outline" href="/admin/projects/new">Nouveau projet</ButtonLink></DefaultDataEmpty>);
	}
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Titre</TableHead>
					<TableHead>Technologies</TableHead>
					<TableHead>Statut</TableHead>
					<TableHead>Date</TableHead>
					<TableHead>Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{projects.map((p) => (
					<TableRow key={p.id}>
						<TableCell>{excerpt(p.title, 80)}</TableCell>
						<TableCell>{excerpt(p.technologies?.join(", ") ?? "", 80)}</TableCell>
						<TableCell><Badge variant={p.isPublished ? "success" : "destructive"}>{p.isPublished ? "Publié" : "Brouillon"}</Badge></TableCell>
						<TableCell>{ago(p.createdAt)}</TableCell>
						<TableCell>
							<div className="flex items-center gap-2">
								<ButtonLink variant="outline" size="icon-sm" href={`/admin/projects/${p.id}/edit`}><Pen size={15} /></ButtonLink>
								<DeleteResourceDialog resourceName={p.title} onConfirm={() => deleteMutation.mutate(p.id)} confirmationValue={p.title} description="Supprimer ?" trigger={<Button variant="destructive" size="icon" className="h-8 w-8" disabled={deleteMutation.isPending}><Trash className="size-4" /></Button>} />
							</div>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};