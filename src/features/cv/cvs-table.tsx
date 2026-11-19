import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Pen, Trash } from "lucide-react";
import { toast } from "sonner";
import { deleteCV } from "#/actions/cv.action";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { ButtonLink } from "#/components/ui/button-link";
import { DeleteResourceDialog } from "#/components/ui/confirmation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "#/components/ui/table";
import type { CV } from "#/generated/prisma/client";
import { ago } from "#/lib/format-date";
import { excerpt } from "#/lib/string";
import { DefaultDataEmpty } from "#/shared/data-empty";

type Props = { cvs: CV[] };

export const CVsTable = ({ cvs }: Props) => {
	const navigate = useNavigate();
	const deleteMutation = useMutation({
		mutationFn: async (id: string) => deleteCV({ data: { id } }),
		onSuccess: async () => { toast.success("CV supprimé"); await navigate({ to: "/admin/cvs" }); },
		onError: (error) => toast.error(error.message || "Erreur"),
	});
	if (!Array.isArray(cvs) || cvs.length === 0) {
		return (<DefaultDataEmpty><ButtonLink variant="outline" href="/admin/cvs/new">Nouveau CV</ButtonLink></DefaultDataEmpty>);
	}
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Titre</TableHead>
					<TableHead>Langue</TableHead>
					<TableHead>Statut</TableHead>
					<TableHead>Date</TableHead>
					<TableHead>Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{cvs.map((cv) => (
					<TableRow key={cv.id}>
						<TableCell>{excerpt(cv.title, 80)}</TableCell>
						<TableCell>{cv.language}</TableCell>
						<TableCell><Badge variant={cv.isPublished ? "success" : "destructive"}>{cv.isPublished ? "Publié" : "Brouillon"}</Badge></TableCell>
						<TableCell>{ago(cv.createdAt)}</TableCell>
						<TableCell>
							<div className="flex items-center gap-2">
								<ButtonLink variant="outline" size="icon-sm" href={`/admin/cvs/${cv.id}/edit`}><Pen size={15} /></ButtonLink>
								<DeleteResourceDialog resourceName={cv.title} onConfirm={() => deleteMutation.mutate(cv.id)} confirmationValue={cv.title} description="Supprimer ?" trigger={<Button variant="destructive" size="icon" className="h-8 w-8" disabled={deleteMutation.isPending}><Trash className="size-4" /></Button>} />
							</div>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};