import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Download, FileText, PlayCircle, X } from "lucide-react";

import { academyQuery, type AcademyMedia } from "@/lib/salon";
import { Media, useMediaUrl } from "@/lib/media";
import { SectionTitle } from "@/components/site/SectionTitle";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/academy")({
  head: () => ({
    meta: [
      { title: "Academy — Divya Saroon" },
      {
        name: "description",
        content:
          "Divya Luxe Academy: training photos, technique videos and downloadable course material shared by our certified educators.",
      },
      { property: "og:title", content: "Academy — Divya Saroon" },
      {
        property: "og:description",
        content: "Training photos, technique videos and course material from Divya Luxe Academy.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AcademyPage,
});

function FileCard({ item }: { item: AcademyMedia }) {
  const { data: url } = useMediaUrl(item.file_path);

  return (
    <div className="card-luxe flex flex-col gap-4 rounded-2xl p-6">
      <FileText className="text-gold size-6" aria-hidden="true" />
      <div>
        <h3 className="text-xl">{item.title}</h3>
        {item.description ? (
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{item.description}</p>
        ) : null}
      </div>
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="link-underline text-primary mt-auto inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase"
        >
          <Download className="size-4" aria-hidden="true" />
          Download
        </a>
      ) : null}
    </div>
  );
}

/** Full-screen preview for academy photos. */
function Lightbox({ item, onClose }: { item: AcademyMedia; onClose: () => void }) {
  const { data: url } = useMediaUrl(item.file_path);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      onClick={onClose}
      className="bg-background/95 animate-in fade-in fixed inset-0 z-[120] flex flex-col items-center justify-center gap-4 p-4 backdrop-blur-sm duration-200 sm:p-8"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close preview"
        className="text-foreground/70 hover:text-foreground absolute top-4 right-4 rounded-full border border-border/60 p-2 transition-colors"
      >
        <X className="size-5" aria-hidden="true" />
      </button>
      {url ? (
        <img
          src={url}
          alt={item.title}
          onClick={(e) => e.stopPropagation()}
          className="animate-in zoom-in-95 max-h-[80vh] w-auto max-w-full rounded-xl object-contain shadow-2xl duration-300"
        />
      ) : (
        <div className="bg-muted h-[60vh] w-full max-w-md animate-pulse rounded-xl" />
      )}
      <div className="max-w-2xl text-center">
        <h3 className="text-xl">{item.title}</h3>
        {item.description ? (
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{item.description}</p>
        ) : null}
      </div>
    </div>
  );
}

/** Video with a custom uploaded thumbnail shown until playback starts. */
function VideoCard({ item }: { item: AcademyMedia }) {
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const { data: videoUrl } = useMediaUrl(playing ? item.file_path : undefined);
  const { data: posterUrl } = useMediaUrl(item.thumbnail_path);

  return (
    <div className="card-luxe overflow-hidden rounded-2xl">
      <div className="relative aspect-video w-full overflow-hidden bg-black">
        {playing && videoUrl ? (
          failed ? (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center">
              <p className="text-muted-foreground text-sm">
                This video can’t be played in your browser.
              </p>
              <a
                href={videoUrl}
                target="_blank"
                rel="noreferrer"
                className="link-underline text-primary inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase"
              >
                <Download className="size-4" aria-hidden="true" />
                Download video
              </a>
            </div>
          ) : (
            <video
              src={videoUrl}
              {...(posterUrl ? { poster: posterUrl } : {})}
              controls
              autoPlay
              playsInline
              preload="auto"
              controlsList="nodownload"
              onError={() => setFailed(true)}
              className="h-full w-full object-contain"
            />
          )
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Play ${item.title}`}
            className="group relative block h-full w-full"
          >
            {item.thumbnail_path ? (
              <Media
                path={item.thumbnail_path}
                alt={item.title}
                width={900}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="bg-muted h-full w-full" aria-hidden="true" />
            )}
            <span className="absolute inset-0 flex items-center justify-center bg-black/25 transition-colors group-hover:bg-black/35">
              <PlayCircle className="size-14 text-white drop-shadow" aria-hidden="true" />
            </span>
          </button>
        )}
      </div>
      <div className="px-5 py-4">
        <h3 className="text-xl">{item.title}</h3>
        {item.description ? (
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{item.description}</p>
        ) : null}
      </div>
    </div>
  );
}

function AcademyPage() {
  const { data: items = [], isLoading } = useQuery(academyQuery);
  const [preview, setPreview] = useState<AcademyMedia | null>(null);

  const images = items.filter((item) => item.kind === "image");
  const videos = items.filter((item) => item.kind === "video");
  const files = items.filter((item) => item.kind === "file");

  return (
    <div className="mx-auto max-w-7xl px-4 pt-28 pb-20 sm:px-6">
      <SectionTitle
        eyebrow="Divya Luxe Academy"
        title="Learn the craft with us"
        subtitle="Training sessions, technique videos and course material — updated by our educators."
      />

      {isLoading ? (
        <p className="text-muted-foreground mt-12 text-center text-sm">Loading academy media…</p>
      ) : items.length === 0 ? (
        <p className="text-muted-foreground mt-12 text-center text-sm">
          Academy content is being prepared. Please check back shortly.
        </p>
      ) : null}

      {videos.length > 0 ? (
        <section className="mt-16">
          <h2 className="text-3xl">Sessions on video</h2>
          <div className="hairline mt-4 max-w-32" />
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {videos.map((item, index) => (
              <Reveal key={item.id} delay={index * 90}>
                <VideoCard item={item} />
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}

      {images.length > 0 ? (
        <section className="mt-20">
          <h2 className="text-3xl">Academy moments</h2>
          <div className="hairline mt-4 max-w-32" />
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((item, index) => (
              <Reveal key={item.id} delay={index * 70}>
                <figure className="card-luxe overflow-hidden rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setPreview(item)}
                    aria-label={`Open ${item.title}`}
                    className="group block w-full overflow-hidden"
                  >
                    <Media
                      path={item.file_path}
                      alt={item.title}
                      width={760}
                      eager={index < 3}
                      className="aspect-[3/4] w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                    />
                  </button>
                  <figcaption className="border-border/60 border-t px-5 py-4">
                    <h3 className="text-xl">{item.title}</h3>
                    {item.description ? (
                      <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                        {item.description}
                      </p>
                    ) : null}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}

      {files.length > 0 ? (
        <section className="mt-20">
          <h2 className="text-3xl">Course material</h2>
          <div className="hairline mt-4 max-w-32" />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {files.map((item, index) => (
              <Reveal key={item.id} delay={index * 80}>
                <FileCard item={item} />
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}

      {preview ? <Lightbox item={preview} onClose={() => setPreview(null)} /> : null}
    </div>
  );
}
