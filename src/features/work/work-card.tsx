import { useState } from "react";
import { ButtonLink } from "#/components/ui/button-link";
import type { Work } from "#/generated/prisma/client";
import { formatDateRange } from "#/lib/format-date";
import { excerpt } from "#/lib/string";

type WorkCardProps = { work: Work };

const initials = (value: string) =>
	value
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((word) => word[0]?.toUpperCase())
		.join("");

export const WorkCard = ({ work }: WorkCardProps) => {
	const [logoFailed, setLogoFailed] = useState(false);
	const showLogo = Boolean(work.logoUrl) && !logoFailed;

	return (
		<div className="group flex gap-4 border border-border bg-card text-card-foreground ring-2 ring-border/10 rounded-xl p-4 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-primary/40 transition-all duration-300 ease-out">
			{showLogo ? (
				<img
					src={work.logoUrl ?? ""}
					alt={work.company}
					onError={() => setLogoFailed(true)}
					className="size-11 shrink-0 rounded-lg border border-border object-contain bg-white p-1.5 transition-transform duration-300 group-hover:scale-105"
				/>
			) : (
				<div className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-border bg-muted text-xs font-semibold text-muted-foreground transition-colors duration-300 group-hover:bg-muted/80">
					{initials(work.company)}
				</div>
			)}

			<div className="flex flex-col gap-1 min-w-0 flex-1">
				<div className="flex items-center justify-between gap-2">
					<h4 className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors duration-300">
						{work.title}
					</h4>
					<span className="text-xs text-muted-foreground shrink-0">
						{formatDateRange(work.start, work.end)}
					</span>
				</div>
				<div className="flex items-center gap-2 text-xs text-muted-foreground">
					<span className="font-medium text-foreground">{work.company}</span>
					{work.location && <span>· {work.location}</span>}
				</div>
				{work.description && (
					<p className="text-sm text-muted-foreground mt-1">
						{excerpt(work.description, 160)}
					</p>
				)}

				<div className="mt-5">
					<ButtonLink href={`/works/${work.id}`} variant="outline" size="sm">
						Voir plus
					</ButtonLink>
				</div>
			</div>
		</div>
	);
};
