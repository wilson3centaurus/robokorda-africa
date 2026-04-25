import {
  BatteryCharging,
  BookOpenText,
  Compass,
  Cpu,
  Layers3,
  Laptop,
  Smartphone,
  ShieldCheck,
  Wifi,
} from "lucide-react";
import type { FAQItem } from "@/data/site";
import type { ProductFeature } from "@/lib/page-types";

export type PrimeBookModel = {
  id: string;
  name: string;
  tagline: string;
  price: number; // USD
  priceZWG?: number; // ZiG
  connectivity: string;
  specs: { label: string; value: string }[];
  highlights: string[];
  badge?: string;
  imageSrc: string;
  bestFor: string;
};

export const primeBookModels: PrimeBookModel[] = [
  {
    id: "neo",
    name: "PrimeBook Neo",
    tagline: "Entry-level Android laptop for every learner",
    price: 149,
    priceZWG: 210000,
    connectivity: "Wi-Fi",
    badge: "Best Value",
    specs: [
      { label: "OS", value: "PrimeOS (Android-based)" },
      { label: "Processor", value: "ARM Octa-Core" },
      { label: "RAM", value: "4GB" },
      { label: "Storage", value: "64GB eMMC" },
      { label: "Display", value: '11.6" HD (1366×768)' },
      { label: "Battery", value: "6–8 hrs" },
      { label: "Connectivity", value: "Wi-Fi 5 + Bluetooth 4.2" },
      { label: "Ports", value: "USB-A ×2, USB-C, MicroSD" },
    ],
    highlights: [
      "Runs PrimeOS — Android apps natively",
      "Lightweight at ~1.2 kg",
      "Rugged classroom-ready chassis",
      "Google Play Store compatible",
    ],
    bestFor: "Primary & secondary students, first-time laptop users",
    imageSrc: "/images/primebooks/primebook-2-neo.jpg",
  },
  {
    id: "wifi",
    name: "PrimeBook WiFi",
    tagline: "Balanced Android laptop for school & work",
    price: 199,
    priceZWG: 280000,
    connectivity: "Wi-Fi",
    badge: "Most Popular",
    specs: [
      { label: "OS", value: "PrimeOS (Android-based)" },
      { label: "Processor", value: "MediaTek Octa-Core" },
      { label: "RAM", value: "4GB" },
      { label: "Storage", value: "128GB" },
      { label: "Display", value: '14" HD IPS (1366×768)' },
      { label: "Battery", value: "8–10 hrs" },
      { label: "Connectivity", value: "Wi-Fi 5 + Bluetooth 5.0" },
      { label: "Ports", value: "USB-A ×2, USB-C, HDMI, MicroSD" },
    ],
    highlights: [
      "Full Android experience on a laptop",
      "Slim 14-inch IPS display",
      "Fast 128GB storage",
      "Ideal for coding apps & multimedia",
    ],
    bestFor: "High school & tertiary students, teachers, small businesses",
    imageSrc: "/images/primebooks/primebook-wifi.jpg",
  },
  {
    id: "4g",
    name: "PrimeBook 4G",
    tagline: "Stay connected everywhere with built-in 4G",
    price: 249,
    priceZWG: 350000,
    connectivity: "4G LTE + Wi-Fi",
    badge: "For Remote Areas",
    specs: [
      { label: "OS", value: "PrimeOS (Android-based)" },
      { label: "Processor", value: "MediaTek Octa-Core" },
      { label: "RAM", value: "4GB" },
      { label: "Storage", value: "128GB" },
      { label: "Display", value: '14" HD IPS (1366×768)' },
      { label: "Battery", value: "8–10 hrs" },
      { label: "Connectivity", value: "4G LTE (nano-SIM) + Wi-Fi 5 + BT 5.0" },
      { label: "Ports", value: "USB-A ×2, USB-C, HDMI, MicroSD, SIM slot" },
    ],
    highlights: [
      "Built-in 4G LTE — no dongle needed",
      "Works anywhere with mobile data",
      "Same performance as PrimeBook WiFi",
      "Perfect for rural schools & field work",
    ],
    bestFor: "Rural schools, field educators, remote workers",
    imageSrc: "/images/primebooks/primebook-4G.jpg",
  },
  {
    id: "pro",
    name: "PrimeBook Pro",
    tagline: "Upgraded performance for power users",
    price: 299,
    priceZWG: 420000,
    connectivity: "Wi-Fi + optional 4G",
    specs: [
      { label: "OS", value: "PrimeOS (Android-based)" },
      { label: "Processor", value: "MediaTek Helio G99 / Octa-Core" },
      { label: "RAM", value: "8GB" },
      { label: "Storage", value: "256GB" },
      { label: "Display", value: '15.6" FHD IPS (1920×1080)' },
      { label: "Battery", value: "10–12 hrs" },
      { label: "Connectivity", value: "Wi-Fi 6 + BT 5.2 + optional 4G" },
      { label: "Ports", value: "USB-A ×3, USB-C ×2, HDMI, MicroSD" },
    ],
    highlights: [
      "8GB RAM for multitasking",
      "Full HD 15.6\" IPS display",
      "256GB fast storage",
      "Runs all Android productivity apps",
    ],
    bestFor: "University students, IT professionals, school administrators",
    imageSrc: "/images/primebooks/primebook-2-pro.jpg",
  },
];

export const primeBookFeatures: ProductFeature[] = [
  {
    title: "Built for Africa",
    description:
      "Designed for real African learning environments — handles power fluctuations, dusty classrooms, and everyday tough use.",
    icon: ShieldCheck,
    seed: "prime-built-for-africa",
    imageSrc: "/images/primebooks/features/feature1.jpg",
  },
  {
    title: "Android-Powered Learning",
    description:
      "Runs PrimeOS — a full Android-based OS. Access Google Play, educational apps, coding tools, and Google Workspace out of the box.",
    icon: Cpu,
    seed: "prime-android",
    imageSrc: "/images/primebooks/features/feature2.jpg",
  },
  {
    title: "All-Day Battery",
    description:
      "From 6 to 12 hours of battery life depending on the model — no need to stay near a power socket.",
    icon: BatteryCharging,
    seed: "prime-battery",
    imageSrc: "/images/primebooks/features/feature3.jpg",
  },
  {
    title: "4G Connectivity",
    description:
      "Select models have a built-in 4G LTE modem — connect with a SIM card in areas with no Wi-Fi network.",
    icon: Smartphone,
    seed: "prime-4g",
    imageSrc: "/images/primebooks/features/feature4.jpg",
  },
  {
    title: "Portable & Light",
    description:
      "Slim enough for a school bag, light enough for daily commutes, robust enough for active student life.",
    icon: Compass,
    seed: "prime-portable",
    imageSrc: "/images/primebooks/features/feature5.jpg",
  },
  {
    title: "School-Ready Software",
    description:
      "Comes with PrimeOS pre-installed — Google Classroom, YouTube Kids, coding environments, and classroom apps work out of the box.",
    icon: Laptop,
    seed: "prime-software",
    imageSrc: "/images/primebooks/features/feature6.jpg",
  },
];

export const primeBookFaqs: FAQItem[] = [
  {
    question: "What is a PrimeBook?",
    answer:
      "PrimeBook is a range of affordable, education-focused Android-based laptops distributed by Robokorda Africa. They run PrimeOS — an Android-based operating system — so students get the familiar Android app ecosystem on a full laptop form factor. Models include Neo, WiFi, 4G, and Pro.",
  },
  {
    question: "What operating system do PrimeBooks run?",
    answer:
      "PrimeBooks run PrimeOS, which is Android-based. This means you can install and use Android apps — including Google Classroom, YouTube, coding tools, and thousands of educational apps — directly on your laptop.",
  },
  {
    question: "Which model should I choose for my child?",
    answer:
      "For primary/secondary students, the PrimeBook Neo is ideal. For high school or tertiary, the WiFi model is our most popular. If your area has unreliable Wi-Fi, the 4G model is the best choice. The Pro is for university-level and professional use.",
  },
  {
    question: "What is the difference between the WiFi and 4G models?",
    answer:
      "The 4G model has a built-in SIM card slot and 4G LTE modem, allowing it to connect to the internet via a mobile data SIM — no Wi-Fi router needed. Both models are otherwise identical in performance.",
  },
  {
    question: "Can schools order PrimeBooks in bulk?",
    answer:
      "Yes. We offer bulk pricing, school deployment support, and rollout planning for institutions. Send your inquiry through the form and our sales team will contact you within 1 hour.",
  },
  {
    question: "What warranty comes with a PrimeBook?",
    answer:
      "All PrimeBook models come with a 1-year warranty coordinated through the Robokorda technical team. Our team responds within 24 hours for support queries.",
  },
  {
    question: "Are prices in USD or ZiG?",
    answer:
      "Prices are listed in USD as a reference. ZiG equivalents are shown alongside each model. Final pricing at point of sale may vary based on current exchange rates.",
  },
];
