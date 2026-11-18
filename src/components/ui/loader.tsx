import { cn } from "@/lib/utils";

interface LoaderProps {
  label?: string;
  fullScreen?: boolean;
  size?: number;
  className?: string;
}

export function Loader({
  label = "Chargement...",
  fullScreen = true,
  size = 60,
  className,
}: LoaderProps) {
  return (
    <div
      aria-live="polite"
      className={cn(
        "flex w-full flex-col items-center justify-center gap-4",
        fullScreen ? "h-screen" : "py-12",
        className,
      )}
    >
      <span
        className="block animate-spin rounded-full border-4 border-muted border-t-primary"
        style={{ width: size, height: size }}
      />
      {label ? (
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
      ) : null}
      <span className="sr-only">Chargement en cours</span>
    </div>
  );
}
