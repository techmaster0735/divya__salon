import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

export const MEDIA_BUCKET = "media";

const SIGN_TTL_SECONDS = 60 * 60 * 8;

/**
 * Signing every image separately meant one network round-trip per <img>, so
 * pictures trickled in. Requests made in the same tick are batched into a
 * single createSignedUrls() call and the resulting URLs are memoised.
 */
const urlCache = new Map<string, string>();
let pending: { path: string; resolve: (url: string) => void; reject: (e: unknown) => void }[] = [];
let flushScheduled = false;

async function flushBatch() {
  const batch = pending;
  pending = [];
  flushScheduled = false;
  const paths = [...new Set(batch.map((b) => b.path))];

  try {
    const { data, error } = await supabase.storage
      .from(MEDIA_BUCKET)
      .createSignedUrls(paths, SIGN_TTL_SECONDS);
    if (error) throw error;
    const map = new Map<string, string>();
    for (const item of data ?? []) {
      if (item.path && item.signedUrl) map.set(item.path, item.signedUrl);
    }
    for (const [p, u] of map) urlCache.set(p, u);
    for (const job of batch) {
      const url = map.get(job.path);
      if (url) job.resolve(url);
      else job.reject(new Error(`Could not sign ${job.path}`));
    }
  } catch (err) {
    for (const job of batch) job.reject(err);
  }
}

export function createMediaUrl(path: string) {
  const cached = urlCache.get(path);
  if (cached) return Promise.resolve(cached);

  return new Promise<string>((resolve, reject) => {
    pending.push({ path, resolve, reject });
    if (!flushScheduled) {
      flushScheduled = true;
      queueMicrotask(flushBatch);
    }
  });
}

export function useMediaUrl(path?: string | null) {
  return useQuery({
    queryKey: ["media", path],
    enabled: Boolean(path),
    staleTime: 1000 * 60 * 60 * 4,
    gcTime: 1000 * 60 * 60 * 8,
    retry: 1,
    initialData: path ? urlCache.get(path) : undefined,
    queryFn: () => createMediaUrl(path as string),
  });
}

export async function uploadMedia(file: File) {
  const maxBytes = file.type.startsWith("video/")
    ? 100 * 1024 * 1024
    : file.type.startsWith("image/")
      ? 10 * 1024 * 1024
      : 25 * 1024 * 1024;
  if (file.size > maxBytes) {
    const maxMb = Math.round(maxBytes / 1024 / 1024);
    throw new Error(`File is too large. Maximum size is ${maxMb} MB.`);
  }

  const allowed = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "video/mp4",
    "video/webm",
    "video/quicktime",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/zip",
    "text/plain",
  ];
  if (file.type && !allowed.includes(file.type)) {
    throw new Error("This file type is not supported.");
  }

  const ext =
    file.name
      .split(".")
      .pop()
      ?.toLowerCase()
      .replace(/[^a-z0-9]/g, "") || "bin";
  const path = `uploads/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
    upsert: false,
    ...(file.type ? { contentType: file.type } : {}),
  });
  if (error) throw error;
  return path;
}

export async function deleteMedia(path: string) {
  await supabase.storage.from(MEDIA_BUCKET).remove([path]);
}

type MediaProps = {
  path?: string | null | undefined;
  alt: string;
  className?: string;
  eager?: boolean;
  /** Rendered width hint in CSS px — used to request a smaller, compressed variant. */
  width?: number;
  sizes?: string;
};

/**
 * Storage can resize/recompress images on the fly. Not every project has the
 * transformer enabled, so the <img> falls back to the original on error.
 */
function transformed(url: string, width: number) {
  if (!url.includes("/object/sign/")) return null;
  const rendered = url.replace("/object/sign/", "/render/image/sign/");
  const joiner = rendered.includes("?") ? "&" : "?";
  return `${rendered}${joiner}width=${width}&quality=72&resize=contain`;
}

/** Renders an image stored in the backend media library. */
export function Media({ path, alt, className, eager, width = 900, sizes }: MediaProps) {
  const { data: url } = useMediaUrl(path);

  if (!url) {
    return <div className={cn("bg-muted animate-pulse", className)} aria-hidden="true" />;
  }

  const optimised = transformed(url, width);

  return (
    <img
      src={optimised ?? url}
      {...(optimised
        ? {
            srcSet: `${transformed(url, Math.round(width / 2))} ${Math.round(width / 2)}w, ${optimised} ${width}w`,
          }
        : {})}
      sizes={sizes ?? `(max-width: 768px) 100vw, ${width}px`}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : "auto"}
      decoding="async"
      onError={(event) => {
        const img = event.currentTarget;
        if (img.src !== url) {
          img.removeAttribute("srcset");
          img.src = url;
        }
      }}
      className={className}
    />
  );
}

/** Renders a video stored in the backend media library. */
export function MediaVideo({ path, className }: { path: string; className?: string }) {
  const { data: url } = useMediaUrl(path);

  if (!url) {
    return <div className={cn("bg-muted animate-pulse", className)} aria-hidden="true" />;
  }

  return <video src={url} controls preload="metadata" className={className} />;
}

/** Download link for any file stored in the backend media library. */
export function useMediaDownload(path: string) {
  return useMediaUrl(path);
}
