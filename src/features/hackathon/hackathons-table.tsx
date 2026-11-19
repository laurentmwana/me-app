import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Pen, Trash } from "lucide-react";
import { toast } from "sonner";
import { deleteHackathon } from "#/actions/hackthon.action";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { ButtonLink } from "#/components/ui/button-link";
import { DeleteResourceDialog } from "#/components/ui/confirmation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "#/components/ui/table";
import type { Hackathon } from "#/generated/prisma/client";
import { ago } from "#/lib/format-date";
import { excerpt } from "#/lib/string";
import { DefaultDataEmpty } from "#/shared/data-empty";

type Props = { hackathons: Hackathon[] };

export const HackathonsTable = ({ hackathons }: Props) => {
	const navigate = useNavigate();
	const deleteMutation = useMutation({
		mutationFn: async (id: string) => deleteHackathon({ data: { id } }),
		onSuccess: async () => { toast.success("Hackathon supprimé"); await navigate({ to: "/admin/hackathons" }); },
		onError: (error) => toast.error(error.message || "Erreur"),
	});
	if (!Array.isArray(hackathons) || hackathons.length === 0) {
		return (<DefaultDataEmpty><ButtonLink variant="outline" href="/admin/hackathons/new">Nouveau hackathon</ButtonLink></DefaultDataEmpty>);
	}
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Titre</TableHead>
					<TableHead>Lieu</TableHead>
					<TableHead>Statut</TableHead>
					<TableHead>Date</TableHead>
					<TableHead>Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{hackathons.map((h) => (
					<TableRow key={h.id}>
						<TableCell>{excerpt(h.title, 80)}</TableCell>
						<TableCell>{excerpt(h.location ?? "", 80)}</TableCell>
						<TableCell><Badge variant={h.isPublished ? "success" : "destructive"}>{h.isPublished ? "Publié" : "Brouillon"}</Badge></TableCell>
						<TableCell>{ago(h.createdAt)}</TableCell>
						<TableCell>
							<div className="flex items-center gap-2">
								<ButtonLink variant="outline" size="icon-sm" href={`/admin/hackathons/${h.id}/edit`}><Pen size={15} /></ButtonLink>
								<DeleteResourceDialog resourceName={h.title} onConfirm={() => deleteMutation.mutate(h.id)} confirmationValue={h.title} description="Supprimer ?" trigger={<Button variant="destructive" size="icon" className="h-8 w-8" disabled={deleteMutation.isPending}><Trash className="size-4" /></Button>} />
							</div>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};