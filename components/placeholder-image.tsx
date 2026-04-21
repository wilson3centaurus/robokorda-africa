import { PlaceholderMedia } from "@/components/placeholder-media";

type PlaceholderImageProps = {
  label?: string;
  title?: string;
  className?: string;
  src?: string;
};

export function PlaceholderImage({
  label = "Placeholder Image",
  title,
  className,
  src,
}: PlaceholderImageProps) {
  return (
    <PlaceholderMedia
      mode="card"
      label={title ? `${label} | ${title}` : label}
      imageUrl={src}
      className={className}
    />
  );
}
