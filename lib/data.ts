import type { LucideIcon } from "lucide-react";
import {
  Code2,
  Layers,
  Rocket,
  Wrench,
  Globe,
  Smartphone,
  Database,
  GitBranch,
  Boxes,
  Cloud,
  ShieldCheck,
  LineChart,
} from "lucide-react";

export const siteConfig = {
  name: "Sabbir Hossen",
  role: "Full-Stack MERN Developer",
  tagline:
    "I build scalable, production-grade web applications with React, Next.js, and Node.js.",
  description:
    "Portfolio of Sabbir Hossen — Front-End Engineer specializing in React, Next.js, TypeScript, and Node.js. Building scalable, accessible, and high-performance web products.",
  url: "https://sabbirhossen.dev",
  location: "Available Worldwide · Remote-First",
  email: "hello@sabbirhossen.dev",
  phone: "+880 1783780066",
  resumeUrl:
    "https://drive.google.com/uc?export=download&id=1XGhqVACmedHYwGw6yTu5Ng9FF29RX-B6",
  resumePreviewUrl:
    "https://drive.google.com/file/d/1XGhqVACmedHYwGw6yTu5Ng9FF29RX-B6/view?usp=drivesdk",
  ogImage: "/og.png",
  socials: {
    github: "https://github.com/sabbir-hossen66",
    linkedin: "https://www.linkedin.com/in/sabbir-hossen66/",
    twitter: "https://twitter.com/sabbirhossen",
  },
} as const;

export const SITE = siteConfig;

export const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
] as const;

export const STATS = [
  { value: "2+", label: "Years Experience" },
  { value: "30+", label: "Projects Shipped" },
  { value: "2", label: "Countries Served" },
  { value: "MERN", label: "Core Stack" },
] as const;

export type Experience = {
  company: string;
  role: string;
  period: string;
  location: string;
  country: "Bangladesh" | "USA" | "Saudi Arabia";
  current: boolean;
  highlights: string[];
  stack: string[];
};

export const EXPERIENCES: Experience[] = [
  {
    company: "Sofof Tech",
    role: "Front-End Engineer",
    period: "August 2025 — Present",
    location: "Remote ",
    country: "Saudi Arabia",
    current: true,
    highlights: [
      "Collaborated closely with the backend team to ensure smooth and efficient API integration.",
      "Delivered high-priority front-end features within tight deadlines without compromising quality.",
      "Designed and implemented unique UI/UX solutions independently, without relying on Figma or predefined designs.",
      "Built AI-agent–based front-end websites from scratch with a strong focus on usability and performance.",
      "Worked closely with back-end developers to integrate complex, large-scale APIs across multiple products.",
      "Developed a real-time voice communication widget using the LiveKit framework.",
      "Actively fixed bugs and supported other developers with Git-related issues.",
      "Contributed across multiple projects including SaaS platforms, CRM systems, and other web applications.",
    ],
    stack: [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "LiveKit",
      "REST APIs",
      "Git",
    ],
  },
  {
    company: "Next Level Bangladesh",
    role: "Front-End Engineer",
    period: "April 2025 — 31 August 2025",
    location: "On-site · Rajshahi, Bangladesh",
    country: "Bangladesh",
    current: false,
    highlights: [
      "Delivered high-priority front-end features under tight deadlines alongside the CTO.",
      "Implemented pagination on large datasets, reducing load time by 40%.",
      "Built reusable UI components (modals, forms) to reduce duplication and improve maintainability.",
      "Reviewed pull requests to ensure clean, efficient, and maintainable code.",
      "Fixed UI/UX bugs, improving dashboard usability for 1,000+ users.",
    ],
    stack: ["React", "Next.js", "TypeScript", "Tailwind CSS", "REST APIs", "Git"],
  },
  {
    company: "Longbitz",
    role: "Front-End Intern",
    period: "January 2025 — March 2025",
    location: "Internship · Dhaka, Bangladesh",
    country: "Bangladesh",
    current: false,
    highlights: [
      "Shipped UI components and fixes in a React/Next.js codebase during a 3-month internship.",
      "Collaborated with senior engineers to translate Figma designs into responsive, accessible interfaces.",
      "Practiced code review, PR hygiene, and feature-flag-based deployments.",
    ],
    stack: ["React", "Next.js", "JavaScript", "Tailwind CSS", "Git"],
  },
];

export type Skill = { name: string; icon: LucideIcon; category: string };

export const SKILLS: Skill[] = [
  { name: "React / Next.js", icon: Code2, category: "Frontend" },
  { name: "TypeScript", icon: Code2, category: "Frontend" },
  { name: "Tailwind CSS", icon: Layers, category: "Frontend" },
  { name: "Responsive UI", icon: Smartphone, category: "Frontend" },
  { name: "Node.js", icon: Rocket, category: "Backend" },
  { name: "Nest.js (Learning)", icon: Boxes, category: "Backend" },
  { name: "Express.js", icon: Rocket, category: "Backend" },
  { name: "REST & GraphQL APIs", icon: Globe, category: "Backend" },
  { name: "MongoDB", icon: Database, category: "Database" },
  { name: "Mongoose / Prisma", icon: Database, category: "Database" },
  { name: "Git & GitHub", icon: GitBranch, category: "Tools" },
  { name: "Docker", icon: Cloud, category: "Tools" },
  { name: "CI/CD", icon: Wrench, category: "Tools" },
  { name: "JWT / OAuth / RBAC", icon: ShieldCheck, category: "Security" },
  { name: "Performance & SEO", icon: LineChart, category: "Quality" },
];

export type Project = {
  title: string;
  description: string;
  highlights: string[];
  stack: string[];
  liveUrl?: string;
  repoUrl?: string;
  featured: boolean;
};

export const PROJECTS: Project[] = [
  {
    title: "Enterprise CRM / SaaS Platform",
    description:
      "A multi-tenant CRM platform with role-based access, real-time dashboards, and a scalable Nest.js backend.",
    highlights: [
      "Designed reusable UI primitives and a typed API contract layer.",
      "Built real-time lead pipelines with optimistic updates.",
      "Implemented strict RBAC and audit logging for enterprise compliance.",
    ],
    stack: ["Next.js", "Nest.js", "MongoDB", "TanStack Query", "Tailwind"],
    featured: true,
  },
  {
    title: "Booking & Reservation System",
    description:
      "Full-stack booking platform with calendar sync, payments, and admin analytics.",
    highlights: [
      "End-to-end MERN implementation with secure auth.",
      "Integrated Stripe payments and webhook reconciliation.",
      "Reduced admin workload by 60% via automation.",
    ],
    stack: ["React", "Node.js", "Express", "MongoDB", "Stripe"],
    featured: true,
  },
  {
    title: "E-Commerce Storefront",
    description:
      "High-performance storefront with SSR, ISR caching, and a headless CMS.",
    highlights: [
      "Achieved sub-1s LCP on product pages.",
      "Built cart, checkout, and order tracking flows.",
      "Integrated Algolia search and analytics.",
    ],
    stack: ["Next.js", "TypeScript", "Tailwind", "Stripe"],
    featured: false,
  },
  {
    title: "Internal Admin Dashboard",
    description:
      "Internal tool for managing users, billing, and support tickets with role-based views.",
    highlights: [
      "Complex data tables with virtualization and filters.",
      "Reusable form system with schema-based validation.",
      "Reduced ticket resolution time by 35%.",
    ],
    stack: ["React", "Node.js", "MongoDB", "Zod", "React Hook Form"],
    featured: false,
  },
];
