"use client";

import { useEffect, useState } from "react";
import { ArrowDown, Github, Linkedin, Mail, MapPin } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { SITE } from "@/lib/data";
import { cn } from "@/lib/cn";

const ROLES = [
  "Full-Stack MERN Developer",
  "Front-End Engineer",
  "Next.js Specialist",
  "React Engineer",
];

export function Hero() {
  const [text, setText] = useState("");
  const [roleIdx, setRoleIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const role = ROLES[roleIdx];
    const speed = deleting ? 50 : 110;

    const t = setTimeout(() => {
      if (!deleting) {
        const next = role.slice(0, text.length + 1);
        setText(next);
        if (next === role) {
          setTimeout(() => setDeleting(true), 1400);
        }
      } else {
        const next = role.slice(0, text.length - 1);
        setText(next);
        if (next.length === 0) {
          setDeleting(false);
          setRoleIdx((i) => (i + 1) % ROLES.length);
        }
      }
    }, speed);

    return () => clearTimeout(t);
  }, [text, deleting, roleIdx]);

  return (
    <section
      id="hero"
      className="relative isolate min-h-screen overflow-hidden pt-24 sm:pt-28"
    >
      <div className="absolute inset-0 -z-10 grid-pattern opacity-50 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <div
        aria-hidden
        className="absolute left-1/2 top-1/4 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute right-1/4 bottom-1/4 -z-10 h-72 w-72 rounded-full bg-pink-500/10 blur-3xl"
      />

      <div className="container grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div className="flex flex-col gap-6">
          <Badge variant="outline" className="w-fit gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Available for new opportunities
          </Badge>

          <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Hi, I&apos;m{" "}
            <span className="gradient-text">{SITE.name}</span>
          </h1>

          <div className="flex items-center gap-2 text-xl text-muted-foreground sm:text-2xl">
            <span className="font-mono text-foreground/90">
              {text}
              <span className="ml-0.5 inline-block w-[2px] translate-y-[2px] animate-blink bg-foreground/70 sm:translate-y-[4px]">
                &nbsp;
              </span>
            </span>
          </div>

          <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
            {SITE.tagline} With 2 years of industry experience across US and KSA
            product teams, I help startups ship faster with clean, accessible,
            and scalable interfaces.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a href="#projects">
              <Button size="lg">
                View Projects
                <ArrowDown className="h-4 w-4" />
              </Button>
            </a>
            <a href="#contact">
              <Button size="lg" variant="outline">
                Get in Touch
              </Button>
            </a>
          </div>

          <div className="flex items-center gap-4 pt-2 text-sm text-muted-foreground">
            <a
              href={SITE.socials.github}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="GitHub"
              className="rounded-md p-2 transition-colors hover:bg-accent hover:text-foreground"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href={SITE.socials.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="LinkedIn"
              className="rounded-md p-2 transition-colors hover:bg-accent hover:text-foreground"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href={`mailto:${SITE.email}`}
              aria-label="Email"
              className="rounded-md p-2 transition-colors hover:bg-accent hover:text-foreground"
            >
              <Mail className="h-5 w-5" />
            </a>
            <span className="ml-2 flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {SITE.location}
            </span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
          <div className="relative aspect-square w-full">
            <div
              aria-hidden
              className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-2xl"
            />
            <div className="relative h-full w-full overflow-hidden rounded-3xl border border-border bg-card">
              {/* Avatar placeholder — replace with <Image src={SITE.avatarUrl} /> once you upload the photo */}
              <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-6 text-center">
                <div className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">
                  Your Photo Here
                </div>
                <div className="font-mono text-xs text-muted-foreground/70">
                  /public/images/avatar.jpg
                </div>
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-xl border border-border bg-background/80 px-4 py-3 backdrop-blur-md">
                <div className="flex flex-col">
                  <span className="font-mono text-xs text-muted-foreground">
                    Currently
                  </span>
                  <span className="text-sm font-semibold">
                    Front-End Engineer
                  </span>
                </div>
                <span className="font-mono text-xs text-emerald-500">
                  ● Active
                </span>
              </div>
            </div>
          </div>

          <div
            className={cn(
              "absolute -right-3 -top-3 rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-sm sm:-right-6 sm:-top-6",
              "animate-fade-in",
            )}
          >
            <div className="font-mono text-muted-foreground">Experience</div>
            <div className="text-base font-bold">2+ Years</div>
          </div>
          <div
            className={cn(
              "absolute -bottom-3 -left-3 rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-sm sm:-bottom-6 sm:-left-6",
              "animate-fade-in",
            )}
          >
            <div className="font-mono text-muted-foreground">Countries</div>
            <div className="text-base font-bold">USA · KSA</div>
          </div>
        </div>
      </div>
    </section>
  );
}