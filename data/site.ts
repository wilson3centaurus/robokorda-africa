import type { LucideIcon } from "lucide-react";
import {
  Blocks,
  GraduationCap,
  Handshake,
  MapPin,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

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

export const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/robokordaafrica",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/robokordaafrica",
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
  { label: "Skills", href: "#skills", sectionId: "skills" },
  { label: "Why Us", href: "#why-us", sectionId: "why-us" },
  { label: "Partners", href: "#partners", sectionId: "partners" },
  { label: "Gallery", href: "#gallery", sectionId: "gallery" },
  { label: "Contact", href: "#contact", sectionId: "contact" },
  { label: "RIRC", href: "/rirc" },
  { label: "Prime Book", href: "/prime-book" },
  { label: "Shop", href: "/shop" },
];


export const footerHighlights = [
  {
    title: "Digital creators in the making",
    description:
      "Robokorda helps learners move from passive technology use into purposeful creation and innovation.",
    icon: Sparkles,
  },
  {
    title: "Premium STEM delivery",
    description:
      "Every programme combines coding, robotics, design, and communication in a polished learning experience.",
    icon: Blocks,
  },
  {
    title: "Built for long-term relevance",
    description:
      "Learners gain technical capability, confidence, teamwork, and exposure to real innovation pathways.",
    icon: ShieldCheck,
  },
];

export const aboutPillars: ValueCard[] = [
  {
    title: "Future-facing education",
    description:
      "Robokorda Africa equips learners for a world shaped by automation, AI, and digital problem-solving.",
    icon: GraduationCap,
  },
  {
    title: "Hands-on delivery",
    description:
      "Projects, prototypes, and demonstrations keep learning tangible and memorable.",
    icon: Blocks,
  },
  {
    title: "Strong learning culture",
    description:
      "Students are coached to think critically, communicate clearly, and take ownership of outcomes.",
    icon: Handshake,
  },
  {
    title: "Regional ambition",
    description:
      "The model is designed to grow across schools and innovation communities throughout Africa.",
    icon: Sparkles,
  },
];

export const shopProducts: Product[] = [
  {
    id: "primebook-neo",
    name: "PrimeBook Neo",
    category: "Prime Book Laptops",
    price: 149,
    compareAt: 179,
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
    price: 179,
    compareAt: 210,
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
