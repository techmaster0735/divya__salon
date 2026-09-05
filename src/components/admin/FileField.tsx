import { useState } from "react";
import { toast } from "sonner";

import { uploadMedia } from "@/lib/media";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

/** Uploads any file (image, video or document) to the media library. */
export function FileField({
  label = "File",
  accept = "image/*,video/*,.pdf,.doc,.docx,.ppt,.pptx,.zip",
  path,
  onChange,
}: {
  label?: string;
  accept?: string;
  path: string | null;
  onChange: (path: string | null) => void;
}) {
  const [busy, setBusy] = useState(false);
  const inputId = `upload-${label.replace(/\s+/g, "-").toLowerCase()}`;

  /**
   * iPhone recordings are often HEVC/H.265, which Windows Chrome and many PCs
   * cannot decode. We probe the file locally and warn before it goes live.
   */
  async function warnIfUnsupportedVideo(file: File) {
    if (!file.type.startsWith("video/")) return;
    const url = URL.createObjectURL(file);
    const playable = await new Promise<boolean>((resolve) => {
      const el = document.createElement("video");
      el.preload = "metadata";
      const done = (ok: boolean) => {
        el.removeAttribute("src");
        resolve(ok);
      };
      el.onloadeddata = () => done(true);
      el.onerror = () => done(false);
      setTimeout(() => done(true), 6000);
      el.src = url;
    });
    URL.revokeObjectURL(url);
    if (!playable) {
      toast.warning(
        "This video may not play on Windows PCs (likely H.265/HEVC). Export or convert it to H.264 MP4 for best compatibility.",
        { duration: 8000 },
      );
    }
  }

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    try {
      await warnIfUnsupportedVideo(file);
      onChange(await uploadMedia(file));
      toast.success("Uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex flex-wrap items-center gap-3">
        <input
          id={inputId}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(event) => handleFile(event.target.files?.[0])}
        />
        <Button asChild type="button" variant="outline" size="sm" disabled={busy}>
          <label htmlFor={inputId}>{busy ? "Uploading…" : "Choose file"}</label>
        </Button>
        <span className="text-muted-foreground min-w-0 flex-1 truncate text-xs">
          {path ?? "No file selected"}
        </span>
        {path ? (
          <Button type="button" variant="ghost" size="sm" onClick={() => onChange(null)}>
            Remove
          </Button>
        ) : null}
      </div>
    </div>
  );
}
