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
export const supportPhone = "+27 83 242 7998";

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

export const contactLocations: ContactLocation[] = [
  {
    title: "South Africa Hub",
    addressLines: [
      "206 Rosies Place Street",
      "Glen Austin AH, Midrand",
      "Johannesburg, South Africa",
    ],
    detail:
      "Programme planning, school partnerships, bulk orders, and Prime Book enquiries.",
    icon: MapPin,
  },
  {
    title: "Zimbabwe Hub",
    addressLines: [
      "16 Mahogany Avenue",
      "Rhodene, Masvingo",
      "Zimbabwe",
    ],
    detail:
      "Regional support, RIRC coordination, competition teams, and parent programme enquiries.",
    icon: MapPin,
  },
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
    id: "prime-book-student",
    name: "Prime Book Student 14",
    category: "Prime Book Laptops",
    price: 299,
    compareAt: 329,
    shortDescription:
      "A dependable education-focused laptop built for classwork, coding labs, and everyday digital learning.",
    imageSrc: "https://picsum.photos/seed/prime-book-student/900/720",
    rating: 4.8,
    reviews: 124,
    seed: "prime-book-student",
    badge: "Best for Students",
    features: ["4GB RAM", "128GB SSD", "14-inch FHD display"],
  },
  {
    id: "prime-book-standard",
    name: "Prime Book Standard 14",
    category: "Prime Book Laptops",
    price: 399,
    compareAt: 449,
    shortDescription:
      "Balanced performance for schools, tutors, and growing teams that need a stronger daily work machine.",
    imageSrc: "https://picsum.photos/seed/prime-book-standard/900/720",
    rating: 4.9,
    reviews: 89,
    seed: "prime-book-standard",
    badge: "Most Popular",
    features: ["8GB RAM", "256GB SSD", "Carry bag included"],
  },
  {
    id: "robotics-starter-lab",
    name: "Robotics Starter Lab Kit",
    category: "Robotics Kits",
    price: 179,
    compareAt: 210,
    shortDescription:
      "Starter hardware, build guides, and challenge cards for beginner robotics sessions and school clubs.",
    imageSrc: "https://picsum.photos/seed/robotics-starter-lab/900/720",
    rating: 4.7,
    reviews: 63,
    seed: "robotics-starter-lab",
    features: ["Motors and chassis", "Learning guide", "Sensor-ready"],
  },
  {
    id: "classroom-sensor-pack",
    name: "Classroom Sensor Pack",
    category: "Sensors",
    price: 79,
    compareAt: 95,
    shortDescription:
      "A curated set of distance, light, and motion sensors for electronics and robotics experiments.",
    imageSrc: "https://picsum.photos/seed/classroom-sensor-pack/900/720",
    rating: 4.6,
    reviews: 51,
    seed: "classroom-sensor-pack",
    features: ["Ultrasonic", "Light sensor", "Motion sensor"],
  },
  {
    id: "microcontroller-duo",
    name: "Microcontroller Duo Bundle",
    category: "Development Boards",
    price: 112,
    compareAt: 128,
    shortDescription:
      "Two classroom-friendly boards for coding, automation, and practical prototyping projects.",
    imageSrc: "https://picsum.photos/seed/microcontroller-duo/900/720",
    rating: 4.8,
    reviews: 74,
    seed: "microcontroller-duo",
    features: ["Dual boards", "USB cables", "Project cards"],
  },
  {
    id: "electronics-practice-bundle",
    name: "Electronics Practice Bundle",
    category: "Electronics",
    price: 68,
    compareAt: 82,
    shortDescription:
      "Breadboards, resistors, LEDs, and wiring essentials for repeated classroom experimentation.",
    imageSrc: "https://picsum.photos/seed/electronics-practice-bundle/900/720",
    rating: 4.5,
    reviews: 39,
    seed: "electronics-practice-bundle",
    features: ["Breadboard", "LED assortment", "Starter components"],
  },
  {
    id: "rirc-competition-mat",
    name: "RIRC Practice Competition Mat",
    category: "Competition Gear",
    price: 145,
    compareAt: 165,
    shortDescription:
      "A durable practice surface for team rehearsals, challenge mapping, and competition setup drills.",
    imageSrc: "https://picsum.photos/seed/rirc-competition-mat/900/720",
    rating: 4.7,
    reviews: 22,
    seed: "rirc-competition-mat",
    features: ["Foldable", "Printed challenge zones", "Coach notes included"],
  },
  {
    id: "coding-workbook-pack",
    name: "Coding Workbook Pack",
    category: "Learning Resources",
    price: 54,
    compareAt: 64,
    shortDescription:
      "Printed learner journals and challenge sheets for coding classes, reflection, and project planning.",
    imageSrc: "https://picsum.photos/seed/coding-workbook-pack/900/720",
    rating: 4.6,
    reviews: 44,
    seed: "coding-workbook-pack",
    features: ["12 learner books", "Progress trackers", "Project prompts"],
  },
  {
    id: "ai-camera-module",
    name: "AI Vision Camera Module",
    category: "Sensors",
    price: 129,
    compareAt: 149,
    shortDescription:
      "A classroom-friendly entry point into computer vision experiments and AI-powered robotics projects.",
    imageSrc: "https://picsum.photos/seed/ai-camera-module/900/720",
    rating: 4.8,
    reviews: 31,
    seed: "ai-camera-module",
    features: ["Vision module", "Mounting kit", "Starter examples"],
  },
];

export const shopCategories = [
  "All",
  "Prime Book Laptops",
  "Robotics Kits",
  "Sensors",
  "Development Boards",
  "Electronics",
  "Competition Gear",
  "Learning Resources",
] as const;

export const socialProof = [
  { label: "Average cohort size", value: "24 learners" },
  { label: "Typical programme cycle", value: "8-12 weeks" },
  { label: "Bulk order support", value: "Schools and NGOs" },
];
