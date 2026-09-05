import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Phone, Clock, Mail, MessageCircle, Instagram } from "lucide-react";

import { settingsQuery, whatsappLink } from "@/lib/salon";
import { Button } from "@/components/ui/button";
import { SectionTitle } from "@/components/site/SectionTitle";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Location — Divya Saroon" },
      {
        name: "description",
        content:
          "Find Divya Luxe Salon: address, opening hours, phone, WhatsApp and directions. Call now, message us on WhatsApp or book an appointment online.",
      },
      { property: "og:title", content: "Contact & Location — Divya Saroon" },
      {
        property: "og:description",
        content: "Address, hours, phone and WhatsApp — plus online booking.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { data: settings } = useQuery(settingsQuery);

  return (
    <div className="mx-auto max-w-7xl px-4 pt-28 pb-10 sm:px-6">
      <SectionTitle
        eyebrow="Visit us"
        title="Contact & Location"
        subtitle="Walk in, call ahead, or reserve your slot online."
      />

      <div className="mt-14 grid gap-10 md:grid-cols-2">
        <div className="animate-fade-up space-y-6">
          <ul className="space-y-5 text-sm">
            {settings?.address ? (
              <li className="flex gap-3">
                <MapPin className="text-primary mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <span className="text-muted-foreground">{settings.address}</span>
              </li>
            ) : null}
            {settings?.opening_hours ? (
              <li className="flex gap-3">
                <Clock className="text-primary mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <span className="text-muted-foreground whitespace-pre-line">
                  {settings.opening_hours}
                </span>
              </li>
            ) : null}
            {settings?.phone ? (
              <li className="flex gap-3">
                <Phone className="text-primary mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <a className="hover:text-primary" href={`tel:${settings.phone}`}>
                  {settings.phone}
                </a>
              </li>
            ) : null}
            {settings?.email ? (
              <li className="flex gap-3">
                <Mail className="text-primary mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <a className="hover:text-primary" href={`mailto:${settings.email}`}>
                  {settings.email}
                </a>
              </li>
            ) : null}
            {settings?.instagram_url ? (
              <li className="flex gap-3">
                <Instagram className="text-primary mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <a
                  className="hover:text-primary"
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Follow us on Instagram
                </a>
              </li>
            ) : null}
          </ul>

          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/book">Book Appointment</Link>
            </Button>
            {settings?.phone ? (
              <Button asChild variant="outline">
                <a href={`tel:${settings.phone}`}>
                  <Phone className="size-4" /> Call Now
                </a>
              </Button>
            ) : null}
            {settings?.whatsapp ? (
              <Button asChild variant="secondary">
                <a
                  href={whatsappLink(settings.whatsapp, "Hi! I'd like to book an appointment.")}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle className="size-4" /> WhatsApp Us
                </a>
              </Button>
            ) : null}
          </div>
        </div>

        {settings?.maps_embed_url ? (
          <div className="animate-fade-up overflow-hidden rounded-2xl border border-border">
            <iframe
              title="Salon location map"
              src={settings.maps_embed_url}
              loading="lazy"
              className="h-80 w-full md:h-full"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
