import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { settingsQuery } from "@/lib/salon";
import { GenderSection } from "@/components/site/GenderSection";
import menBand from "@/assets/men-band.jpg";
import menHair1 from "@/assets/men-hair-1.jpg";
import menHair2 from "@/assets/men-hair-2.jpg";
import menBeard1 from "@/assets/men-beard-1.jpg";
import menBeard2 from "@/assets/men-beard-2.jpg";
import menSpa1 from "@/assets/men-spa-1.jpg";
import menSpa2 from "@/assets/men-spa-2.jpg";
import menSkin1 from "@/assets/men-skin-1.jpg";
import menSkin2 from "@/assets/men-skin-2.jpg";

const CATEGORY_IMAGES: Record<string, string[]> = {
  Hair: [menHair1, menHair2],
  Beard: [menBeard1, menBeard2],
  Skin: [menSkin1, menSkin2],
  Spa: [menSpa1, menSpa2],
};

export const Route = createFileRoute("/men")({
  head: () => ({
    meta: [
      { title: "Men's Grooming — Divya Saroon" },
      {
        name: "description",
        content:
          "Men's grooming at Divya Luxe Salon: signature haircuts, beard sculpting, colour, hair spa, facials and premium grooming packages with live pricing.",
      },
      { property: "og:title", content: "Men's Grooming — Divya Saroon" },
      {
        property: "og:description",
        content: "Signature cuts, beard sculpting and premium grooming packages. Book online.",
      },
    ],
  }),
  component: MenPage,
});

function MenPage() {
  const { data: settings } = useQuery(settingsQuery);

  return (
    <GenderSection
      gender="men"
      eyebrow="Men's Grooming"
      title="Sharp, considered, unmistakably yours"
      subtitle="Classic barbering craft with modern precision — cuts, beards, skin and spa."
      heroPath={settings?.men_image_path}
      bandImage={menBand}
      bandAlt="Luxury shave and beard grooming in the studio"
      crossLink={{ to: "/women", label: "Ladies Services" }}
      categoryImages={CATEGORY_IMAGES}
    />
  );
}
