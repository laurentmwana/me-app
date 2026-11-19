import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { Alert, AlertDescription } from "#/components/ui/alert";
import { ButtonLoader } from "#/components/ui/button-loader";
import { Field, FieldError, FieldGroup, FieldLabel } from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { Switch } from "#/components/ui/switch";
import { Textarea } from "#/components/ui/textarea";
import type { Project } from "#/generated/prisma/client";
import { type ProjectValues, projectSchema } from "#/schemas/project.schema";

type Props = { onSubmit: (v: ProjectValues) => void; isPending?: boolean; error?: string | null; project?: Project };

export const ProjectForm: React.FC<Props> = ({ onSubmit, isPending = false, error: externalError, project }) => {
	const [formError, setFormError] = useState<string | null>(null);
	const displayError = externalError || formError;
	const form = useForm({
		defaultValues: {
			title: project?.title ?? "",
			description: project?.description ?? "",
			href: project?.href ?? "",
			image: project?.image ?? "",
			video: project?.video ?? "",
			technologies: project?.technologies?.join(", ") ?? "",
			start: project?.start ? new Date(project.start).toISOString().slice(0, 10) : "",
			end: project?.end ? new Date(project.end).toISOString().slice(0, 10) : "",
			isPublished: project?.isPublished ?? false,
		},
		validators: { onSubmit: projectSchema },
		onSubmit: ({ value }) => {
			setFormError(null);
			try {
				onSubmit({ title: value.title, description: value.description, href: value.href, image: value.image, video: value.video, technologies: value.technologies, start: value.start, end: value.end, isPublished: value.isPublished });
			} catch (e) {
				setFormError(e instanceof Error ? e.message : "Erreur");
			}
		},
	});
	const simpleFields = [
		{ name: "title" as const, label: "Titre" },
		{ name: "href" as const, label: "Lien" },
		{ name: "image" as const, label: "Image URL" },
		{ name: "video" as const, label: "Vidéo URL" },
		{ name: "technologies" as const, label: "Technologies (séparées par ,)" },
	];
	return (
		<div>
			<form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); void form.handleSubmit(); }} noValidate>
				<FieldGroup className="gap-6">
					{simpleFields.map(({ name, label }) => (
						<form.Field key={name} name={name}>
							{(field) => {
								const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid} className="gap-1.5">
										<FieldLabel htmlFor={field.name}>{label}</FieldLabel>
										<Input id={field.name} name={field.name} type="text" aria-invalid={isInvalid} value={field.state.value ?? ""} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} disabled={isPending} />
										{isInvalid && <FieldError errors={field.state.meta.errors.slice(0, 1)} className="text-xs mt-1" />}
									</Field>
								);
							}}
						</form.Field>
					))}
					<form.Field name="description">
						{(field) => {
							const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
							return (
								<Field data-invalid={isInvalid} className="gap-1.5">
									<FieldLabel htmlFor={field.name}>Description</FieldLabel>
									<Textarea id={field.name} name={field.name} aria-invalid={isInvalid} value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} disabled={isPending} />
									{isInvalid && <FieldError errors={field.state.meta.errors.slice(0, 1)} className="text-xs mt-1" />}
								</Field>
							);
						}}
					</form.Field>
					<div className="grid grid-cols-2 gap-4">
						<form.Field name="start">
							{(field) => {
								const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid} className="gap-1.5">
										<FieldLabel htmlFor={field.name}>Début</FieldLabel>
										<Input id={field.name} name={field.name} type="date" aria-invalid={isInvalid} value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} disabled={isPending} />
										{isInvalid && <FieldError errors={field.state.meta.errors.slice(0, 1)} className="text-xs mt-1" />}
									</Field>
								);
							}}
						</form.Field>
						<form.Field name="end">
							{(field) => {
								const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid} className="gap-1.5">
										<FieldLabel htmlFor={field.name}>Fin (optionnel)</FieldLabel>
										<Input id={field.name} name={field.name} type="date" aria-invalid={isInvalid} value={field.state.value ?? ""} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} disabled={isPending} />
										{isInvalid && <FieldError errors={field.state.meta.errors.slice(0, 1)} className="text-xs mt-1" />}
									</Field>
								);
							}}
						</form.Field>
					</div>
					<form.Field name="isPublished">
						{(field) => (
							<Field>
								<div className="flex items-center gap-3">
									<Switch id={field.name} name={field.name} onBlur={field.handleBlur} checked={field.state.value} onCheckedChange={field.handleChange} disabled={isPending} />
									<FieldLabel htmlFor={field.name}>Publier</FieldLabel>
								</div>
							</Field>
						)}
					</form.Field>
					{displayError && (
						<Alert variant="destructive" className="py-2.5 rounded-lg text-xs bg-destructive/5 border-destructive">
							<AlertDescription>{displayError}</AlertDescription>
						</Alert>
					)}
					<Field className="pt-2">
						<form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
							{([canSubmit, isSubmitting]) => (
								<div>
									<ButtonLoader loader={isSubmitting || isPending} type="submit" disabled={!canSubmit || isPending}>
										{isSubmitting || isPending ? (project ? "Modification en cours..." : "Enregistrement...") : project ? "Modifier" : "Enregistrer"}
									</ButtonLoader>
								</div>
							)}
						</form.Subscribe>
					</Field>
				</FieldGroup>
			</form>
		</div>
	);
};