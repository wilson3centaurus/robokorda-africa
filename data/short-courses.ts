import {
  BrainCircuit,
  Code2,
  FileSpreadsheet,
  FileText,
  Globe,
  Laptop,
  MonitorSmartphone,
  Cpu,
  Database,
  Palette,
  PenTool,
  Cloud,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type ShortCourse = {
  id: string;
  title: string;
  category: string;
  icon: LucideIcon;
  description: string;
  topics: string[];
  audience: string;
  delivery: string[];
  duration: string;
  certified: boolean;
  badge?: string;
};

export const shortCourseCategories = [
  "All",
  "Artificial Intelligence",
  "Microsoft Office",
  "Web Development",
  "Mobile Development",
  "Data & Cloud",
  "Design & Media",
] as const;

export const shortCourses: ShortCourse[] = [
  // ── AI ───────────────────────────────────────────────────────────────────
  {
    id: "ai-fundamentals",
    title: "Fundamentals of Artificial Intelligence",
    category: "Artificial Intelligence",
    icon: BrainCircuit,
    description:
      "A beginner-friendly introduction to AI concepts, machine learning, prompt engineering, and responsible AI use in everyday and professional contexts.",
    topics: [
      "What is AI and how does it work",
      "Machine learning basics",
      "Prompt engineering and generative AI",
      "AI tools for productivity and creativity",
      "Ethics and responsible AI use",
    ],
    audience: "Students, professionals, anyone curious about AI",
    delivery: ["Physical", "Online", "Hybrid"],
    duration: "2 weeks (10 sessions)",
    certified: true,
  },
  {
    id: "ai-intermediate",
    title: "AI for Work & Business",
    category: "Artificial Intelligence",
    icon: BrainCircuit,
    description:
      "Level up your AI skills: automate workflows, use AI in decision-making, analyse data with AI tools, and build AI-powered products and services.",
    topics: [
      "AI-powered automation and productivity",
      "Data analysis with AI",
      "Building AI workflows",
      "AI for customer service and marketing",
      "Evaluating AI outputs critically",
    ],
    audience: "Working professionals wanting to leverage AI at work",
    delivery: ["Physical", "Online", "Hybrid"],
    duration: "3 weeks (15 sessions)",
    certified: true,
    badge: "Career Booster",
  },

  // ── MS Office ─────────────────────────────────────────────────────────────
  {
    id: "ms-word-basics",
    title: "Microsoft Word: Basics to Intermediate",
    category: "Microsoft Office",
    icon: FileText,
    description:
      "Master document creation, formatting, styles, tables, mail merge, and professional document design from beginner level through intermediate.",
    topics: [
      "Document creation and formatting",
      "Styles, headings, and table of contents",
      "Tables and images",
      "Mail merge and templates",
      "Track changes and collaboration",
    ],
    audience: "Students, office workers, job seekers",
    delivery: ["Physical", "Online", "Hybrid"],
    duration: "2 weeks (10 sessions)",
    certified: true,
  },
  {
    id: "ms-excel-basics",
    title: "Microsoft Excel: Basics to Intermediate",
    category: "Microsoft Office",
    icon: FileSpreadsheet,
    description:
      "From spreadsheet foundations to formulas, charts, pivot tables, and data analysis — a practical Excel course for students and professionals.",
    topics: [
      "Spreadsheet structure and navigation",
      "Formulas and functions (SUM, IF, VLOOKUP, etc.)",
      "Charts and data visualisation",
      "Pivot tables and data analysis",
      "Conditional formatting and automation",
    ],
    audience: "Students, accountants, analysts, office professionals",
    delivery: ["Physical", "Online", "Hybrid"],
    duration: "3 weeks (15 sessions)",
    certified: true,
    badge: "Most Popular",
  },
  {
    id: "ms-excel-advanced",
    title: "Microsoft Excel: Advanced",
    category: "Microsoft Office",
    icon: FileSpreadsheet,
    description:
      "Advanced Excel for professionals: Power Query, complex formulas, macros, dashboards, and data modelling for business intelligence.",
    topics: [
      "Advanced formulas: INDEX, MATCH, array formulas",
      "Power Query and Power Pivot",
      "Dashboard creation",
      "VBA macros and automation",
      "Data modelling and business reporting",
    ],
    audience: "Finance, accounting, data, and business professionals",
    delivery: ["Physical", "Online", "Hybrid"],
    duration: "3 weeks (15 sessions)",
    certified: true,
  },
  {
    id: "ms-powerpoint",
    title: "Microsoft PowerPoint & Presentation Skills",
    category: "Microsoft Office",
    icon: Laptop,
    description:
      "Design professional presentations that communicate clearly and look great: from layouts and animations to public speaking and storytelling.",
    topics: [
      "Slide design principles",
      "Themes, templates, and master slides",
      "Animations and transitions",
      "Data and chart slides",
      "Presentation delivery and public speaking",
    ],
    audience: "Students, managers, salespeople, teachers",
    delivery: ["Physical", "Online", "Hybrid"],
    duration: "1.5 weeks (8 sessions)",
    certified: true,
  },
  {
    id: "ms-google-workspace",
    title: "Google Workspace Essentials",
    category: "Microsoft Office",
    icon: Cloud,
    description:
      "Master Google Docs, Sheets, Slides, Drive, Gmail, and Meet for professional cloud-based collaboration and productivity.",
    topics: [
      "Google Docs and collaborative editing",
      "Google Sheets for data and formulas",
      "Google Slides for presentations",
      "Google Drive and file management",
      "Gmail, Meet, and Calendar for productivity",
    ],
    audience: "Remote workers, students, NGO professionals",
    delivery: ["Physical", "Online", "Hybrid"],
    duration: "2 weeks (10 sessions)",
    certified: true,
  },
  {
    id: "ms-full-package",
    title: "Full Microsoft Office Package",
    category: "Microsoft Office",
    icon: Cpu,
    description:
      "Comprehensive training covering Word, Excel, PowerPoint, Outlook, Teams, and OneNote — from beginner to confident professional user.",
    topics: [
      "Word: documents and templates",
      "Excel: data, formulas, and dashboards",
      "PowerPoint: design and presentations",
      "Outlook: email, calendar, and tasks",
      "Teams and OneNote: collaboration tools",
    ],
    audience: "Job seekers, career changers, anyone entering the office environment",
    delivery: ["Physical", "Online", "Hybrid"],
    duration: "6 weeks (30 sessions)",
    certified: true,
    badge: "Best Value Bundle",
  },

  // ── Web Development ───────────────────────────────────────────────────────
  {
    id: "web-dev-basics",
    title: "Web Development: HTML & CSS Foundations",
    category: "Web Development",
    icon: Globe,
    description:
      "Build your first websites from scratch: HTML structure, CSS styling, responsive layouts, and the fundamentals of how the web works.",
    topics: [
      "HTML structure, tags, and semantics",
      "CSS styling, colours, and typography",
      "Flexbox and Grid layouts",
      "Responsive design and mobile-first",
      "Publishing your first website",
    ],
    audience: "Beginners, students, creatives",
    delivery: ["Physical", "Online", "Hybrid"],
    duration: "3 weeks (15 sessions)",
    certified: true,
  },
  {
    id: "web-dev-javascript",
    title: "Web Development: JavaScript Essentials",
    category: "Web Development",
    icon: Code2,
    description:
      "Make your websites interactive: JavaScript fundamentals, DOM manipulation, event handling, APIs, and building real web projects.",
    topics: [
      "JavaScript syntax and logic",
      "DOM manipulation and events",
      "Functions and ES6+ features",
      "Fetching data from APIs",
      "Building interactive web projects",
    ],
    audience: "Students with basic HTML/CSS knowledge",
    delivery: ["Physical", "Online", "Hybrid"],
    duration: "4 weeks (20 sessions)",
    certified: true,
  },
  {
    id: "web-dev-fullstack",
    title: "Full-Stack Web Development",
    category: "Web Development",
    icon: Globe,
    description:
      "Build complete, production-ready web applications from front-end to back-end using modern frameworks, databases, and deployment tools.",
    topics: [
      "React or Next.js for front-end",
      "Node.js and Express or Python backend",
      "Databases: SQL and NoSQL",
      "Authentication, REST APIs",
      "Deployment: Vercel, Netlify, or hosting",
    ],
    audience: "Aspiring developers, career changers, tech professionals",
    delivery: ["Physical", "Online", "Hybrid"],
    duration: "12 weeks (60 sessions)",
    certified: true,
    badge: "Career Ready",
  },

  // ── Mobile Development ────────────────────────────────────────────────────
  {
    id: "mobile-app-basics",
    title: "Mobile App Development: Introduction",
    category: "Mobile Development",
    icon: MonitorSmartphone,
    description:
      "Learn how mobile apps are built: UI design, user experience, app logic, and building your first simple Android or cross-platform app.",
    topics: [
      "How mobile apps work",
      "UI/UX design for mobile",
      "Building screens and navigation",
      "Handling data and user input",
      "Publishing a basic app",
    ],
    audience: "Beginners, students, entrepreneurs",
    delivery: ["Physical", "Online", "Hybrid"],
    duration: "4 weeks (20 sessions)",
    certified: true,
  },
  {
    id: "mobile-app-react-native",
    title: "Mobile App Development: React Native",
    category: "Mobile Development",
    icon: MonitorSmartphone,
    description:
      "Build cross-platform iOS and Android apps with React Native: components, navigation, state management, APIs, and app store publishing.",
    topics: [
      "React Native setup and structure",
      "Components, styles, and layouts",
      "Navigation: Stack and Tab",
      "API integration and state management",
      "Publishing to Play Store and App Store",
    ],
    audience: "Web developers wanting to build mobile apps",
    delivery: ["Physical", "Online", "Hybrid"],
    duration: "8 weeks (40 sessions)",
    certified: true,
    badge: "Career Ready",
  },

  // ── Data & Cloud ──────────────────────────────────────────────────────────
  {
    id: "data-analysis",
    title: "Data Analysis for Beginners",
    category: "Data & Cloud",
    icon: Database,
    description:
      "Understand and analyse data using Excel, Google Sheets, and Python basics: cleaning, visualisation, insights, and decision-making from data.",
    topics: [
      "What is data analysis",
      "Data cleaning and preparation",
      "Charts and visualisation",
      "Python basics for data",
      "Presenting data-driven insights",
    ],
    audience: "Business professionals, researchers, students",
    delivery: ["Physical", "Online", "Hybrid"],
    duration: "4 weeks (20 sessions)",
    certified: true,
  },
  {
    id: "cloud-essentials",
    title: "Cloud Computing Essentials",
    category: "Data & Cloud",
    icon: Cloud,
    description:
      "Understand cloud computing, use cloud services confidently (Google Cloud, AWS, Azure basics), and prepare for a cloud-enabled career.",
    topics: [
      "What is cloud computing",
      "Cloud service models: IaaS, PaaS, SaaS",
      "Using AWS, Google Cloud, and Azure basics",
      "Cloud storage and file sharing",
      "Cloud security fundamentals",
    ],
    audience: "IT professionals, managers, tech enthusiasts",
    delivery: ["Physical", "Online", "Hybrid"],
    duration: "3 weeks (15 sessions)",
    certified: true,
  },

  // ── Design & Media ────────────────────────────────────────────────────────
  {
    id: "graphic-design-basics",
    title: "Graphic Design Basics",
    category: "Design & Media",
    icon: Palette,
    description:
      "Learn visual design principles, colour theory, typography, and practical design using Canva and Adobe Express for branding and content creation.",
    topics: [
      "Design principles and visual thinking",
      "Colour theory and typography",
      "Canva and Adobe Express for design",
      "Social media graphics and flyers",
      "Brand identity basics",
    ],
    audience: "Entrepreneurs, social media managers, students",
    delivery: ["Physical", "Online", "Hybrid"],
    duration: "2 weeks (10 sessions)",
    certified: true,
  },
  {
    id: "digital-content-creation",
    title: "Digital Content Creation",
    category: "Design & Media",
    icon: PenTool,
    description:
      "Create compelling digital content: photography basics, video editing, short-form content strategy, and storytelling for social media and professional use.",
    topics: [
      "Phone photography and lighting",
      "Video editing basics (CapCut, DaVinci Resolve)",
      "Short-form video for TikTok, Reels, YouTube",
      "Content planning and strategy",
      "Building a personal brand online",
    ],
    audience: "Content creators, entrepreneurs, marketers, students",
    delivery: ["Physical", "Online", "Hybrid"],
    duration: "2 weeks (10 sessions)",
    certified: true,
  },
];
