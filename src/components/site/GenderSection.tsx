import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { servicesQuery, offersQuery, galleryQuery, type Gender, type Service } from "@/lib/salon";
import { Media } from "@/lib/media";
import { Button } from "@/components/ui/button";
import { SectionTitle } from "@/components/site/SectionTitle";
import { Reveal } from "@/components/site/Reveal";
import { OfferCarousel } from "@/components/site/OfferCarousel";

function CategoryPhotos({ images, category }: { images: string[]; category: string }) {
  if (images.length === 0) return null;
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      {images.slice(0, 2).map((src, i) => (
        <figure
          key={src}
          className="frame-gold group/photo tilt-in relative overflow-hidden rounded-lg"
          style={{ animationDelay: `${i * 160}ms` }}
        >
          <img
            src={src}
            alt={`${category} service at Divya Luxe Salon`}
            loading="lazy"
            decoding="async"
            width={1024}
            height={768}
            className="aspect-4/5 w-full object-cover transition-transform duration-[1400ms] ease-out group-hover/photo:scale-110"
          />
          <span className="shine pointer-events-none absolute inset-0" />
        </figure>
      ))}
    </div>
  );
}

/** One category per row, stacked vertically, photos alternating side to side. */
function ServiceMenu({
  categories,
  items,
  categoryImages,
  offset = 0,
}: {
  categories: string[];
  items: Service[];
  categoryImages: Record<string, string[]>;
  offset?: number;
}) {
  return (
    <div className="mx-auto max-w-7xl space-y-14 px-4 sm:space-y-20 sm:px-6">
      {categories.map((category, index) => {
        const flip = (index + offset) % 2 === 1;
        const images = categoryImages[category] ?? [];
        return (
          <Reveal
            key={category}
            delay={80}
            from={flip ? "right" : "left"}
            className="group/row relative grid items-center gap-8 md:grid-cols-2 md:gap-14"
          >
            <div className={flip ? "md:order-2" : ""}>
              <div className="flex items-baseline gap-4">
                <span className="text-gold/50 font-display text-3xl tabular-nums sm:text-4xl">
                  {String(index + offset + 1).padStart(2, "0")}
                </span>
                <h3 className="gold-hover-text text-3xl sm:text-4xl">{category}</h3>
              </div>
              <div className="hairline sweep-in mt-4 max-w-40" />
              <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                {items
                  .filter((service) => service.category === category)
                  .map((service, i) => (
                    <li
                      key={service.id}
                      className="stagger-item"
                      style={{ animationDelay: `${i * 70}ms` }}
                    >
                      <Link
                        to="/book"
                        search={{ service: service.id }}
                        className="link-underline group flex items-start gap-2.5 text-sm transition-transform duration-300 hover:translate-x-1.5"
                      >
                        <span
                          aria-hidden="true"
                          className="border-gold bg-gold/25 mt-[0.45rem] size-2 shrink-0 rounded-full border transition-all duration-300 group-hover:scale-150 group-hover:bg-gold"
                        />
                        <span className="group-hover:text-primary transition-colors">
                          {service.name}
                        </span>
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
            {images.length > 0 ? (
              <div className={flip ? "md:order-1" : ""}>
                <CategoryPhotos images={images} category={category} />
              </div>
            ) : null}
          </Reveal>
        );
      })}
    </div>
  );
}

function DiagonalBand({ src, alt }: { src: string; alt: string }) {
  return (
    <Reveal className="diagonal-band relative my-4 overflow-hidden">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        width={1920}
        height={1088}
        className="h-[42vh] w-full object-cover transition-transform duration-[1400ms] hover:scale-[1.04] sm:h-[54vh]"
      />
    </Reveal>
  );
}

export function GenderSection({
  gender,
  eyebrow,
  title,
  subtitle,
  heroPath,
  bandImage,
  bandAlt,
  crossLink,
  categoryImages = {},
}: {
  gender: Exclude<Gender, "unisex">;
  eyebrow: string;
  title: string;
  subtitle: string;
  heroPath?: string | null | undefined;
  bandImage: string;
  bandAlt: string;
  crossLink: { to: "/men" | "/women"; label: string };
  categoryImages?: Record<string, string[]>;
}) {
  const { data: services = [], isLoading } = useQuery(servicesQuery);
  const { data: offers = [] } = useQuery(offersQuery);
  const { data: gallery = [] } = useQuery(galleryQuery);

  const mine = useMemo(
    () => services.filter((s) => s.gender === gender || s.gender === "unisex"),
    [services, gender],
  );
  const categories = useMemo(() => Array.from(new Set(mine.map((s) => s.category))), [mine]);
  const firstBlock = categories.slice(0, 2);
  const secondBlock = categories.slice(2);
  const myOffers = offers.filter((o) => o.gender === gender || o.gender === "unisex");
  const myGallery = gallery.filter((g) => g.gender === gender || g.gender === "unisex").slice(0, 6);

  return (
    <>
      <section className="diagonal-band relative isolate flex min-h-[58vh] items-end overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Media
            path={heroPath ?? null}
            alt={title}
            eager
            width={1400}
            className="animate-soft-zoom h-full w-full object-cover"
          />
          <div className="absolute inset-0" style={{ backgroundImage: "var(--gradient-veil)" }} />
          <div
            className="absolute inset-0"
            style={{ backgroundImage: "var(--gradient-veil-soft)" }}
          />
        </div>
        <div className="animate-fade-up mx-auto w-full max-w-7xl px-4 pt-32 pb-20 sm:px-6">
          <p className="text-gold letter-in text-[0.65rem] tracking-[0.45em] uppercase">
            {eyebrow}
          </p>
          <div className="gold-rule sweep-in mt-4" />
          <h1 className="animate-fade-up mt-5 max-w-2xl text-4xl leading-[1.08] sm:text-5xl md:text-6xl">
            {title}
          </h1>
          <p className="text-muted-foreground mt-4 max-w-xl text-sm sm:text-base">{subtitle}</p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionTitle align="left" eyebrow="Service menu" title="What we do" />
        </div>

        {isLoading ? (
          <p className="text-muted-foreground mx-auto mt-10 max-w-7xl px-4 text-sm sm:px-6">
            Loading services…
          </p>
        ) : mine.length === 0 ? (
          <p className="text-muted-foreground mx-auto mt-10 max-w-7xl px-4 text-sm sm:px-6">
            Services are being updated. Please check back shortly.
          </p>
        ) : (
          <>
            <div className="mt-12">
              <ServiceMenu categories={firstBlock} items={mine} categoryImages={categoryImages} />
            </div>

            <div className="mt-16">
              <DiagonalBand src={bandImage} alt={bandAlt} />
            </div>

            {secondBlock.length > 0 ? (
              <div className="mt-16">
                <ServiceMenu
                  categories={secondBlock}
                  items={mine}
                  categoryImages={categoryImages}
                  offset={firstBlock.length}
                />
              </div>
            ) : null}

            <div className="mt-14 flex justify-center">
              <Button
                asChild
                variant="secondary"
                className="hover-lift tracking-[0.25em] uppercase"
              >
                <Link to={crossLink.to}>{crossLink.label}</Link>
              </Button>
            </div>
          </>
        )}
      </section>

      {myOffers.length > 0 ? (
        <section className="bg-card/40 border-border/60 border-y py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <SectionTitle align="left" eyebrow="Save more" title="Current offers" />
            <div className="mt-10">
              <OfferCarousel offers={myOffers} />
            </div>
          </div>
        </section>
      ) : null}

      {myGallery.length > 0 ? (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24">
          <SectionTitle align="left" eyebrow="Inspiration" title="Styles from our chair" />
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3">
            {myGallery.map((item, i) => (
              <Reveal
                as="figure"
                key={item.id}
                delay={i * 90}
                className="frame-gold group/photo group relative overflow-hidden rounded-xl"
              >
                <Media
                  path={item.image_path}
                  alt={item.title}
                  width={520}
                  className="aspect-square w-full object-cover transition-transform duration-[1200ms] group-hover:scale-110"
                />
                <span className="shine pointer-events-none absolute inset-0" />
                <figcaption className="from-background/90 absolute inset-x-0 bottom-0 bg-gradient-to-t to-transparent p-4 text-sm">
                  {item.title}
                </figcaption>
              </Reveal>
            ))}
          </div>
          <div className="mt-10">
            <Button asChild variant="outline">
              <Link to="/gallery">Full gallery</Link>
            </Button>
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <Reveal className="card-luxe shine group/photo relative flex flex-col items-center gap-5 overflow-hidden rounded-2xl px-6 py-12 text-center">
          <h2 className="gold-hover-text text-3xl sm:text-4xl">Ready when you are</h2>
          <p className="text-muted-foreground max-w-md text-sm">
            Pick a service, choose a slot, and we'll keep the chair warm.
          </p>
          <Button asChild size="lg" className="hover-lift pulse-gold">
            <Link to="/book">Book Appointment</Link>
          </Button>
          <span className="shine pointer-events-none absolute inset-0" />
        </Reveal>
      </section>
    </>
  );
}
