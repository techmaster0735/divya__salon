import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { settingsQuery } from "@/lib/salon";
import { Media } from "@/lib/media";

// Module scope: survives client-side navigation, resets on a full page load/refresh.
let splashPlayed = false;

const DURATION = 3200;

export function Splash() {
  const [visible, setVisible] = useState(!splashPlayed);
  const { data: settings } = useQuery(settingsQuery);

  useEffect(() => {
    if (!visible) return;
    splashPlayed = true;
    const timer = setTimeout(() => setVisible(false), DURATION);
    return () => clearTimeout(timer);
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className="bg-background animate-intro-curtain fixed inset-0 z-100 flex items-center justify-center overflow-hidden"
      aria-hidden="true"
    >
      {/* expanding gold rings */}
      <span className="border-primary/40 animate-intro-ring pointer-events-none absolute size-[22rem] rounded-full border sm:size-[34rem]" />
      <span
        className="border-primary/20 animate-intro-ring pointer-events-none absolute size-[22rem] rounded-full border sm:size-[34rem]"
        style={{ animationDelay: "320ms" }}
      />

      <div className="relative flex flex-col items-center gap-6 px-8">
        <div className="animate-intro-logo relative">
          {settings?.logo_path ? (
            <Media
              path={settings.logo_path}
              alt=""
              eager
              width={480}
              className="h-56 w-56 object-contain sm:h-80 sm:w-80"
            />
          ) : (
            <span className="gold-text font-display text-5xl tracking-[0.3em]">
              {(settings?.salon_name ?? "DIVYA LUXE").toUpperCase()}
            </span>
          )}
          {/* gold light sweep across the mark */}
          <span className="pointer-events-none absolute inset-0 overflow-hidden">
            <span className="via-primary/35 animate-intro-sweep absolute inset-y-0 -left-1/3 w-1/2 bg-gradient-to-r from-transparent to-transparent" />
          </span>
        </div>

        <div className="bg-primary/60 animate-intro-line h-px w-48 origin-center" />

        <p className="text-muted-foreground animate-intro-word text-[0.65rem] tracking-[0.45em] uppercase">
          {settings?.tagline ?? "Premium Grooming & Beauty"}
        </p>
      </div>
    </div>
  );
}
