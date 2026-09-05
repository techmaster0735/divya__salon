import { supabase } from "@/integrations/supabase/client";
import { uploadMedia } from "@/lib/media";

import menHair1 from "@/assets/men-hair-1.jpg";
import menHair2 from "@/assets/men-hair-2.jpg";
import menBeard1 from "@/assets/men-beard-1.jpg";
import menBeard2 from "@/assets/men-beard-2.jpg";
import menSkin1 from "@/assets/men-skin-1.jpg";
import menSkin2 from "@/assets/men-skin-2.jpg";
import menSpa1 from "@/assets/men-spa-1.jpg";
import menSpa2 from "@/assets/men-spa-2.jpg";
import womenHair1 from "@/assets/women-hair-1.jpg";
import womenHair2 from "@/assets/women-hair-2.jpg";
import womenSkin1 from "@/assets/women-skin-1.jpg";
import womenSkin2 from "@/assets/women-skin-2.jpg";
import womenSpa1 from "@/assets/women-spa-1.jpg";
import womenSpa2 from "@/assets/women-spa-2.jpg";
import womenBeauty1 from "@/assets/women-beauty-1.jpg";
import womenBeauty2 from "@/assets/women-beauty-2.jpg";
import womenNails1 from "@/assets/women-nails-1.jpg";
import womenNails2 from "@/assets/women-nails-2.jpg";
import womenBridal1 from "@/assets/women-bridal-1.jpg";
import womenBridal2 from "@/assets/women-bridal-2.jpg";

type ServiceRow = {
  id: string;
  gender: "men" | "women" | "unisex";
  category: string;
  image_path: string | null;
};

const groups: Record<string, string[]> = {
  "men:hair": [menHair1, menHair2],
  "men:beard": [menBeard1, menBeard2],
  "men:skin": [menSkin1, menSkin2],
  "men:spa": [menSpa1, menSpa2],
  "women:hair": [womenHair1, womenHair2],
  "women:skin": [womenSkin1, womenSkin2],
  "women:spa": [womenSpa1, womenSpa2],
  "women:beauty": [womenBeauty1, womenBeauty2],
  "women:nails": [womenNails1, womenNails2],
  "women:bridal": [womenBridal1, womenBridal2],
};

async function assetToFile(url: string, name: string) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Could not load ${name}`);
  const blob = await response.blob();
  return new File([blob], name, { type: blob.type || "image/jpeg" });
}

export async function fillMissingServiceImages() {
  const { data: services, error } = await supabase
    .from("services")
    .select("id, gender, category, image_path")
    .order("sort_order", { ascending: true });

  if (error) throw error;

  const missing = ((services ?? []) as ServiceRow[]).filter((service) => !service.image_path);
  if (missing.length === 0) {
    return { updated: 0, message: "All services already have images." };
  }

  const uploaded = new Map<string, string>();
  let updated = 0;

  for (const service of missing) {
    const key = `${service.gender}:${service.category.toLowerCase()}`;
    const candidates = groups[key];
    if (!candidates?.length) continue;

    const existingPaths: string[] = [];
    for (const assetUrl of candidates) {
      const cached = uploaded.get(assetUrl);
      if (cached) {
        existingPaths.push(cached);
        continue;
      }

      const filename = assetUrl.split("/").pop() || "service.jpg";
      const file = await assetToFile(assetUrl, filename);
      const path = await uploadMedia(file);
      uploaded.set(assetUrl, path);
      existingPaths.push(path);
    }

    const path = existingPaths[updated % existingPaths.length];
    const { error: updateError } = await supabase
      .from("services")
      .update({ image_path: path })
      .eq("id", service.id);

    if (updateError) throw updateError;
    updated += 1;
  }

  const skipped = missing.length - updated;
  return {
    updated,
    skipped,
    message:
      skipped > 0
        ? `Added images to ${updated} services. ${skipped} service(s) had no matching image category.`
        : `Added images to ${updated} services.`,
  };
}
