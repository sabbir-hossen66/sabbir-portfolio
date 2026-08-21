"use client";

import { motion } from "framer-motion";
import { Section } from "@/app/components/ui/section";
import { siteConfig } from "@/lib/data";

export function About() {
  return (
    <Section
      id="about"
      title="About Me"
      subtitle="A short summary of who I am and what I care about building."
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="grid gap-8 md:grid-cols-3"
      >
        <div className="md:col-span-2 space-y-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          <p>
            I&apos;m{" "}
            <span className="text-foreground font-medium">{siteConfig.name}</span>
            , a full-stack engineer focused on the MERN stack with a soft spot
            for Next.js, TypeScript, and well-typed APIs. I&apos;ve shipped
            production systems for teams in the US and Saudi Arabia — from
            multi-tenant SaaS to internal admin tools.
          </p>
          <p>
            I care deeply about performance, accessibility, and developer
            experience. My workflow leans on strong typing, component-driven
            design, and clean contracts between the front-end and back-end.
          </p>
          <p>
            Currently based in{" "}
            <span className="text-foreground">{siteConfig.location}</span> and
            open to remote roles worldwide.
          </p>
        </div>

        <aside className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Quick facts
          </h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Role</span>
              <span className="font-medium">{siteConfig.role}</span>
            </li>
            <li className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Location</span>
              <span className="font-medium">Remote · Worldwide</span>
            </li>
            <li className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Stack</span>
              <span className="font-medium">MERN · Next.js</span>
            </li>
            <li className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Status</span>
              <span className="inline-flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Open to work
              </span>
            </li>
          </ul>
        </aside>
      </motion.div>
    </Section>
  );
}
