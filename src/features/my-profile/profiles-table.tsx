import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Pen, Trash } from "lucide-react";
import { toast } from "sonner";
import { deleteProfileFn } from "#/actions/my-profile.action";
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
import type { Profile } from "#/generated/prisma/client";
import { ago } from "#/lib/format-date";
import { excerpt } from "#/lib/string";
import { DefaultDataEmpty } from "#/shared/data-empty";

type ProfilesTableProps = {
  profiles: Profile[];
};

export const ProfilesTable = ({ profiles }: ProfilesTableProps) => {
  	const navigate = useNavigate();

	const deleteMutation = useMutation({
    mutationFn: async (profileId: string) => {
      return await deleteProfileFn({
        data: { id: profileId },
      });
    },
    onSuccess: async () => {
      		toast.success("Votre profil a été supprimé");

      await navigate({ to: "/admin/profiles" });
    },
    onError: (error) => {
      toast.error(
        error.message || "Une erreur est survenue lors de la suppression.",
      );
    },
  });

  if (!Array.isArray(profiles) || profiles.length === 0) {
    return (
      <DefaultDataEmpty>
        		<div className="flex items-center gap-3">
			<ButtonLink variant="outline" href="/admin/profiles/new">
				Nouveau Profil
			</ButtonLink>
		</div>
      </DefaultDataEmpty>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead> Titre </TableHead>
          <TableHead> Description </TableHead>
          <TableHead> Statut </TableHead>
          <TableHead> Date de publication </TableHead>
          <TableHead> Actions </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {profiles.map((profile) => {
          return (
            <TableRow key={profile.id}>
              <TableCell>{excerpt(profile.title, 80)}</TableCell>
              <TableCell>{excerpt(profile.description, 80)}</TableCell>
              <TableCell>
                <Badge
                  variant={profile.isPublished ? "success" : "destructive"}
                >
                  {profile.isPublished ? "Publié" : "Brouillon"}
                </Badge>
              </TableCell>
              <TableCell>{ago(profile.createdAt)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <ButtonLink
                    variant="outline"
                    size="icon-sm"
                    href={`/admin/profiles/${profile.id}/edit`}
                  >
                    <Pen size={15} />
                  </ButtonLink>
                  <DeleteResourceDialog
                    resourceName={profile.title}
                    onConfirm={() => deleteMutation.mutate(profile.id)}
                    confirmationValue={profile.title}
                    description="Êtes-vous sûr de vouloir supprimer ce profil ? Cette action est irréversible."
                    trigger={
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8"
                        disabled={
                          											deleteMutation.isPending

                        }
                      >
                        <Trash className="size-4" />
                      </Button>
                    }
                  />
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
