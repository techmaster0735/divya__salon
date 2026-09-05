import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Menu, Phone } from "lucide-react";
import { settingsQuery } from "@/lib/salon";
import { Media } from "@/lib/media";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/men", label: "Men's" },
  { to: "/women", label: "Women's" },
  { to: "/menu", label: "Menu" },
  { to: "/offers", label: "Offers" },
  { to: "/gallery", label: "Gallery" },
  { to: "/academy", label: "Academy" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const { data: settings } = useQuery(settingsQuery);
  const [open, setOpen] = useState(false);

  return (
    <header className="border-border/60 bg-background/80 sticky top-0 z-50 border-b backdrop-blur-xl">
      <div className="mx-auto flex h-22 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="group flex items-center gap-3" aria-label="Home">
          {settings?.logo_path ? (
            <Media
              path={settings.logo_path}
              alt=""
              eager
              width={160}
              className="h-16 w-16 object-contain transition-transform duration-500 group-hover:scale-105 sm:h-18 sm:w-18"
            />
          ) : null}
          <span className="font-display hidden text-lg leading-none tracking-[0.22em] uppercase sm:inline">
            {settings?.salon_name ?? "Divya Luxe Salon"}
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeProps={{ className: "text-primary" }}
              className="link-underline hover:text-primary text-xs tracking-[0.2em] uppercase transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {settings?.phone ? (
            <Button asChild variant="ghost" size="icon" className="hidden sm:inline-flex">
              <a href={`tel:${settings.phone}`} aria-label="Call the salon">
                <Phone className="size-4" />
              </a>
            </Button>
          ) : null}
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link to="/book">Book Appointment</Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background w-72">
              <SheetTitle className="font-display px-4 pt-2 text-base tracking-[0.25em] uppercase">
                {settings?.salon_name ?? "Divya Luxe Salon"}
              </SheetTitle>
              <nav className="mt-6 flex flex-col gap-1 px-2" aria-label="Mobile">
                {NAV.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    activeProps={{ className: "text-primary" }}
                    className="hover:bg-accent rounded-md px-3 py-3 text-sm tracking-[0.2em] uppercase"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-6 px-4">
                <Button asChild className="w-full" onClick={() => setOpen(false)}>
                  <Link to="/book">Book Appointment</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
