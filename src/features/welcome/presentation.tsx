import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar";
import { BlurFade } from "#/components/ui/blur-fade";
import { buttonVariants } from "#/components/ui/button";
import { Download } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { findActivePublishedCVFn } from "#/actions/cv.action";
import { DATA } from "#/config/resume";

const BLUR_FADE_DELAY = 0.1;

export const Presentation = () => {
	const { data: cv } = useQuery({
		queryKey: ["welcome_cv"],
		queryFn: async () => await findActivePublishedCVFn(),
	});

	return (
		<section className="pt-16">
			<div className="flex flex-col-reverse items-center gap-8 md:flex-row md:items-center md:justify-between md:gap-12">
				<div className="flex flex-col items-center gap-4 text-center md:items-start md:text-left flex-1 min-w-0">
					<h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl bg-linear-to-r from-foreground via-foreground/90 to-primary bg-clip-text text-transparent">
						{`Bonjour, je suis ${DATA.name.split(" ")[0]}`}
					</h2>
					<p className="text-muted-foreground text-base sm:text-lg lg:text-xl font-light leading-relaxed">
						{DATA.summary}
					</p>
					{cv?.pdfUrl && (
						<a
							href={cv.pdfUrl}
							target="_blank"
							rel="noopener noreferrer"
							className={buttonVariants({ variant: "outline", size: "sm" })}
						>
							<Download size={16} />
							<span>Télécharger le CV</span>
						</a>
					)}
				</div>
				<BlurFade delay={BLUR_FADE_DELAY} className="shrink-0">
					<Avatar className="size-28 rounded-full border border-border/50 shadow-xl ring-4 ring-primary/10 hover:ring-primary/25 hover:scale-105 transition-all duration-500 cursor-pointer md:size-36 bg-background">
						<AvatarImage
							alt={DATA.name}
							src={DATA.avatarUrl}
							className="object-cover"
						/>
						<AvatarFallback className="font-bold text-lg">
							{DATA.initials}
						</AvatarFallback>
					</Avatar>
				</BlurFade>
			</div>
		</section>
	);
};
