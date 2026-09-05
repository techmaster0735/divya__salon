import { useReveal } from "@/hooks/useReveal";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  from?: "up" | "left" | "right";
  as?: "div" | "section" | "li" | "figure" | "article";
};

/** Wraps content in a scroll-triggered entrance animation. */
export function Reveal({ children, className, delay = 0, from = "up", as = "div" }: RevealProps) {
  const ref = useReveal<HTMLDivElement>(delay);
  const Tag = as as "div";
  const anim = from === "left" ? "reveal-left" : from === "right" ? "reveal-right" : "reveal";

  return (
    <Tag ref={ref} className={cn(anim, className)}>
      {children}
    </Tag>
  );
}
