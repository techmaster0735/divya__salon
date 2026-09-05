import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Media } from "@/lib/media";
import { type Offer } from "@/lib/salon";
import { cn } from "@/lib/utils";

/** Auto-playing portrait slideshow of offer images — images only, no text. */
export function OfferCarousel({
  offers,
  interval = 4000,
  className,
}: {
  offers: Offer[];
  interval?: number;
  className?: string;
}) {
  const slides = offers.filter((offer) => Boolean(offer.image_path));
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), interval);
    return () => clearInterval(id);
  }, [paused, slides.length, interval]);

  useEffect(() => {
    if (index >= slides.length) setIndex(0);
  }, [slides.length, index]);

  if (slides.length === 0) return null;

  const go = (delta: number) => setIndex((i) => (i + delta + slides.length) % slides.length);

  return (
    <div
      className={cn("relative mx-auto w-full max-w-md", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Current offers"
    >
      <div
        className="relative aspect-3/4 overflow-hidden rounded-2xl"
        style={{ boxShadow: "var(--shadow-luxe)" }}
      >
        {slides.map((offer, i) => (
          <div
            key={offer.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-700",
              i === index ? "opacity-100" : "pointer-events-none opacity-0",
            )}
            aria-hidden={i === index ? undefined : true}
          >
            <Media
              path={offer.image_path}
              alt={offer.title}
              eager={i === 0}
              width={700}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>

      {slides.length > 1 ? (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous offer"
            className="bg-background/70 hover:bg-background absolute top-1/2 left-2 grid size-9 -translate-y-1/2 place-items-center rounded-full backdrop-blur"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next offer"
            className="bg-background/70 hover:bg-background absolute top-1/2 right-2 grid size-9 -translate-y-1/2 place-items-center rounded-full backdrop-blur"
          >
            <ChevronRight className="size-4" />
          </button>
          <div className="mt-4 flex justify-center gap-2">
            {slides.map((offer, i) => (
              <button
                key={offer.id}
                type="button"
                aria-label={`Go to offer ${i + 1}`}
                onClick={() => setIndex(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === index ? "bg-primary w-6" : "bg-muted-foreground/40 w-2",
                )}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
