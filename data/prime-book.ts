import {
  BatteryCharging,
  BookOpenText,
  BriefcaseBusiness,
  Compass,
  Cpu,
  Layers3,
  Laptop,
  MonitorSmartphone,
  ShieldCheck,
  Smartphone,
  Wrench,
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
    name: "Prime Book Neo",
    tagline: "Entry-level learning powerhouse",
    price: 249,
    priceZWG: 350000,
    connectivity: "Wi-Fi",
    badge: "Best Value",
    specs: [
      { label: "Processor", value: "Intel Celeron N4020" },
      { label: "RAM", value: "4GB LPDDR4" },
      { label: "Storage", value: "64GB eMMC" },
      { label: "Display", value: '11.6" HD (1366×768)' },
      { label: "Battery", value: "6–8 hrs" },
      { label: "OS", value: "Windows 11 SE" },
      { label: "Connectivity", value: "Wi-Fi 5 + Bluetooth 5.0" },
      { label: "Ports", value: "USB-A, USB-C, HDMI, SD" },
    ],
    highlights: [
      "Designed for classroom use",
      "Lightweight at ~1.3 kg",
      "Drop-resistant chassis",
      "Microsoft 365 Education ready",
    ],
    bestFor: "Primary & secondary students, first-time laptop users",
    imageSrc: "https://picsum.photos/seed/primebook-neo/800/600",
  },
  {
    id: "wifi",
    name: "Prime Book WiFi",
    tagline: "Balanced performance for schools",
    price: 349,
    priceZWG: 490000,
    connectivity: "Wi-Fi",
    badge: "Most Popular",
    specs: [
      { label: "Processor", value: "Intel Core i3 (12th Gen)" },
      { label: "RAM", value: "8GB DDR4" },
      { label: "Storage", value: "128GB SSD" },
      { label: "Display", value: '14" FHD IPS (1920×1080)' },
      { label: "Battery", value: "8–10 hrs" },
      { label: "OS", value: "Windows 11 Home" },
      { label: "Connectivity", value: "Wi-Fi 6 + Bluetooth 5.2" },
      { label: "Ports", value: "2× USB-A, USB-C, HDMI, SD Card" },
    ],
    highlights: [
      "Full HD IPS display",
      "Fast SSD storage",
      "Slim & stylish 14-inch form factor",
      "Ideal for coding & multimedia",
    ],
    bestFor: "High school & tertiary students, teachers, small businesses",
    imageSrc: "https://picsum.photos/seed/primebook-wifi/800/600",
  },
  {
    id: "4g",
    name: "Prime Book 4G",
    tagline: "Stay connected everywhere, always",
    price: 449,
    priceZWG: 630000,
    connectivity: "4G LTE + Wi-Fi",
    badge: "For Remote Areas",
    specs: [
      { label: "Processor", value: "Intel Core i3 (12th Gen)" },
      { label: "RAM", value: "8GB DDR4" },
      { label: "Storage", value: "128GB SSD" },
      { label: "Display", value: '14" FHD IPS (1920×1080)' },
      { label: "Battery", value: "8–10 hrs" },
      { label: "OS", value: "Windows 11 Home" },
      { label: "Connectivity", value: "4G LTE (nano SIM) + Wi-Fi 6 + BT" },
      { label: "Ports", value: "2× USB-A, USB-C, HDMI, SD Card, SIM" },
    ],
    highlights: [
      "Built-in 4G LTE modem — no dongle needed",
      "Works in areas with no Wi-Fi",
      "Same performance as Prime Book WiFi",
      "Perfect for field work & rural classrooms",
    ],
    bestFor: "Rural schools, field educators, remote workers",
    imageSrc: "https://picsum.photos/seed/primebook-4g/800/600",
  },
  {
    id: "pro",
    name: "Prime Book Pro",
    tagline: "Professional-grade for demanding users",
    price: 599,
    priceZWG: 840000,
    connectivity: "Wi-Fi + optional 4G",
    specs: [
      { label: "Processor", value: "Intel Core i5 (12th Gen)" },
      { label: "RAM", value: "16GB DDR4" },
      { label: "Storage", value: "512GB NVMe SSD" },
      { label: "Display", value: '15.6" FHD IPS (1920×1080)' },
      { label: "Battery", value: "10–12 hrs" },
      { label: "OS", value: "Windows 11 Pro" },
      { label: "Connectivity", value: "Wi-Fi 6E + BT 5.3 + optional 4G" },
      { label: "Ports", value: "3× USB-A, 2× USB-C, HDMI, SD, RJ45" },
    ],
    highlights: [
      "Fastest model in the range",
      "16GB RAM for multitasking & development",
      "512GB NVMe SSD — lightning fast",
      "Full Windows 11 Pro license",
    ],
    bestFor: "University students, IT professionals, school administrators",
    imageSrc: "https://picsum.photos/seed/primebook-pro/800/600",
  },
];

export const primeBookFeatures: ProductFeature[] = [
  {
    title: "Built for Africa",
    description:
      "Designed for real African learning environments — handles power fluctuations, dusty classrooms, and everyday tough use.",
    icon: ShieldCheck,
    seed: "prime-built-for-africa",
  },
  {
    title: "Classroom Performance",
    description:
      "Fast enough for coding tools, Google Classroom, Office 365, video lessons, and research — all day, every day.",
    icon: BookOpenText,
    seed: "prime-classroom-performance",
  },
  {
    title: "All-Day Battery",
    description:
      "From 6 to 12 hours of battery life depending on the model — no need to stay near a power socket.",
    icon: BatteryCharging,
    seed: "prime-battery",
  },
  {
    title: "4G Connectivity",
    description:
      "Select models have a built-in 4G LTE modem — connect with a SIM card in areas with no Wi-Fi network.",
    icon: Smartphone,
    seed: "prime-4g",
  },
  {
    title: "Portable & Light",
    description:
      "Slim enough for a school bag, light enough for daily commutes, robust enough for active student life.",
    icon: Compass,
    seed: "prime-portable",
  },
  {
    title: "School-Ready Software",
    description:
      "Ships with Windows 11 — Microsoft 365 Education, coding environments, and classroom apps work out of the box.",
    icon: Laptop,
    seed: "prime-software",
  },
];

export const primeBookFaqs: FAQItem[] = [
  {
    question: "What is a Prime Book?",
    answer:
      "Prime Book is a range of affordable, education-focused laptops distributed by Robokorda Africa. The models — Neo, WiFi, 4G, and Pro — cover students from primary level all the way to university and professionals.",
  },
  {
    question: "Which model should I choose for my child?",
    answer:
      "For primary/secondary students, the Prime Book Neo is ideal. For high school or tertiary, the WiFi model is our most popular. If your area has unreliable Wi-Fi, the 4G model is the best choice. The Pro is for university-level and professional use.",
  },
  {
    question: "What is the difference between the WiFi and 4G models?",
    answer:
      "The 4G model has a built-in SIM card slot and 4G LTE modem, allowing it to connect to the internet via a mobile data SIM — no Wi-Fi router needed. Both models are otherwise identical in performance.",
  },
  {
    question: "Can schools order Prime Books in bulk?",
    answer:
      "Yes. We offer bulk pricing, school deployment support, and rollout planning for institutions. Send your inquiry through the form and our sales team will contact you within 1 hour.",
  },
  {
    question: "What warranty comes with a Prime Book?",
    answer:
      "All Prime Book models come with a 1-year warranty coordinated through the Robokorda technical team. Our team responds within 24 hours for support queries.",
  },
  {
    question: "Are prices in USD or ZiG?",
    answer:
      "Prices are listed in USD as a reference. ZiG equivalents are shown alongside each model. Final pricing at point of sale may vary based on current exchange rates.",
  },
];
