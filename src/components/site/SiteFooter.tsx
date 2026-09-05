import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Instagram, Facebook, MapPin, Clock, Phone } from "lucide-react";
import { settingsQuery, whatsappLink } from "@/lib/salon";

export function SiteFooter() {
  const { data: settings } = useQuery(settingsQuery);

  return (
    <footer className="border-border/60 mt-24 border-t">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <h2 className="font-display text-xl tracking-[0.22em] uppercase">
            {settings?.salon_name ?? "Divya Luxe Salon"}
          </h2>
          <p className="text-muted-foreground mt-3 text-sm">{settings?.tagline}</p>
          <div className="mt-5 flex gap-3">
            {settings?.instagram_url ? (
              <a
                href={settings.instagram_url}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="border-border hover:text-primary rounded-full border p-2 transition-colors"
              >
                <Instagram className="size-4" />
              </a>
            ) : null}
            {settings?.facebook_url ? (
              <a
                href={settings.facebook_url}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="border-border hover:text-primary rounded-full border p-2 transition-colors"
              >
                <Facebook className="size-4" />
              </a>
            ) : null}
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <h3 className="text-primary text-[0.65rem] tracking-[0.35em] uppercase">Visit</h3>
          {settings?.address ? (
            <p className="text-muted-foreground flex gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              {settings.address}
            </p>
          ) : null}
          {settings?.opening_hours ? (
            <p className="text-muted-foreground flex gap-2 whitespace-pre-line">
              <Clock className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              {settings.opening_hours}
            </p>
          ) : null}
          {settings?.phone ? (
            <p className="text-muted-foreground flex gap-2">
              <Phone className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <a className="hover:text-primary" href={`tel:${settings.phone}`}>
                {settings.phone}
              </a>
            </p>
          ) : null}
        </div>

        <div className="space-y-3 text-sm">
          <h3 className="text-primary text-[0.65rem] tracking-[0.35em] uppercase">Explore</h3>
          <ul className="text-muted-foreground space-y-2">
            <li>
              <Link className="hover:text-primary" to="/men">
                Men's Grooming
              </Link>
            </li>
            <li>
              <Link className="hover:text-primary" to="/women">
                Women's Beauty
              </Link>
            </li>
            <li>
              <Link className="hover:text-primary" to="/offers">
                Offers & Deals
              </Link>
            </li>
            <li>
              <Link className="hover:text-primary" to="/gallery">
                Style Gallery
              </Link>
            </li>
            <li>
              <Link className="hover:text-primary" to="/book">
                Book Appointment
              </Link>
            </li>
            {settings?.whatsapp ? (
              <li>
                <a
                  className="hover:text-primary"
                  href={whatsappLink(settings.whatsapp, "Hi! I'd like to book an appointment.")}
                  target="_blank"
                  rel="noreferrer"
                >
                  WhatsApp Us
                </a>
              </li>
            ) : null}
          </ul>
        </div>
      </div>

      <div className="border-border/60 border-t">
        <div className="text-muted-foreground mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            © {new Date().getFullYear()} {settings?.salon_name ?? "Divya Luxe Salon"}. All rights
            reserved.
          </p>
          <Link className="hover:text-primary tracking-[0.2em] uppercase" to="/auth">
            Salon Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
