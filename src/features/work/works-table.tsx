import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Pen, Trash } from "lucide-react";
import { toast } from "sonner";
import { deleteWork } from "#/actions/work.action";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { ButtonLink } from "#/components/ui/button-link";
import { DeleteResourceDialog } from "#/components/ui/confirmation";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "#/components/ui/table";
import type { Work } from "#/generated/prisma/client";
import { ago } from "#/lib/format-date";
import { excerpt } from "#/lib/string";
import { DefaultDataEmpty } from "#/shared/data-empty";

type Props = { works: Work[] };

export const WorksTable = ({ works }: Props) => {
	const navigate = useNavigate();
	const deleteMutation = useMutation({
		mutationFn: async (id: string) => deleteWork({ data: { id } }),
		onSuccess: async () => {
			toast.success("Expérience supprimée");
			await navigate({ to: "/admin/works" });
		},
		onError: (error) => toast.error(error.message || "Erreur"),
	});

	if (!Array.isArray(works) || works.length === 0) {
		return (
			<DefaultDataEmpty>
				<ButtonLink variant="outline" href="/admin/works/new">
					Nouvelle expérience
				</ButtonLink>
			</DefaultDataEmpty>
		);
	}

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Titre</TableHead>
					<TableHead>Entreprise</TableHead>
					<TableHead>Statut</TableHead>
					<TableHead>Date</TableHead>
					<TableHead>Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{works.map((work) => (
					<TableRow key={work.id}>
						<TableCell>{excerpt(work.title, 80)}</TableCell>
						<TableCell>{excerpt(work.company, 80)}</TableCell>
						<TableCell>
							<Badge variant={work.isPublished ? "success" : "destructive"}>
								{work.isPublished ? "Publiée" : "Brouillon"}
							</Badge>
						</TableCell>
						<TableCell>{ago(work.createdAt)}</TableCell>
						<TableCell>
							<div className="flex items-center gap-2">
								<ButtonLink variant="outline" size="icon-sm" href={`/admin/works/${work.id}/edit`}>
									<Pen size={15} />
								</ButtonLink>
								<DeleteResourceDialog
									resourceName={work.title}
									onConfirm={() => deleteMutation.mutate(work.id)}
									confirmationValue={work.title}
									description="Supprimer cette expérience ?"
									trigger={
										<Button variant="destructive" size="icon" className="h-8 w-8" disabled={deleteMutation.isPending}>
											<Trash className="size-4" />
										</Button>
									}
								/>
							</div>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};