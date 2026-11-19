import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { Alert, AlertDescription } from "#/components/ui/alert";
import { ButtonLoader } from "#/components/ui/button-loader";
import { Field, FieldError, FieldGroup, FieldLabel } from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { Switch } from "#/components/ui/switch";
import { Textarea } from "#/components/ui/textarea";
import type { Education } from "#/generated/prisma/client";
import { type EducationValues, educationSchema } from "#/schemas/education.schema";

type Props = { onSubmit: (v: EducationValues) => void; isPending?: boolean; error?: string | null; education?: Education };

export const EducationForm: React.FC<Props> = ({ onSubmit, isPending = false, error: externalError, education }) => {
	const [formError, setFormError] = useState<string | null>(null);
	const displayError = externalError || formError;
	const form = useForm({
		defaultValues: {
			school: education?.school ?? "",
			degree: education?.degree ?? "",
			description: education?.description ?? "",
			href: education?.href ?? "",
			logoUrl: education?.logoUrl ?? "",
			start: education?.start ? new Date(education.start).toISOString().slice(0, 10) : "",
			end: education?.end ? new Date(education.end).toISOString().slice(0, 10) : "",
			isPublished: education?.isPublished ?? false,
		},
		validators: { onSubmit: educationSchema },
		onSubmit: ({ value }) => {
			setFormError(null);
			try {
				onSubmit({ school: value.school, degree: value.degree, description: value.description, href: value.href, logoUrl: value.logoUrl, start: value.start, end: value.end, isPublished: value.isPublished });
			} catch (e) {
				setFormError(e instanceof Error ? e.message : "Erreur");
			}
		},
	});
	return (
		<div>
			<form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); void form.handleSubmit(); }} noValidate>
				<FieldGroup className="gap-6">
					{(["school", "degree"] as const).map((name) => (
						<form.Field key={name} name={name}>
							{(field) => {
								const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid} className="gap-1.5">
										<FieldLabel htmlFor={field.name}>{name === "school" ? "École" : "Diplôme"}</FieldLabel>
										<Input id={field.name} name={field.name} type="text" aria-invalid={isInvalid} value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} disabled={isPending} />
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
					{(["href", "logoUrl"] as const).map((name) => (
						<form.Field key={name} name={name}>
							{(field) => {
								const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid} className="gap-1.5">
										<FieldLabel htmlFor={field.name}>{name === "href" ? "Lien" : "Logo URL"}</FieldLabel>
										<Input id={field.name} name={field.name} type="text" aria-invalid={isInvalid} value={field.state.value ?? ""} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} disabled={isPending} />
										{isInvalid && <FieldError errors={field.state.meta.errors.slice(0, 1)} className="text-xs mt-1" />}
									</Field>
								);
							}}
						</form.Field>
					))}
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
										{isSubmitting || isPending ? (education ? "Modification en cours..." : "Enregistrement...") : education ? "Modifier" : "Enregistrer"}
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