import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Pen, Trash } from "lucide-react";
import { toast } from "sonner";
import { deleteEducation } from "#/actions/education.action";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { ButtonLink } from "#/components/ui/button-link";
import { DeleteResourceDialog } from "#/components/ui/confirmation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "#/components/ui/table";
import type { Education } from "#/generated/prisma/client";
import { ago } from "#/lib/format-date";
import { excerpt } from "#/lib/string";
import { DefaultDataEmpty } from "#/shared/data-empty";

type Props = { educations: (Education & { grades?: any[] })[] };

export const EducationsTable = ({ educations }: Props) => {
	const navigate = useNavigate();
	const deleteMutation = useMutation({
		mutationFn: async (id: string) => deleteEducation({ data: { id } }),
		onSuccess: async () => {
			toast.success("Formation supprimée");
			await navigate({ to: "/admin/educations" });
		},
		onError: (error) => toast.error(error.message || "Erreur"),
	});
	if (!Array.isArray(educations) || educations.length === 0) {
		return (
			<DefaultDataEmpty>
				<ButtonLink variant="outline" href="/admin/educations/new">
					Nouvelle formation
				</ButtonLink>
			</DefaultDataEmpty>
		);
	}
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>École</TableHead>
					<TableHead>Diplôme</TableHead>
					<TableHead>Statut</TableHead>
					<TableHead>Date</TableHead>
					<TableHead>Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{educations.map((edu) => (
					<TableRow key={edu.id}>
						<TableCell>{excerpt(edu.school, 80)}</TableCell>
						<TableCell>{excerpt(edu.degree, 80)}</TableCell>
						<TableCell>
							<Badge variant={edu.isPublished ? "success" : "destructive"}>{edu.isPublished ? "Publiée" : "Brouillon"}</Badge>
						</TableCell>
						<TableCell>{ago(edu.createdAt)}</TableCell>
						<TableCell>
							<div className="flex items-center gap-2">
								<ButtonLink variant="outline" size="icon-sm" href={`/admin/educations/${edu.id}/edit`}>
									<Pen size={15} />
								</ButtonLink>
								<DeleteResourceDialog
									resourceName={edu.school}
									onConfirm={() => deleteMutation.mutate(edu.id)}
									confirmationValue={edu.school}
									description="Supprimer ?"
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