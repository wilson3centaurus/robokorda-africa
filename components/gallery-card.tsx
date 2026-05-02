import Image from "next/image";
import type { GalleryItem } from "@/data/site";

type GalleryCardProps = {
  item: GalleryItem;
  compact?: boolean;
  onClick?: () => void;
};

export function GalleryCard({ item, onClick }: GalleryCardProps) {
  const aspectRatio =
    item.size === "wide" ? "16 / 9" : item.size === "tall" ? "3 / 4" : "1 / 1";

  const inner = (
    <div
      className="group relative overflow-hidden rounded-[18px]"
      style={{ aspectRatio }}
    >
      <Image
        src={item.imageSrc}
        alt={item.title}
        fill
        sizes="(min-width: 1280px) 400px, (min-width: 768px) 50vw, 100vw"
        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/30" />
      <span className="absolute inset-x-0 bottom-0 translate-y-1 p-4 text-sm font-semibold text-white drop-shadow-lg opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        {item.title}
      </span>
    </div>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="block w-full cursor-zoom-in text-left"
        aria-label={`View: ${item.title}`}
      >
        {inner}
      </button>
    );
  }

  return <div className="block w-full">{inner}</div>;
}
