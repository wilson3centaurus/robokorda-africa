import Image from "next/image";
import { Camera, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type PlaceholderMediaProps = {
  mode: "hero" | "card" | "gallery" | "product" | "partner" | "video" | "wide";
  label: string;
  seed?: string;
  aspectRatio?: string;
  imageUrl?: string;
  videoUrl?: string;
  clean?: boolean;
  objectFit?: "cover" | "contain";
  objectPosition?: string;
  className?: string;
  children?: React.ReactNode;
};

const aspectRatios: Record<PlaceholderMediaProps["mode"], string> = {
  hero: "16 / 10",
  card: "4 / 3",
  gallery: "1 / 1",
  product: "4 / 3",
  partner: "16 / 10",
  video: "16 / 9",
  wide: "16 / 9",
};

export function PlaceholderMedia({
  mode,
  label,
  seed = label.toLowerCase().replace(/\s+/g, "-"),
  aspectRatio,
  imageUrl,
  videoUrl,
  clean = false,
  objectFit = "cover",
  objectPosition,
  className,
  children,
}: PlaceholderMediaProps) {
  const isVideo = mode === "hero" || mode === "video" || mode === "wide";
  const Icon = isVideo ? PlayCircle : Camera;
  const fallbackUrl = imageUrl ?? `https://picsum.photos/seed/${seed}/1400/1000`;

  return (
    <div
      className={cn(
        "group relative isolate overflow-hidden rounded-[28px] border border-white/12 bg-[linear-gradient(180deg,#0b2340,#0d63c9)]",
        videoUrl ? "" : "diagonal-stripes",
        className,
      )}
      style={{ aspectRatio: aspectRatio ?? aspectRatios[mode] }}
      role="img"
      aria-label={label}
    >
      {videoUrl ? (
        <video
          className={cn(
            "absolute inset-0 h-full w-full",
            objectFit === "contain" ? "object-contain" : "object-cover",
          )}
          style={{ objectPosition }}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      ) : (
        <Image
          src={fallbackUrl}
          alt=""
          fill
          unoptimized={clean || fallbackUrl.startsWith("/")}
          sizes="(min-width: 1280px) 1200px, (min-width: 768px) 80vw, 100vw"
          className={cn(
            "absolute inset-0 h-full w-full transition duration-500 group-hover:scale-[1.04]",
            objectFit === "contain" ? "object-contain" : "object-cover",
            clean ? "" : "opacity-28 grayscale contrast-125 saturate-0",
          )}
          style={{ objectPosition }}
        />
      )}
      {!videoUrl && !clean ? (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_36%),linear-gradient(180deg,rgba(7,20,40,0.18),rgba(7,20,40,0.36))]" />
          <div className="absolute inset-[14px] rounded-[22px] border border-white/18" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center text-white">
            {children ? (
              children
            ) : (
              <>
                <span className="flex h-18 w-18 items-center justify-center rounded-full border border-white/22 bg-white/12 shadow-[0_14px_30px_rgba(4,16,32,0.26)]">
                  <Icon className="h-9 w-9" aria-hidden="true" />
                </span>
                <p className="max-w-xs text-xs font-semibold uppercase tracking-[0.24em] text-white/88">
                  {label}
                </p>
              </>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}
