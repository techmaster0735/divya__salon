import { Link } from "@tanstack/react-router";
import { Clock } from "lucide-react";
import { Media } from "@/lib/media";
import { type Service } from "@/lib/salon";
import { Button } from "@/components/ui/button";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="card-luxe animate-fade-up group flex flex-col overflow-hidden rounded-xl">
      <div className="relative aspect-4/3 overflow-hidden">
        <Media
          path={service.image_path}
          alt={service.name}
          width={560}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {service.badge ? (
          <span className="bg-primary text-primary-foreground absolute top-3 left-3 rounded-full px-3 py-1 text-[0.6rem] font-semibold tracking-[0.2em] uppercase">
            {service.badge}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xl leading-snug">{service.name}</h3>
          <span className="text-muted-foreground flex shrink-0 items-center gap-1 text-xs">
            <Clock className="size-3.5" aria-hidden="true" />
            {service.duration_minutes}m
          </span>
        </div>

        {service.description ? (
          <p className="text-muted-foreground text-sm">{service.description}</p>
        ) : null}

        <div className="mt-auto flex items-end justify-end gap-3 pt-2">
          <Button asChild size="sm" variant="secondary">
            <Link to="/book" search={{ service: service.id }}>
              Book
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
