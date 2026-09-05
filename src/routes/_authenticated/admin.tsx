import { useState } from "react";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteMedia } from "@/lib/media";
import { fillMissingServiceImages } from "@/lib/bulk-service-images";

import { supabase } from "@/integrations/supabase/client";
import {
  servicesQuery,
  offersQuery,
  galleryQuery,
  announcementsQuery,
  settingsQuery,
  academyQuery,
  menuQuery,
  type Gender,
} from "@/lib/salon";
import { useResource } from "@/components/admin/useResource";
import { ImageField } from "@/components/admin/ImageField";
import { FileField } from "@/components/admin/FileField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const Route = createFileRoute("/_authenticated/admin")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
    const { data: isAdmin, error: roleError } = await supabase.rpc("has_role", {
      _user_id: data.user.id,
      _role: "admin",
    });
    if (roleError || !isAdmin) throw redirect({ to: "/auth" });
    return { user: data.user };
  },
  head: () => ({
    meta: [
      { title: "Salon Dashboard — Divya Luxe Salon" },
      {
        name: "description",
        content: "Manage services, offers, gallery, announcements and salon settings.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Salon Dashboard — Divya Luxe Salon" },
      { property: "og:description", content: "Internal content management for Divya Luxe Salon." },
    ],
  }),
  component: AdminPage,
});

type Row = any;

function Field({
  label,
  value,
  onChange,
  type = "text",
  textarea,
}: {
  label: string;
  value: any;
  onChange: (value: string) => void;
  type?: string;
  textarea?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {textarea ? (
        <Textarea value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <Input type={type} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}

function GenderPicker({ value, onChange }: { value: Gender; onChange: (g: Gender) => void }) {
  return (
    <div className="space-y-2">
      <Label>Audience</Label>
      <div className="flex gap-2">
        {(["men", "women", "unisex"] as Gender[]).map((g) => (
          <Button
            key={g}
            type="button"
            size="sm"
            variant={value === g ? "default" : "outline"}
            onClick={() => onChange(g)}
          >
            {g}
          </Button>
        ))}
      </div>
    </div>
  );
}

function Editor({
  title,
  rows,
  blank,
  table,
  queryKey,
  fields,
  summary,
}: {
  title: string;
  rows: Row[];
  blank: Row;
  table: string;
  queryKey: string;
  fields: (draft: Row, set: (patch: Row) => void) => React.ReactNode;
  summary: (row: Row) => string;
}) {
  const { save, remove, patch } = useResource(table, queryKey);
  const [draft, setDraft] = useState<Row | null>(null);
  const set = (p: Row) => setDraft((d: Row | null) => ({ ...(d ?? {}), ...p }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl">{title}</h2>
        <Button size="sm" onClick={() => setDraft({ ...blank })}>
          Add new
        </Button>
      </div>

      {draft ? (
        <form
          className="card-luxe space-y-5 rounded-xl p-6"
          onSubmit={async (event) => {
            event.preventDefault();
            const { id, created_at, ...values } = draft;
            const saved = await save(values, id);
            if (saved) {
              if (id) {
                const original = rows.find((item) => item.id === id);
                const oldPaths = [
                  original?.image_path,
                  original?.file_path,
                  original?.thumbnail_path,
                ].filter(Boolean);
                const newPaths = [
                  values.image_path,
                  values.file_path,
                  values.thumbnail_path,
                ].filter(Boolean);
                await Promise.all(
                  oldPaths
                    .filter((path) => !newPaths.includes(path))
                    .map((path) => deleteMedia(String(path))),
                );
              }
              setDraft(null);
            }
          }}
        >
          {fields(draft, set)}
          <div className="flex gap-2">
            <Button type="submit">Save</Button>
            <Button type="button" variant="ghost" onClick={() => setDraft(null)}>
              Cancel
            </Button>
          </div>
        </form>
      ) : null}

      <ul className="divide-border/60 divide-y">
        {rows.map((row, index) => (
          <li key={row.id} className="flex flex-wrap items-center gap-3 py-4">
            <div className="min-w-0 flex-1">
              <p className="truncate">{summary(row)}</p>
            </div>
            {"sort_order" in row ? (
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={index === 0}
                  onClick={async () => {
                    const prev = rows[index - 1];
                    if (!prev) return;
                    await patch(row.id, { sort_order: index - 1 });
                    await patch(prev.id, { sort_order: index });
                  }}
                >
                  ↑
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={index === rows.length - 1}
                  onClick={async () => {
                    const next = rows[index + 1];
                    if (!next) return;
                    await patch(row.id, { sort_order: index + 1 });
                    await patch(next.id, { sort_order: index });
                  }}
                >
                  ↓
                </Button>
              </div>
            ) : null}
            {"is_active" in row ? (
              <Switch
                checked={Boolean(row.is_active)}
                onCheckedChange={(checked) => patch(row.id, { is_active: checked })}
              />
            ) : null}
            <Button size="sm" variant="outline" onClick={() => setDraft({ ...row })}>
              Edit
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                if (confirm("Delete this item?")) {
                  remove(row.id).then(async (ok) => {
                    if (!ok) return;
                    for (const path of [row.image_path, row.file_path, row.thumbnail_path].filter(
                      Boolean,
                    )) {
                      await deleteMedia(String(path));
                    }
                  });
                }
              }}
            >
              Delete
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AdminPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: services = [] } = useQuery(servicesQuery);
  const { data: offers = [] } = useQuery(offersQuery);
  const { data: gallery = [] } = useQuery(galleryQuery);
  const { data: announcements = [] } = useQuery(announcementsQuery);
  const { data: academy = [] } = useQuery(academyQuery);
  const { data: menuItems = [] } = useQuery(menuQuery);
  const { data: settings } = useQuery(settingsQuery);
  const [siteDraft, setSiteDraft] = useState<Row | null>(null);
  const [serviceImagesBusy, setServiceImagesBusy] = useState(false);
  const draft = siteDraft ?? (settings as Row | null);

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-primary text-[0.65rem] tracking-[0.45em] uppercase">Dashboard</p>
          <h1 className="mt-2 text-3xl">Salon control room</h1>
        </div>
        <Button variant="outline" onClick={signOut}>
          Sign out
        </Button>
      </div>

      <Tabs defaultValue="services" className="mt-10">
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-2 bg-transparent p-0">
          {["services", "offers", "gallery", "academy", "menu", "news", "about", "settings"].map(
            (tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="border-border data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full border px-4 py-2 text-xs tracking-[0.2em] uppercase"
              >
                {tab}
              </TabsTrigger>
            ),
          )}
        </TabsList>

        <TabsContent value="services" className="mt-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4">
            <div>
              <h2 className="text-lg">Service images</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Automatically add suitable images to every service that is currently missing one.
              </p>
            </div>
            <Button
              type="button"
              disabled={serviceImagesBusy}
              onClick={async () => {
                setServiceImagesBusy(true);
                try {
                  const result = await fillMissingServiceImages();
                  toast.success(result.message);
                  await queryClient.invalidateQueries({ queryKey: ["services"] });
                } catch (error) {
                  toast.error(error instanceof Error ? error.message : "Could not add service images");
                } finally {
                  setServiceImagesBusy(false);
                }
              }}
            >
              {serviceImagesBusy ? "Adding images..." : "Auto-fill missing images"}
            </Button>
          </div>
          <Editor
            title="Services"
            table="services"
            queryKey="services"
            rows={services as Row[]}
            blank={{
              gender: "women",
              category: "Hair",
              name: "",
              description: "",
              price: 0,
              offer_price: null,
              duration_minutes: 30,
              image_path: null,
              badge: null,
              is_package: false,
              is_active: true,
              sort_order: 0,
            }}
            summary={(row: Row) => `${row.name} · ${row.category} · ${row.gender}`}
            fields={(d: Row, set: (patch: Row) => void) => (
              <>
                <GenderPicker value={d.gender} onChange={(gender) => set({ gender })} />
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Name" value={d.name} onChange={(name) => set({ name })} />
                  <Field
                    label="Category"
                    value={d.category}
                    onChange={(category) => set({ category })}
                  />
                  <Field
                    label="Price (₹)"
                    type="number"
                    value={d.price ?? 0}
                    onChange={(v) => set({ price: Number(v) })}
                  />
                  <Field
                    label="Offer price (₹)"
                    type="number"
                    value={d.offer_price ?? ""}
                    onChange={(v) => set({ offer_price: v === "" ? null : Number(v) })}
                  />
                  <Field
                    label="Duration (minutes)"
                    type="number"
                    value={d.duration_minutes}
                    onChange={(v) => set({ duration_minutes: Number(v) })}
                  />
                  <Field
                    label="Badge (optional)"
                    value={d.badge ?? ""}
                    onChange={(v) => set({ badge: v || null })}
                  />
                </div>
                <Field
                  label="Description"
                  textarea
                  value={d.description ?? ""}
                  onChange={(description) => set({ description })}
                />
                <ImageField path={d.image_path ?? null} onChange={(p) => set({ image_path: p })} />
                <div className="flex items-center gap-3">
                  <Switch
                    checked={Boolean(d.is_package)}
                    onCheckedChange={(is_package) => set({ is_package })}
                  />
                  <Label>Package deal</Label>
                </div>
              </>
            )}
          />
        </TabsContent>

        <TabsContent value="offers" className="mt-8">
          <Editor
            title="Offers"
            table="offers"
            queryKey="offers"
            rows={offers as Row[]}
            blank={{
              title: "",
              description: "",
              price: null,
              offer_price: null,
              discount_percent: null,
              image_path: null,
              gender: "unisex",
              starts_at: null,
              ends_at: null,
              is_active: true,
              sort_order: 0,
            }}
            summary={(row: Row) =>
              `${row.title} · ${row.gender}${row.ends_at ? ` · ends ${row.ends_at.slice(0, 10)}` : ""}`
            }
            fields={(d: Row, set: (patch: Row) => void) => (
              <>
                <GenderPicker value={d.gender} onChange={(gender) => set({ gender })} />
                <Field label="Title" value={d.title} onChange={(title) => set({ title })} />
                <Field
                  label="Description"
                  textarea
                  value={d.description ?? ""}
                  onChange={(description) => set({ description })}
                />
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    label="Original price (₹)"
                    type="number"
                    value={d.price ?? ""}
                    onChange={(v) => set({ price: v === "" ? null : Number(v) })}
                  />
                  <Field
                    label="Offer price (₹)"
                    type="number"
                    value={d.offer_price ?? ""}
                    onChange={(v) => set({ offer_price: v === "" ? null : Number(v) })}
                  />
                  <Field
                    label="Discount (%)"
                    type="number"
                    value={d.discount_percent ?? ""}
                    onChange={(v) => set({ discount_percent: v === "" ? null : Number(v) })}
                  />
                  <Field
                    label="Starts at"
                    type="date"
                    value={d.starts_at ? String(d.starts_at).slice(0, 10) : ""}
                    onChange={(v) => set({ starts_at: v ? new Date(v).toISOString() : null })}
                  />
                  <Field
                    label="Ends at"
                    type="date"
                    value={d.ends_at ? String(d.ends_at).slice(0, 10) : ""}
                    onChange={(v) => set({ ends_at: v ? new Date(v).toISOString() : null })}
                  />
                </div>
                <ImageField path={d.image_path ?? null} onChange={(p) => set({ image_path: p })} />
              </>
            )}
          />
        </TabsContent>

        <TabsContent value="gallery" className="mt-8">
          <Editor
            title="Gallery"
            table="gallery_items"
            queryKey="gallery_items"
            rows={gallery as Row[]}
            blank={{
              title: "",
              description: "",
              category: "Hair",
              gender: "unisex",
              image_path: "",
              is_active: true,
              sort_order: 0,
            }}
            summary={(row: Row) => `${row.title} · ${row.category} · ${row.gender}`}
            fields={(d: Row, set: (patch: Row) => void) => (
              <>
                <GenderPicker value={d.gender} onChange={(gender) => set({ gender })} />
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Title" value={d.title} onChange={(title) => set({ title })} />
                  <Field
                    label="Category"
                    value={d.category}
                    onChange={(category) => set({ category })}
                  />
                </div>
                <Field
                  label="Description"
                  textarea
                  value={d.description ?? ""}
                  onChange={(description) => set({ description })}
                />
                <ImageField
                  path={d.image_path || null}
                  onChange={(p) => set({ image_path: p ?? "" })}
                />
              </>
            )}
          />
        </TabsContent>

        <TabsContent value="academy" className="mt-8">
          <Editor
            title="Academy media"
            table="academy_media"
            queryKey="academy_media"
            rows={academy as Row[]}
            blank={{
              title: "",
              description: "",
              kind: "image",
              file_path: "",
              is_active: true,
              sort_order: 0,
            }}
            summary={(row: Row) => `${row.title} · ${row.kind}`}
            fields={(d: Row, set: (patch: Row) => void) => (
              <>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <div className="flex gap-2">
                    {["image", "video", "file"].map((kind) => (
                      <Button
                        key={kind}
                        type="button"
                        size="sm"
                        variant={d.kind === kind ? "default" : "outline"}
                        onClick={() => set({ kind })}
                      >
                        {kind}
                      </Button>
                    ))}
                  </div>
                </div>
                <Field label="Title" value={d.title} onChange={(title) => set({ title })} />
                <Field
                  label="Description"
                  textarea
                  value={d.description ?? ""}
                  onChange={(description) => set({ description })}
                />
                <FileField
                  label={
                    d.kind === "video"
                      ? "Upload video (MP4 / WebM / MOV)"
                      : "Upload image, video or file"
                  }
                  accept={
                    d.kind === "video"
                      ? "video/mp4,video/webm,video/quicktime,video/*"
                      : d.kind === "image"
                        ? "image/*"
                        : "image/*,video/*,.pdf,.doc,.docx,.ppt,.pptx,.zip"
                  }
                  path={d.file_path || null}
                  onChange={(p) => set({ file_path: p ?? "" })}
                />
                {d.kind === "video" ? (
                  <>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      For playback on every device (Windows PC, Mac, Android, iPhone), upload
                      <strong> H.264 MP4</strong>. iPhone “High Efficiency” (HEVC) clips won’t play
                      on many PCs — switch the camera to “Most Compatible” or export as H.264.
                    </p>
                    <ImageField
                      label="Custom video thumbnail (wide 16:9)"
                      path={d.thumbnail_path || null}
                      onChange={(p) => set({ thumbnail_path: p ?? null })}
                    />
                  </>
                ) : null}
              </>
            )}
          />
        </TabsContent>

        <TabsContent value="menu" className="mt-8">
          <Editor
            title="Menu & Price List"
            table="menu_items"
            queryKey="menu_items"
            rows={menuItems as Row[]}
            blank={{
              title: "",
              description: "",
              kind: "pdf",
              file_path: null,
              link_url: null,
              body: null,
              is_active: true,
              sort_order: 0,
            }}
            summary={(row: Row) => `${row.title} · ${row.kind}`}
            fields={(d: Row, set: (patch: Row) => void) => (
              <>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <div className="flex flex-wrap gap-2">
                    {(["pdf", "image", "text", "link"] as const).map((kind) => (
                      <Button
                        key={kind}
                        type="button"
                        size="sm"
                        variant={d.kind === kind ? "default" : "outline"}
                        onClick={() => set({ kind, file_path: null, link_url: null, body: null })}
                      >
                        {kind === "pdf" ? "PDF" : kind[0].toUpperCase() + kind.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
                <Field
                  label="Title / tab name"
                  value={d.title}
                  onChange={(title) => set({ title })}
                />
                <Field
                  label="Description"
                  textarea
                  value={d.description ?? ""}
                  onChange={(description) => set({ description })}
                />
                {d.kind === "text" ? (
                  <Field
                    label="Text content"
                    textarea
                    value={d.body ?? ""}
                    onChange={(body) => set({ body })}
                  />
                ) : d.kind === "link" ? (
                  <Field
                    label="Link URL"
                    value={d.link_url ?? ""}
                    onChange={(link_url) => set({ link_url })}
                  />
                ) : (
                  <FileField
                    label={d.kind === "pdf" ? "Upload PDF" : "Upload image"}
                    accept={d.kind === "pdf" ? "application/pdf,.pdf" : "image/*"}
                    path={d.file_path ?? null}
                    onChange={(file_path) => set({ file_path })}
                  />
                )}
              </>
            )}
          />
        </TabsContent>

        <TabsContent value="news" className="mt-8">
          <Editor
            title="Announcements"
            table="announcements"
            queryKey="announcements"
            rows={announcements as Row[]}
            blank={{ title: "", body: "", is_active: true }}
            summary={(row: Row) => row.title}
            fields={(d: Row, set: (patch: Row) => void) => (
              <>
                <Field label="Title" value={d.title} onChange={(title) => set({ title })} />
                <Field
                  label="Body"
                  textarea
                  value={d.body ?? ""}
                  onChange={(body) => set({ body })}
                />
              </>
            )}
          />
        </TabsContent>

        <TabsContent value="about" className="mt-8">
          <div className="mb-6">
            <h2 className="text-2xl">About Section</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Manage everything shown in the public About page from one place.
            </p>
          </div>

          {draft ? (
            <>
              <form
                className="card-luxe space-y-5 rounded-xl p-6"
                onSubmit={async (event) => {
                  event.preventDefault();
                  const { error } = await supabase
                    .from("site_settings")
                    .update({
                      about_title: draft.about_title ?? null,
                      about_subtitle: draft.about_subtitle ?? null,
                      about: draft.about ?? null,
                      opening_hours: draft.opening_hours ?? null,
                      about_image_1_path: draft.about_image_1_path ?? null,
                      about_image_2_path: draft.about_image_2_path ?? null,
                    })
                    .eq("id", true);

                  if (error) {
                    toast.error(error.message);
                  } else {
                    toast.success("About section saved");
                    queryClient.invalidateQueries({ queryKey: ["site_settings"] });
                  }
                }}
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    label="About title"
                    value={draft.about_title ?? ""}
                    onChange={(v) => setSiteDraft({ ...draft, about_title: v })}
                  />
                  <Field
                    label="About subtitle"
                    value={draft.about_subtitle ?? ""}
                    onChange={(v) => setSiteDraft({ ...draft, about_subtitle: v })}
                  />
                </div>

                <Field
                  label="About description"
                  textarea
                  value={draft.about ?? ""}
                  onChange={(v) => setSiteDraft({ ...draft, about: v })}
                />

                <Field
                  label="Opening hours"
                  textarea
                  value={draft.opening_hours ?? ""}
                  onChange={(v) => setSiteDraft({ ...draft, opening_hours: v })}
                />

                <Separator />

                <div>
                  <h3 className="text-lg">About images</h3>
                  <p className="text-muted-foreground mt-1 text-sm">
                    These images are displayed on the public About page. If image 1 is empty, the
                    page automatically falls back to the hero image.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <ImageField
                    label="About image 1"
                    path={draft.about_image_1_path ?? null}
                    onChange={(p) => setSiteDraft({ ...draft, about_image_1_path: p })}
                  />
                  <ImageField
                    label="About image 2"
                    path={draft.about_image_2_path ?? null}
                    onChange={(p) => setSiteDraft({ ...draft, about_image_2_path: p })}
                  />
                </div>

                <Button type="submit">Save About Section</Button>
              </form>

              <div className="card-luxe mt-8 rounded-xl p-6">
                <div className="mb-6">
                  <h3 className="text-lg">Shanuzz Academy certificates</h3>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Add as many certificate images as you need. These active images appear in the
                    certified &amp; trained section on the public About page. This does not change
                    the two About images above.
                  </p>
                </div>
                <Editor
                  title="Certificates"
                  table="academy_media"
                  queryKey="academy_media"
                  rows={(academy as Row[]).filter((row) => row.kind === "image")}
                  blank={{
                    title: "Certificate",
                    description: "",
                    kind: "image",
                    file_path: "",
                    is_active: true,
                    sort_order: (academy as Row[]).filter((row) => row.kind === "image").length,
                  }}
                  summary={(row: Row) => row.title || "Certificate image"}
                  fields={(d: Row, set: (patch: Row) => void) => (
                    <>
                      <Field
                        label="Certificate title (optional)"
                        value={d.title ?? ""}
                        onChange={(title) => set({ title })}
                      />
                      <Field
                        label="Description (optional)"
                        textarea
                        value={d.description ?? ""}
                        onChange={(description) => set({ description })}
                      />
                      <FileField
                        label="Upload certificate image"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        path={d.file_path || null}
                        onChange={(file_path) => set({ file_path: file_path ?? "" })}
                      />
                    </>
                  )}
                />
              </div>
            </>
          ) : (
            <div className="card-luxe rounded-xl p-6">
              <p className="text-muted-foreground">Loading About section settings...</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="settings" className="mt-8">
          <h2 className="text-2xl">Salon details</h2>
          {draft ? (
            <form
              className="card-luxe mt-6 space-y-5 rounded-xl p-6"
              onSubmit={async (event) => {
                event.preventDefault();
                const { id, updated_at, ...values } = draft;
                const { error } = await supabase
                  .from("site_settings")
                  .update(values)
                  .eq("id", true);
                if (error) toast.error(error.message);
                else {
                  toast.success("Saved");
                  queryClient.invalidateQueries({ queryKey: ["site_settings"] });
                }
              }}
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Salon name"
                  value={draft.salon_name}
                  onChange={(v) => setSiteDraft({ ...draft, salon_name: v })}
                />
                <Field
                  label="Tagline"
                  value={draft.tagline}
                  onChange={(v) => setSiteDraft({ ...draft, tagline: v })}
                />
                <Field
                  label="Hero title"
                  value={draft.hero_title}
                  onChange={(v) => setSiteDraft({ ...draft, hero_title: v })}
                />
                <Field
                  label="Hero subtitle"
                  value={draft.hero_subtitle ?? ""}
                  onChange={(v) => setSiteDraft({ ...draft, hero_subtitle: v })}
                />
                <Field
                  label="Phone"
                  value={draft.phone ?? ""}
                  onChange={(v) => setSiteDraft({ ...draft, phone: v })}
                />
                <Field
                  label="WhatsApp"
                  value={draft.whatsapp ?? ""}
                  onChange={(v) => setSiteDraft({ ...draft, whatsapp: v })}
                />
                <Field
                  label="Email"
                  value={draft.email ?? ""}
                  onChange={(v) => setSiteDraft({ ...draft, email: v })}
                />
                <Field
                  label="Instagram URL"
                  value={draft.instagram_url ?? ""}
                  onChange={(v) => setSiteDraft({ ...draft, instagram_url: v })}
                />
              </div>
              <Field
                label="Address"
                textarea
                value={draft.address ?? ""}
                onChange={(v) => setSiteDraft({ ...draft, address: v })}
              />
              <Field
                label="Google Maps embed URL"
                value={draft.maps_embed_url ?? ""}
                onChange={(v) => setSiteDraft({ ...draft, maps_embed_url: v })}
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <ImageField
                  label="Logo"
                  path={draft.logo_path ?? null}
                  onChange={(p) => setSiteDraft({ ...draft, logo_path: p })}
                />
                <ImageField
                  label="Hero image"
                  path={draft.hero_image_path ?? null}
                  onChange={(p) => setSiteDraft({ ...draft, hero_image_path: p })}
                />
                <ImageField
                  label="Men image"
                  path={draft.men_image_path ?? null}
                  onChange={(p) => setSiteDraft({ ...draft, men_image_path: p })}
                />
                <ImageField
                  label="Women image"
                  path={draft.women_image_path ?? null}
                  onChange={(p) => setSiteDraft({ ...draft, women_image_path: p })}
                />
              </div>
              <Button type="submit">Save settings</Button>
            </form>
          ) : null}
        </TabsContent>
      </Tabs>
    </div>
  );
}
