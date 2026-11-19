"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

interface DeleteResourceDialogProps {
	resourceName: string;
	confirmationValue?: string;
	confirmationLabel?: React.ReactNode;
	title?: React.ReactNode;
	description?: React.ReactNode;
	actionLabel?: string;
	onConfirm: () => void | Promise<void>;
	trigger?: React.ReactNode;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export function DeleteResourceDialog({
	resourceName,
	confirmationValue,
	confirmationLabel,
	title,
	description,
	actionLabel = "Supprimer",
	onConfirm,
	trigger,
	open: controlledOpen,
	onOpenChange: controlledOnOpenChange,
}: DeleteResourceDialogProps) {
	const expected = confirmationValue ?? resourceName;

	const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
	const isControlled = controlledOpen !== undefined;
	const open = isControlled ? controlledOpen : uncontrolledOpen;

	const [value, setValue] = React.useState("");
	const [isPending, setIsPending] = React.useState(false);

	const handleOpenChange = React.useCallback(
		(next: boolean) => {
			if (isPending) return;
			if (!next) setValue("");
			if (isControlled) {
				controlledOnOpenChange?.(next);
			} else {
				setUncontrolledOpen(next);
			}
		},
		[isControlled, controlledOnOpenChange, isPending],
	);

	const confirmed = value === expected;

	async function handleConfirm() {
		if (!confirmed || isPending) return;
		try {
			setIsPending(true);
			await onConfirm();
			handleOpenChange(false);
		} finally {
			setIsPending(false);
		}
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			{trigger ? (
				<DialogTrigger render={trigger as React.ReactElement} />
			) : null}
			<DialogContent showCloseButton={!isPending}>
				<DialogHeader>
					<DialogTitle>{title ?? `Supprimer ${resourceName}`}</DialogTitle>
					<DialogDescription>
						{description ?? (
														<>Cette action est irréversible. Elle supprimera définitivement{" "}
								<span className="font-medium text-foreground">
									{resourceName}
								</span>{" "}
								et toutes les données associées.
							</>
						)}
					</DialogDescription>
				</DialogHeader>

				<Field>
					<FieldLabel htmlFor="delete-confirmation">
						{confirmationLabel ?? (
														<>Pour confirmer, saisissez{" "}
								<span className="font-mono font-medium text-foreground">
									{expected}
								</span>{" "}
								ci-dessous
							</>
						)}
					</FieldLabel>
					<Input
						id="delete-confirmation"
						value={value}
						autoComplete="off"
						autoCapitalize="off"
						spellCheck={false}
						disabled={isPending}
						onChange={(e) => setValue(e.target.value)}
						onKeyDown={(e) => {
							if (
								e.key === "Enter" &&
								!e.nativeEvent.isComposing &&
								e.keyCode !== 229
							) {
								e.preventDefault();
								handleConfirm();
							}
						}}
					/>
				</Field>

				<DialogFooter>
					<DialogClose
						render={
							<Button variant="outline" disabled={isPending}>
								Annuler
							</Button>
						}
					/>
					<Button
						variant="destructive"
						disabled={!confirmed || isPending}
						onClick={handleConfirm}
					>
						{isPending ? (
							<>
								<Spinner data-icon="inline-start" />
								Suppression...
							</>
						) : (
							actionLabel
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
