import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { academyQuery, settingsQuery } from "@/lib/salon";
import { Media } from "@/lib/media";
import { Button } from "@/components/ui/button";
import { SectionTitle } from "@/components/site/SectionTitle";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About the Studio — Divya Saroon" },
      {
        name: "description",
        content:
          "Meet Divya Saroon — a premium grooming and beauty studio built on precision, calm luxury and craft, with premium products and unhurried service.",
      },
      { property: "og:title", content: "About the Studio — Divya Saroon" },
      {
        property: "og:description",
        content: "Precision, calm luxury and craft — the story behind our studio.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { data: settings } = useQuery(settingsQuery);
  const { data: academyMedia = [] } = useQuery(academyQuery);
  const certificates = academyMedia.filter(
    (item) => item.kind === "image" && item.is_active && item.file_path,
  );

  return (
    <div className="mx-auto max-w-7xl px-4 pt-28 pb-10 sm:px-6">
      <SectionTitle
        eyebrow="Our story"
        title={settings?.about_title || `About ${settings?.salon_name ?? "the studio"}`}
        subtitle={settings?.about_subtitle || undefined}
      />

      <div className="mt-14 grid items-center gap-10 md:grid-cols-2">
        <div className="animate-fade-up overflow-hidden rounded-2xl">
          <Media
            path={settings?.about_image_1_path || settings?.hero_image_path}
            alt="Inside the studio"
            width={900}
            className="aspect-4/3 w-full object-cover"
          />
        </div>
        <div className="animate-fade-up space-y-6">
          <p className="text-muted-foreground whitespace-pre-line">{settings?.about}</p>
          {settings?.opening_hours ? (
            <div>
              <h2 className="text-primary text-[0.65rem] tracking-[0.35em] uppercase">Hours</h2>
              <p className="text-muted-foreground mt-2 whitespace-pre-line text-sm">
                {settings.opening_hours}
              </p>
            </div>
          ) : null}
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/book">Book Appointment</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/contact">Contact & Location</Link>
            </Button>
          </div>
        </div>
      </div>

      {settings?.about_image_2_path ? (
        <div className="mt-10 overflow-hidden rounded-2xl">
          <Media
            path={settings.about_image_2_path}
            alt="Divya Luxe Salon"
            width={1200}
            className="aspect-[16/7] w-full object-cover"
          />
        </div>
      ) : null}

      <div className="mt-20">
        <SectionTitle
          eyebrow="Certified & trained"
          title="Shanuzz Academy graduate"
          subtitle="Professional diploma training behind every service we offer."
        />
        {certificates.length > 0 ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {certificates.map((certificate) => (
              <figure
                key={certificate.id}
                className="animate-fade-up overflow-hidden rounded-2xl"
                style={{ boxShadow: "var(--shadow-luxe)" }}
              >
                <Media
                  path={certificate.file_path}
                  alt={certificate.title || "Shanuzz Academy certificate"}
                  width={900}
                  className="aspect-3/4 w-full object-cover"
                />
                {certificate.title || certificate.description ? (
                  <figcaption className="bg-background px-5 py-4">
                    {certificate.title ? (
                      <p className="text-sm font-medium">{certificate.title}</p>
                    ) : null}
                    {certificate.description ? (
                      <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                        {certificate.description}
                      </p>
                    ) : null}
                  </figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
