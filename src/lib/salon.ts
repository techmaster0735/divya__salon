import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Gender = "men" | "women" | "unisex";
export type Service = {
  id: string;
  gender: Gender;
  category: string;
  name: string;
  description: string | null;
  price: number;
  offer_price: number | null;
  duration_minutes: number;
  image_path: string | null;
  badge: string | null;
  is_package: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
};

export type GalleryItem = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  gender: Gender;
  image_path: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
};

export type Offer = {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  offer_price: number | null;
  discount_percent: number | null;
  image_path: string | null;
  gender: Gender;
  starts_at: string | null;
  ends_at: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
};

export type Announcement = {
  id: string;
  title: string;
  body: string | null;
  is_active: boolean;
  created_at: string;
};

export type AcademyKind = "image" | "video" | "file";
export type AcademyMedia = {
  id: string;
  title: string;
  description: string | null;
  kind: AcademyKind;
  file_path: string;
  thumbnail_path: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
};

export type MenuKind = "pdf" | "image" | "text" | "link";
export type MenuItem = {
  id: string;
  title: string;
  description: string | null;
  kind: MenuKind;
  file_path: string | null;
  link_url: string | null;
  body: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
};

export type SiteSettings = {
  id: boolean;
  salon_name: string;
  tagline: string;
  about: string | null;
  logo_path: string | null;
  hero_image_path: string | null;
  men_image_path: string | null;
  women_image_path: string | null;
  hero_title: string;
  hero_subtitle: string | null;
  address: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  opening_hours: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  maps_embed_url: string | null;
  about_image_1_path: string | null;
  about_image_2_path: string | null;
  about_title: string | null;
  about_subtitle: string | null;
  updated_at: string;
};

async function selectAll<T>(table: string, order: { column: string; ascending?: boolean }[]) {
  let query = (supabase as any).from(table).select("*");
  for (const o of order) query = query.order(o.column, { ascending: o.ascending ?? true });
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as unknown as T[];
}

export const settingsQuery = queryOptions({
  queryKey: ["site_settings"],
  queryFn: async () => {
    const { data, error } = await (supabase as any).from("site_settings").select("*").maybeSingle();
    if (error) throw error;
    return (data ?? null) as unknown as SiteSettings | null;
  },
});

export const servicesQuery = queryOptions({
  queryKey: ["services"],
  queryFn: () =>
    selectAll<Service>("services", [{ column: "sort_order" }, { column: "created_at" }]),
});

export const galleryQuery = queryOptions({
  queryKey: ["gallery_items"],
  queryFn: () =>
    selectAll<GalleryItem>("gallery_items", [{ column: "sort_order" }, { column: "created_at" }]),
});

export const offersQuery = queryOptions({
  queryKey: ["offers"],
  queryFn: () => selectAll<Offer>("offers", [{ column: "sort_order" }, { column: "created_at" }]),
});

export const announcementsQuery = queryOptions({
  queryKey: ["announcements"],
  queryFn: () =>
    selectAll<Announcement>("announcements", [{ column: "created_at", ascending: false }]),
});

export const academyQuery = queryOptions({
  queryKey: ["academy_media"],
  queryFn: () =>
    selectAll<AcademyMedia>("academy_media", [
      { column: "sort_order" },
      { column: "created_at", ascending: false },
    ]),
});

export const menuQuery = queryOptions({
  queryKey: ["menu_items"],
  queryFn: () =>
    selectAll<MenuItem>("menu_items", [{ column: "sort_order" }, { column: "created_at" }]),
});

export function money(value?: number | string | null) {
  if (value === null || value === undefined || value === "") return "";
  const n = typeof value === "string" ? Number(value) : value;
  return `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

export function whatsappLink(number: string | null | undefined, text: string) {
  const digits = (number ?? "").replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export const TIME_SLOTS = [
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
  "08:00 PM",
];
