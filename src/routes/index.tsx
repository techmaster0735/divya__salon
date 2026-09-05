import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Sparkles, Scissors, Star } from "lucide-react";

import { settingsQuery, offersQuery, announcementsQuery } from "@/lib/salon";
import { Media } from "@/lib/media";
import { Button } from "@/components/ui/button";
import { SectionTitle } from "@/components/site/SectionTitle";
import { OfferCarousel } from "@/components/site/OfferCarousel";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Divya Saroon — Premium Barber & Beauty Studio" },
      {
        name: "description",
        content:
          "A premium grooming and beauty studio. Choose Men's Grooming or Women's Beauty, explore services and offers, and book your appointment online.",
      },
      { property: "og:title", content: "Divya Saroon — Premium Barber & Beauty Studio" },
      {
        property: "og:description",
        content: "Precision cuts, beard sculpting, colour and luxury beauty rituals. Book online.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { data: settings } = useQuery(settingsQuery);
  const { data: offers = [] } = useQuery(offersQuery);
  const { data: announcements = [] } = useQuery(announcementsQuery);

  const featured = offers.filter((offer) => Boolean(offer.image_path)).slice(0, 5);

  return (
    <>
      {/* HERO */}
      <section className="relative isolate flex min-h-[86vh] items-center overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Media
            path={settings?.hero_image_path}
            alt="Interior of the salon"
            eager
            width={1600}
            className="animate-soft-zoom h-full w-full object-cover"
          />
          <div className="absolute inset-0" style={{ backgroundImage: "var(--gradient-veil)" }} />
          <div
            className="absolute inset-0"
            style={{ backgroundImage: "var(--gradient-veil-bottom)" }}
          />
        </div>

        <div className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6">
          <div className="animate-fade-up max-w-2xl">
            <p className="text-gold text-[0.65rem] tracking-[0.45em] uppercase">
              {settings?.tagline ?? "Premium Grooming & Beauty"}
            </p>
            <div className="gold-rule mt-5" />
            <h1 className="mt-6 text-5xl leading-[1.05] sm:text-6xl md:text-7xl">
              {settings?.hero_title ?? "Where Style Meets Craft"}
            </h1>
            {settings?.hero_subtitle ? (
              <p className="text-muted-foreground mt-6 max-w-xl text-base sm:text-lg">
                {settings.hero_subtitle}
              </p>
            ) : null}
            <div className="mt-9 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="bg-gold text-primary hover:bg-gold-soft transition-transform duration-300 hover:-translate-y-0.5"
              >
                <Link to="/book">Book Appointment</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary/30 bg-transparent transition-transform duration-300 hover:-translate-y-0.5"
              >
                <Link to="/offers">View Offers</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary/30 bg-transparent transition-transform duration-300 hover:-translate-y-0.5"
              >
                <Link to="/menu">Menu</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* GENDER SELECTION */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28">
        <SectionTitle
          eyebrow="Choose your experience"
          title="Two studios. One standard of luxury."
          subtitle="Tell us who we're styling today and we'll show you the right menu, styles and offers."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <Reveal from="left">
            <GenderCard
              to="/men"
              label="Men"
              title="Men's Grooming"
              copy="Precision cuts, beard sculpting, facials and premium grooming packages."
              imagePath={settings?.men_image_path}
              icon={<Scissors className="size-4" aria-hidden="true" />}
            />
          </Reveal>
          <Reveal from="right" delay={120}>
            <GenderCard
              to="/women"
              label="Women"
              title="Women's Beauty"
              copy="Designer cuts, balayage, spa rituals, beauty treatments and bridal looks."
              imagePath={settings?.women_image_path}
              icon={<Sparkles className="size-4" aria-hidden="true" />}
            />
          </Reveal>
        </div>
      </section>

      {/* OFFERS */}
      {featured.length > 0 ? (
        <section className="bg-card/40 border-border/60 border-y py-20 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <SectionTitle
              eyebrow="Live right now"
              title="Offers & Deals"
              subtitle="Updated by the salon — grab them before they expire."
            />
            <div className="mt-12">
              <OfferCarousel offers={featured} />
            </div>

            <div className="mt-10 text-center">
              <Button asChild variant="outline">
                <Link to="/offers">
                  All offers <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      ) : null}

      {/* ANNOUNCEMENTS */}
      {announcements.length > 0 ? (
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <SectionTitle eyebrow="Salon updates" title="What's new at the studio" />
          <ul className="mx-auto mt-12 grid max-w-4xl gap-4">
            {announcements.slice(0, 4).map((item, index) => (
              <Reveal as="li" key={item.id} delay={index * 90} className="card-luxe rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <Star className="text-primary mt-1 size-4 shrink-0" aria-hidden="true" />
                  <div>
                    <h3 className="text-xl">{item.title}</h3>
                    {item.body ? (
                      <p className="text-muted-foreground mt-2 text-sm">{item.body}</p>
                    ) : null}
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  );
}

function GenderCard({
  to,
  label,
  title,
  copy,
  imagePath,
  icon,
}: {
  to: "/men" | "/women";
  label: string;
  title: string;
  copy: string;
  imagePath?: string | null | undefined;
  icon: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className="group animate-fade-up relative block overflow-hidden rounded-2xl"
      style={{ boxShadow: "var(--shadow-luxe)" }}
    >
      <div className="relative aspect-4/5 sm:aspect-3/4 md:aspect-4/5">
        <Media
          path={imagePath}
          alt={title}
          width={700}
          className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
        />
        <div className="absolute inset-0" style={{ backgroundImage: "var(--gradient-veil)" }} />
        <div className="absolute inset-x-0 bottom-0 p-7 sm:p-9">
          <p className="text-primary flex items-center gap-2 text-[0.65rem] tracking-[0.45em] uppercase">
            {icon}
            {label}
          </p>
          <h3 className="mt-3 text-3xl sm:text-4xl">{title}</h3>
          <p className="text-muted-foreground mt-3 max-w-sm text-sm">{copy}</p>
          <span className="text-primary mt-6 inline-flex items-center gap-2 text-xs tracking-[0.3em] uppercase">
            Enter
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
        <div className="border-primary/0 group-hover:border-primary/40 pointer-events-none absolute inset-0 rounded-2xl border transition-colors duration-500" />
      </div>
    </Link>
  );
}
