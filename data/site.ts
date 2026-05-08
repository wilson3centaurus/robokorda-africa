import type { LucideIcon } from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  sectionId?: string;
};

export type HeroStat = {
  label: string;
  value: string;
};

export type DeliveryOption = {
  title: string;
  description: string;
  detail: string;
  icon: LucideIcon;
  imageSrc: string;
  seed: string;
};

export type Course = {
  title: string;
  level: string;
  age: string;
  duration: string;
  deliveryMode: string;
  overview: string[];
  imageSrc: string;
  seed: string;
};

export type SkillTheme = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export type ValueCard = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export type PartnerCategory = {
  title: string;
  description: string;
  imageSrc: string;
  seed: string;
};

export type GalleryItem = {
  title: string;
  subtitle: string;
  imageSrc: string;
  seed: string;
  size?: "square" | "wide" | "tall";
};

export type FAQItem = {
  question: string;
  answer: string;
};

export type ContactLocation = {
  title: string;
  addressLines: string[];
  detail: string;
  icon: LucideIcon;
};

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  compareAt?: number;
  shortDescription: string;
  imageSrc: string;
  rating: number;
  reviews: number;
  seed: string;
  badge?: string;
  features: string[];
};

export const supportEmail = "roy@robokorda.com";
export const supportPhone = "+27 83 242 7998";

export const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/share/1Hdyjxem5r/",
  },
  {
    label: "Instagram ZW",
    href: "https://www.instagram.com/robokordazw?igsh=b2ZlbnUwbWwydXU=",
  },
  {
    label: "Instagram Africa",
    href: "https://www.instagram.com/robokorda_africa?igsh=Z2I4aDUwYTFpaTlo",
  },
  {
    label: "TikTok",
    href: "https://vm.tiktok.com/ZS9LCLFqSpVhw-j1eJn/",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/robokorda-africa",
  },
] as const;

export const navItems: NavItem[] = [
  { label: "Home", href: "#home", sectionId: "home" },
  { label: "About Us", href: "#about", sectionId: "about" },
  { label: "Our Courses", href: "#courses", sectionId: "courses" },
  { label: "Short Courses", href: "/short-courses" },
  { label: "Skills", href: "#skills", sectionId: "skills" },
  { label: "Why Us", href: "#why-us", sectionId: "why-us" },
  { label: "Partners", href: "#partners", sectionId: "partners" },
  { label: "Gallery", href: "#gallery", sectionId: "gallery" },
  { label: "Contact", href: "#contact", sectionId: "contact" },
  { label: "RIRC", href: "/rirc" },
  { label: "Prime Book", href: "/prime-book" },
  { label: "Shop", href: "/shop" },
];




export const shopProducts: Product[] = [
  {
    id: "primebook-neo",
    name: "PrimeBook Neo",
    category: "Prime Book Laptops",
    price: 230,
    compareAt: 250,
    shortDescription:
      "Entry-level Android laptop for every learner. PrimeOS (Android-based), ARM Octa-Core, 4GB RAM, 64GB.",
    imageSrc: "/images/primebooks/primebook-2-neo.jpg",
    rating: 4.8,
    reviews: 112,
    seed: "primebook-neo",
    badge: "Best Value",
    features: ["4GB RAM", "64GB Storage", "Android-based PrimeOS"],
  },
  {
    id: "robokorda-robotics-kit",
    name: "Robokorda Robotics Kit",
    category: "Robotics Kits",
    price: 40,
    compareAt: 50,
    shortDescription:
      "Complete classroom robotics kit: chassis, motors, sensors, and learning guide.",
    imageSrc: "/images/shop/robokorda-robotics-kit.jpg",
    rating: 4.7,
    reviews: 63,
    seed: "robokorda-robotics-kit",
    badge: "Classroom Kit",
    features: ["Motors & chassis", "Sensor-ready", "Learning guide included"],
  },
  {
    id: "primary-textbooks",
    name: "Primary School Textbooks",
    category: "Learning Resources",
    price: 15,
    compareAt: 20,
    shortDescription:
      "Robokorda primary school robotics & coding curriculum textbook set.",
    imageSrc: "/images/shop/primary-school-robotics-textbooks.jpg",
    rating: 4.9,
    reviews: 88,
    seed: "primary-textbooks",
    badge: "Curriculum",
    features: ["Robotics & coding", "Primary level", "Full curriculum set"],
  },
];

export const shopCategories = [
  "All",
  "Prime Book Laptops",
  "Robotics Kits",
  "Learning Resources",
] as const;

export const socialProof = [
  { label: "Average cohort size", value: "24 learners" },
  { label: "Typical programme cycle", value: "8-12 weeks" },
  { label: "Bulk order support", value: "Schools and NGOs" },
];
