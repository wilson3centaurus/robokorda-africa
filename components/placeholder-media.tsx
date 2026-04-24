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
  fill?: boolean; // skip aspect-ratio — fills parent absolutely
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
  fill = false,
  objectFit = "cover",
  objectPosition,
  className,
  children,
}: PlaceholderMediaProps) {
  const isVideo = mode === "hero" || mode === "video" || mode === "wide";
  const Icon = isVideo ? PlayCircle : Camera;
  const fallbackUrl = imageUrl ?? `https://picsum.photos/seed/${seed}/1400/1000`;

  // When fill=true (hero background) we don't set aspect-ratio — the container
  // fills its positioned parent via className (absolute inset-0)
  const style = fill ? undefined : { aspectRatio: aspectRatio ?? aspectRatios[mode] };

  return (
    <div
      className={cn(
        "group relative isolate overflow-hidden",
        fill ? "" : "rounded-2xl border border-[rgba(38,133,255,0.18)]",
        videoUrl ? "" : "diagonal-stripes",
        "bg-[linear-gradient(145deg,#040d1e,#071428)]",
        className,
      )}
      style={style}
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
            clean ? "" : "opacity-30 grayscale contrast-125 saturate-0",
          )}
          style={{ objectPosition }}
        />
      )}
      {!videoUrl && !clean ? (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,102,255,0.12),transparent_36%),linear-gradient(180deg,rgba(2,8,16,0.2),rgba(2,8,16,0.45))]" />
          <div className="absolute inset-[12px] rounded-xl border border-[rgba(0,102,255,0.14)]" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center text-white">
            {children ? (
              children
            ) : (
              <>
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(0,102,255,0.3)] bg-[rgba(0,102,255,0.1)] shadow-[0_0_20px_rgba(0,102,255,0.2)]">
                  <Icon className="h-7 w-7 text-[#7eb8ff]" aria-hidden="true" />
                </span>
                <p className="max-w-xs text-[10px] font-semibold uppercase tracking-[0.24em] text-[#4d7499]">
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
