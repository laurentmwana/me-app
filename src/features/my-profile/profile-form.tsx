import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { Alert, AlertDescription } from "#/components/ui/alert";
import { ButtonLoader } from "#/components/ui/button-loader";
import { Field, FieldError, FieldGroup, FieldLabel } from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { Switch } from "#/components/ui/switch";
import { Textarea } from "#/components/ui/textarea";
import type { Profile } from "#/generated/prisma/client";
import { type MyProfileValues, profileSchema } from "#/schemas/my-profile.schema";

type Props = { onSubmit: (v: MyProfileValues) => void; isPending?: boolean; error?: string | null; profile?: Profile };

export const ProfileForm: React.FC<Props> = ({ onSubmit, isPending = false, error: externalError, profile }) => {
	const [formError, setFormError] = useState<string | null>(null);
	const displayError = externalError || formError;
	const form = useForm({
		defaultValues: {
			title: profile?.title ?? "",
			description: profile?.description ?? "",
			content: profile?.content ?? "",
			imageUrl: profile?.imageUrl ?? "",
			pdfUrl: profile?.pdfUrl ?? "",
			isPublished: profile?.isPublished ?? false,
		},
		validators: { onSubmit: profileSchema },
		onSubmit: ({ value }) => {
			setFormError(null);
			try {
				onSubmit({ title: value.title, description: value.description, content: value.content, imageUrl: value.imageUrl, pdfUrl: value.pdfUrl, isPublished: value.isPublished });
			} catch (e) {
				setFormError(e instanceof Error ? e.message : "Erreur");
			}
		},
	});
	return (
		<div>
			<form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); void form.handleSubmit(); }} noValidate>
				<FieldGroup className="gap-6">
					<form.Field name="title">
						{(field) => {
							const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
							return (
								<Field data-invalid={isInvalid} className="gap-1.5">
									<FieldLabel htmlFor={field.name}>Titre</FieldLabel>
									<Input id={field.name} name={field.name} type="text" aria-invalid={isInvalid} value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} disabled={isPending} />
									{isInvalid && <FieldError errors={field.state.meta.errors.slice(0, 1)} className="text-xs mt-1" />}
								</Field>
							);
						}}
					</form.Field>
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
					<form.Field name="content">
						{(field) => {
							const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
							return (
								<Field data-invalid={isInvalid} className="gap-1.5">
									<FieldLabel htmlFor={field.name}>Contenu</FieldLabel>
									<Textarea id={field.name} name={field.name} aria-invalid={isInvalid} value={field.state.value ?? ""} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} disabled={isPending} />
									{isInvalid && <FieldError errors={field.state.meta.errors.slice(0, 1)} className="text-xs mt-1" />}
								</Field>
							);
						}}
					</form.Field>
					{(["imageUrl", "pdfUrl"] as const).map((name) => (
						<form.Field key={name} name={name}>
							{(field) => {
								const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid} className="gap-1.5">
										<FieldLabel htmlFor={field.name}>{name === "imageUrl" ? "Image URL" : "PDF URL"}</FieldLabel>
										<Input id={field.name} name={field.name} type="text" aria-invalid={isInvalid} value={field.state.value ?? ""} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} disabled={isPending} />
										{isInvalid && <FieldError errors={field.state.meta.errors.slice(0, 1)} className="text-xs mt-1" />}
									</Field>
								);
							}}
						</form.Field>
					))}
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
										{isSubmitting || isPending ? (profile ? "Modification en cours..." : "Enregistrement...") : profile ? "Modifier" : "Enregistrer"}
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