import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { offersQuery, announcementsQuery } from "@/lib/salon";
import { SectionTitle } from "@/components/site/SectionTitle";
import { OfferCarousel } from "@/components/site/OfferCarousel";

export const Route = createFileRoute("/offers")({
  head: () => ({
    meta: [
      { title: "Offers & Deals — Divya Saroon" },
      {
        name: "description",
        content:
          "Live offers at Divya Luxe Salon: discounted haircuts, hair and beard combos, weekend beauty specials, bridal season deals and new customer offers.",
      },
      { property: "og:title", content: "Offers & Deals — Divya Saroon" },
      {
        property: "og:description",
        content: "Limited-time grooming and beauty deals, updated daily by the salon.",
      },
    ],
  }),
  component: OffersPage,
});

function OffersPage() {
  const { data: offers = [], isLoading } = useQuery(offersQuery);
  const { data: announcements = [] } = useQuery(announcementsQuery);
  const slides = offers.filter((offer) => Boolean(offer.image_path));

  return (
    <div className="mx-auto max-w-7xl px-4 pt-28 pb-10 sm:px-6">
      <SectionTitle
        eyebrow="Limited time"
        title="Offers & Deals"
        subtitle="Expired offers disappear automatically — what you see here is live today."
      />

      {isLoading ? (
        <p className="text-muted-foreground mt-12 text-center text-sm">Loading offers…</p>
      ) : slides.length === 0 ? (
        <p className="text-muted-foreground mt-12 text-center text-sm">
          No live offers right now. New deals are published every week.
        </p>
      ) : (
        <div className="mt-12">
          <OfferCarousel offers={slides} />
        </div>
      )}

      {announcements.length > 0 ? (
        <div className="mt-20">
          <SectionTitle align="left" eyebrow="Daily updates" title="Announcements" />
          <ul className="mt-8 grid gap-4 md:grid-cols-2">
            {announcements.map((item) => (
              <li key={item.id} className="card-luxe rounded-xl p-6">
                <p className="text-muted-foreground text-[0.65rem] tracking-[0.3em] uppercase">
                  {new Date(item.created_at).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                </p>
                <h3 className="mt-2 text-xl">{item.title}</h3>
                {item.body ? (
                  <p className="text-muted-foreground mt-2 text-sm">{item.body}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
