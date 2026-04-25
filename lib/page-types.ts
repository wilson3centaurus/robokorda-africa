import type { LucideIcon } from "lucide-react";
import type { GalleryItem } from "@/data/site";

export type CompetitionTrack = {
  title: string;
  description: string;
  seed: string;
  icon: LucideIcon;
};

export type CountryEntry = {
  code: string;
  name: string;
};

export type PrizeTier = {
  title: string;
  amount: string;
  summary: string;
  benefits: string[];
  icon: LucideIcon;
  imageSrc?: string;
};

export type WinnerStory = {
  teamName: string;
  country: string;
  category: string;
  summary: string;
  seed: string;
  imageSrc?: string;
  awardLabel?: string;
};

export type ProductSpec = {
  label: string;
  value: string;
  icon: LucideIcon;
};

export type ProductFeature = {
  title: string;
  description: string;
  icon: LucideIcon;
  seed: string;
  imageSrc?: string;
};

export type PricingPackage = {
  title: string;
  price: number;
  description: string;
  features: string[];
  highlight?: boolean;
};

export type OrderOption = {
  title: string;
  description: string;
  cta: string;
  icon: LucideIcon;
};

export type MediaGalleryItem = GalleryItem;
