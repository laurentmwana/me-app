import { useState } from "react";
import { ButtonLink } from "#/components/ui/button-link";
import type { Education, Grade } from "#/generated/prisma/client";
import { formatDateRange } from "#/lib/format-date";
import { Badge } from "@/components/ui/badge";

type EducationCardProps = {
	education: Education & { grades: Grade[] };
};

const initials = (value: string) =>
	value
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((word) => word[0]?.toUpperCase())
		.join("");

export const EducationCard = ({ education }: EducationCardProps) => {
	const [logoFailed, setLogoFailed] = useState(false);
	const showLogo = Boolean(education.logoUrl) && !logoFailed;

	return (
		<div className="group flex gap-4 border border-border bg-card text-card-foreground ring-2 ring-border/10 rounded-xl p-4 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-primary/40 transition-all duration-300 ease-out">
			{showLogo ? (
				<img
					src={education.logoUrl ?? ""}
					alt={education.school}
					onError={() => setLogoFailed(true)}
					className="size-11 shrink-0 rounded-lg border border-border object-contain bg-white p-1.5 transition-transform duration-300 group-hover:scale-105"
				/>
			) : (
				<div className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-border bg-muted text-xs font-semibold text-muted-foreground transition-colors duration-300 group-hover:bg-muted/80">
					{initials(education.school)}
				</div>
			)}

			<div className="flex flex-col gap-1 min-w-0 flex-1">
				<div className="flex items-center justify-between gap-2">
					<h4 className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors duration-300">
						{education.school}
					</h4>
					<span className="text-xs text-muted-foreground shrink-0">
						{formatDateRange(education.start, education.end)}
					</span>
				</div>
				<span className="text-xs text-muted-foreground">
					{education.degree}
				</span>

				{education.grades.length > 0 && (
					<div className="flex flex-wrap gap-1.5 mt-1">
						{education.grades.map((grade) => (
							<Badge
								key={grade.id}
								variant="secondary"
								className="hover:bg-secondary/80 transition-colors"
							>
								{grade.name}
							</Badge>
						))}
					</div>
				)}

				<div className="mt-5">
					<ButtonLink
						href={`/educations/${education.id}`}
						variant="outline"
						size="sm"
					>
						Voir plus
					</ButtonLink>
				</div>
			</div>
		</div>
	);
};
