import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { settingsQuery } from "@/lib/salon";
import { GenderSection } from "@/components/site/GenderSection";
import womenBand from "@/assets/women-band.jpg";
import wHair1 from "@/assets/women-hair-1.jpg";
import wHair2 from "@/assets/women-hair-2.jpg";
import wSkin1 from "@/assets/women-skin-1.jpg";
import wSkin2 from "@/assets/women-skin-2.jpg";
import wBridal1 from "@/assets/women-bridal-1.jpg";
import wBridal2 from "@/assets/women-bridal-2.jpg";
import wSpa1 from "@/assets/women-spa-1.jpg";
import wSpa2 from "@/assets/women-spa-2.jpg";
import wNails1 from "@/assets/women-nails-1.jpg";
import wNails2 from "@/assets/women-nails-2.jpg";
import wBeauty1 from "@/assets/women-beauty-1.jpg";
import wBeauty2 from "@/assets/women-beauty-2.jpg";

const CATEGORY_IMAGES: Record<string, string[]> = {
  Hair: [wHair1, wHair2],
  Skin: [wSkin1, wSkin2],
  Beauty: [wBeauty1, wBeauty2],
  Bridal: [wBridal1, wBridal2],
  Spa: [wSpa1, wSpa2],
  Nails: [wNails1, wNails2],
};

export const Route = createFileRoute("/women")({
  head: () => ({
    meta: [
      { title: "Women's Beauty — Divya Saroon" },
      {
        name: "description",
        content:
          "Women's beauty at Divya Luxe Salon: designer haircuts, balayage, hair spa, facials, waxing, mani-pedi, makeup and bridal packages with live pricing.",
      },
      { property: "og:title", content: "Women's Beauty — Divya Saroon" },
      {
        property: "og:description",
        content: "Designer cuts, balayage, spa rituals and bridal beauty. Book online.",
      },
    ],
  }),
  component: WomenPage,
});

function WomenPage() {
  const { data: settings } = useQuery(settingsQuery);

  return (
    <GenderSection
      gender="women"
      eyebrow="Women's Beauty"
      title="Radiance, styled with intention"
      subtitle="Hair artistry, beauty rituals and bridal looks in a calm, private studio."
      heroPath={settings?.women_image_path}
      bandImage={womenBand}
      bandAlt="Luxury facial treatment in the studio"
      crossLink={{ to: "/men", label: "Gents Services" }}
      categoryImages={CATEGORY_IMAGES}
    />
  );
}
