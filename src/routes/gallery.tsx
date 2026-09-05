import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { galleryQuery } from "@/lib/salon";
import { Media } from "@/lib/media";
import { SectionTitle } from "@/components/site/SectionTitle";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Style Gallery — Divya Saroon" },
      {
        name: "description",
        content:
          "Browse trending hairstyles, classic and modern cuts, beard styles, hair colour and bridal looks created at Divya Luxe Salon.",
      },
      { property: "og:title", content: "Style Gallery — Divya Saroon" },
      {
        property: "og:description",
        content: "Trending cuts, beard styles, colour work and bridal looks from our studio.",
      },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const { data: items = [], isLoading } = useQuery(galleryQuery);
  const [active, setActive] = useState<string>("All");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(items.map((i) => i.category)))],
    [items],
  );
  const visible = active === "All" ? items : items.filter((i) => i.category === active);

  return (
    <div className="mx-auto max-w-7xl px-4 pt-28 pb-10 sm:px-6">
      <SectionTitle
        eyebrow="Our work"
        title="Style Gallery"
        subtitle="Every look here was created in our chairs. Save one and bring it in."
      />

      <div className="mt-10 flex flex-wrap justify-center gap-2">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActive(category)}
            className={cn(
              "border-border rounded-full border px-4 py-2 text-xs tracking-[0.2em] uppercase transition-colors",
              active === category
                ? "bg-primary text-primary-foreground border-primary"
                : "hover:border-primary/60",
            )}
          >
            {category}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="text-muted-foreground mt-12 text-center text-sm">Loading gallery…</p>
      ) : visible.length === 0 ? (
        <p className="text-muted-foreground mt-12 text-center text-sm">
          New photos are on the way.
        </p>
      ) : (
        <div className="mt-12 columns-2 gap-4 md:columns-3 [&>figure]:mb-4">
          {visible.map((item) => (
            <figure
              key={item.id}
              className="animate-fade-up group relative break-inside-avoid overflow-hidden rounded-xl"
            >
              <Media
                path={item.image_path}
                alt={item.title}
                width={620}
                className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <figcaption className="from-background/95 absolute inset-x-0 bottom-0 bg-gradient-to-t to-transparent p-4">
                <p className="text-primary text-[0.6rem] tracking-[0.3em] uppercase">
                  {item.category}
                </p>
                <p className="font-display mt-1 text-lg">{item.title}</p>
                {item.description ? (
                  <p className="text-muted-foreground mt-1 hidden text-xs sm:block">
                    {item.description}
                  </p>
                ) : null}
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}
