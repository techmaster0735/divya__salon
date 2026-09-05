import { cn } from "@/lib/utils";

export function SectionTitle({
  eyebrow,
  title,
  subtitle,
  className,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string | null;
  className?: string;
  align?: "center" | "left";
}) {
  return (
    <div
      className={cn(
        "animate-fade-up max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p className="text-primary text-[0.65rem] tracking-[0.4em] uppercase">{eyebrow}</p>
      ) : null}
      <h2 className="mt-4 text-3xl leading-tight sm:text-4xl md:text-5xl">{title}</h2>
      {subtitle ? (
        <p className="text-muted-foreground mt-4 text-sm sm:text-base">{subtitle}</p>
      ) : null}
      <div className={cn("hairline mt-6 max-w-40", align === "center" && "mx-auto")} />
    </div>
  );
}
