import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink, FileText, ImageIcon, X } from "lucide-react";

import { menuQuery, type MenuItem } from "@/lib/salon";
import { useMediaUrl } from "@/lib/media";
import { Button } from "@/components/ui/button";
import { SectionTitle } from "@/components/site/SectionTitle";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Menu & Price List — Divya Saroon" },
      {
        name: "description",
        content:
          "Browse the full salon menu: price list, hair colour shade card and seasonal packages — open each one in a full-screen viewer.",
      },
      { property: "og:title", content: "Menu & Price List — Divya Saroon" },
      {
        property: "og:description",
        content: "Price list, hair colour card and packages in one place.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MenuPage,
});

function MenuPage() {
  const { data: items = [], isLoading } = useQuery(menuQuery);
  const [open, setOpen] = useState<MenuItem | null>(null);

  return (
    <div className="mx-auto max-w-5xl px-4 pt-28 pb-16 sm:px-6">
      <SectionTitle
        eyebrow="Everything in one place"
        title="Our Menu"
        subtitle="Tap any card to open it full screen."
      />

      {isLoading ? (
        <p className="text-muted-foreground mt-12 text-center text-sm">Loading menu…</p>
      ) : items.length === 0 ? (
        <p className="text-muted-foreground mt-12 text-center text-sm">
          The menu is being updated. Please check back soon.
        </p>
      ) : (
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {items.map((item) => (
            <MenuCard key={item.id} item={item} onOpen={() => setOpen(item)} />
          ))}
        </div>
      )}

      {open ? <MenuViewer item={open} onClose={() => setOpen(null)} /> : null}
    </div>
  );
}

function MenuCard({ item, onOpen }: { item: MenuItem; onOpen: () => void }) {
  const Icon = item.kind === "image" ? ImageIcon : item.kind === "link" ? ExternalLink : FileText;

  function handleClick() {
    if (item.kind === "link" && item.link_url) {
      window.open(item.link_url, "_blank", "noopener,noreferrer");
      return;
    }
    onOpen();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="card-luxe group hover:border-primary/40 w-full rounded-xl p-6 text-left transition-colors"
    >
      <span className="text-primary flex items-center gap-3 text-[0.6rem] tracking-[0.35em] uppercase">
        <Icon className="size-4" aria-hidden="true" />
        {item.kind}
      </span>
      <h2 className="mt-3 text-2xl">{item.title}</h2>
      {item.description ? (
        <p className="text-muted-foreground mt-2 text-sm">{item.description}</p>
      ) : null}
      <span className="text-primary mt-5 inline-block text-xs tracking-[0.25em] uppercase">
        Open
      </span>
    </button>
  );
}

function MenuViewer({ item, onClose }: { item: MenuItem; onClose: () => void }) {
  const { data: url, isLoading, isError } = useMediaUrl(item.file_path);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  return (
    <div
      className="bg-background/95 fixed inset-0 z-100 flex flex-col backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
    >
      <div className="border-border/60 flex items-center justify-between gap-4 border-b px-4 py-3">
        <h2 className="truncate text-lg">{item.title}</h2>
        <div className="flex items-center gap-2">
          {url ? (
            <Button asChild variant="outline" size="sm">
              <a href={url} target="_blank" rel="noopener noreferrer">
                Open in new tab
              </a>
            </Button>
          ) : null}
          <Button variant="ghost" size="icon" aria-label="Close" onClick={onClose}>
            <X className="size-5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {item.kind === "text" ? (
          <div className="mx-auto max-w-3xl px-4 py-8">
            <p className="text-muted-foreground whitespace-pre-line">{item.body}</p>
          </div>
        ) : !item.file_path ? (
          <p className="text-muted-foreground p-8 text-center text-sm">
            Nothing uploaded for this item yet.
          </p>
        ) : isLoading ? (
          <p className="text-muted-foreground p-8 text-center text-sm">Loading…</p>
        ) : isError || !url ? (
          <p className="text-muted-foreground p-8 text-center text-sm">
            This file could not be opened.
          </p>
        ) : item.kind === "image" ? (
          <img src={url} alt={item.title} className="mx-auto max-h-full w-auto object-contain" />
        ) : (
          <>
            <iframe
              src={url}
              title={item.title}
              className="hidden h-full w-full sm:block"
              style={{ minHeight: "80vh" }}
            />
            <div className="p-8 text-center sm:hidden">
              <p className="text-muted-foreground text-sm">
                Tap below to open the document full screen.
              </p>
              <Button asChild className="mt-4">
                <a href={url} target="_blank" rel="noopener noreferrer">
                  Open {item.title}
                </a>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
