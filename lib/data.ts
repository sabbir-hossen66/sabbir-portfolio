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
    "Portfolio of Sabbir Hossen — Full-Stack MERN Developer specializing in React, Next.js, TypeScript, and Node.js. Building scalable, accessible, and high-performance web products.",
  url: "https://sabbirhossen.dev",
  location: "Available Worldwide · Remote-First",
  email: "hello@sabbirhossen.dev",
  phone: "+880 1XXX-XXXXXX",
  resumeUrl: "/resume.pdf",
  ogImage: "/og.png",
  socials: {
    github: "https://github.com/sabbirhossen",
    linkedin: "https://linkedin.com/in/sabbirhossen",
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
  country: "USA" | "Saudi Arabia";
  current: boolean;
  highlights: string[];
  stack: string[];
};

export const EXPERIENCES: Experience[] = [
  {
    company: "American Tech Co. (Confidential)",
    role: "Front-End Engineer",
    period: "2024 — Present",
    location: "Remote · USA",
    country: "USA",
    current: true,
    highlights: [
      "Architected reusable component libraries in React + Next.js 14 used across multiple product lines.",
      "Led front-end development of a scalable multi-tenant CRM/SaaS platform serving enterprise clients.",
      "Implemented Nest.js BFF layer for typed, secure API contracts between UI and microservices.",
      "Improved Core Web Vitals by 40% through code-splitting, image optimization, and SSR streaming.",
    ],
    stack: ["Next.js", "React", "TypeScript", "Nest.js", "Tailwind", "TanStack Query"],
  },
  {
    company: "Saudi Arabian Software House (Confidential)",
    role: "Full-Stack MERN Developer",
    period: "2023 — 2024",
    location: "Hybrid · Riyadh",
    country: "Saudi Arabia",
    current: false,
    highlights: [
      "Delivered production features end-to-end: Node/Express APIs, MongoDB schemas, React front-ends.",
      "Built RBAC + JWT authentication flows used by 10k+ internal users.",
      "Collaborated with designers in Figma to ship pixel-perfect, accessible UI components.",
      "Containerized services with Docker and participated in CI/CD pipeline reviews.",
    ],
    stack: ["React", "Node.js", "Express", "MongoDB", "Docker", "Jest"],
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
