import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { Alert, AlertDescription } from "#/components/ui/alert";
import { ButtonLoader } from "#/components/ui/button-loader";
import { Field, FieldError, FieldGroup, FieldLabel } from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { Switch } from "#/components/ui/switch";
import { Textarea } from "#/components/ui/textarea";
import type { CV } from "#/generated/prisma/client";
import { type CVValues, cvSchema } from "#/schemas/cv.schema";

type Props = { onSubmit: (v: CVValues) => void; isPending?: boolean; error?: string | null; cv?: CV };

export const CVForm: React.FC<Props> = ({ onSubmit, isPending = false, error: externalError, cv }) => {
	const [formError, setFormError] = useState<string | null>(null);
	const displayError = externalError || formError;
	const form = useForm({
		defaultValues: {
			title: cv?.title ?? "",
			language: cv?.language ?? "",
			description: cv?.description ?? "",
			pdfUrl: cv?.pdfUrl ?? "",
			isActive: cv?.isActive ?? false,
			isPublished: cv?.isPublished ?? false,
			version: cv?.version ?? "",
		},
		validators: { onSubmit: cvSchema },
		onSubmit: ({ value }) => {
			setFormError(null);
			try {
				onSubmit({ title: value.title, language: value.language, description: value.description, pdfUrl: value.pdfUrl, isActive: value.isActive, isPublished: value.isPublished, version: value.version });
			} catch (e) {
				setFormError(e instanceof Error ? e.message : "Erreur");
			}
		},
	});
	const simpleFields = [
		{ name: "title" as const, label: "Titre" },
		{ name: "language" as const, label: "Langue" },
		{ name: "pdfUrl" as const, label: "URL du PDF" },
		{ name: "version" as const, label: "Version" },
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
									<Textarea id={field.name} name={field.name} aria-invalid={isInvalid} value={field.state.value ?? ""} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} disabled={isPending} />
									{isInvalid && <FieldError errors={field.state.meta.errors.slice(0, 1)} className="text-xs mt-1" />}
								</Field>
							);
						}}
					</form.Field>
					{(["isActive", "isPublished"] as const).map((name) => (
						<form.Field key={name} name={name}>
							{(field) => (
								<Field>
									<div className="flex items-center gap-3">
										<Switch id={field.name} name={field.name} onBlur={field.handleBlur} checked={field.state.value} onCheckedChange={field.handleChange} disabled={isPending} />
										<FieldLabel htmlFor={field.name}>{name === "isActive" ? "Actif" : "Publié"}</FieldLabel>
									</div>
								</Field>
							)}
						</form.Field>
					))}
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
										{isSubmitting || isPending ? (cv ? "Modification en cours..." : "Enregistrement...") : cv ? "Modifier" : "Enregistrer"}
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