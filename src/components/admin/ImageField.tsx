import { useState } from "react";
import { toast } from "sonner";

import { Media, uploadMedia } from "@/lib/media";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function ImageField({
  label = "Image",
  path,
  onChange,
}: {
  label?: string;
  path: string | null;
  onChange: (path: string | null) => void;
}) {
  const [busy, setBusy] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    try {
      onChange(await uploadMedia(file));
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-4">
        <div className="bg-muted size-20 overflow-hidden rounded-lg">
          {path ? <Media path={path} alt="" className="size-20 object-cover" /> : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            id={`file-${label}`}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => handleFile(event.target.files?.[0])}
          />
          <Button asChild type="button" variant="outline" size="sm" disabled={busy}>
            <label htmlFor={`file-${label}`}>{busy ? "Uploading…" : "Upload"}</label>
          </Button>
          {path ? (
            <Button type="button" variant="ghost" size="sm" onClick={() => onChange(null)}>
              Remove
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
