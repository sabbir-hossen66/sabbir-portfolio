import { Download } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Section } from "@/app/components/ui/section";
import { Reveal, Stagger } from "@/app/components/reveal";
import { STATS, SITE } from "@/lib/data";

export function About() {
  return (
    <Section
      id="about"
      title="About Me"
      subtitle="A short story of where I've been and what I focus on."
    >
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1.4fr_1fr]">
        <Reveal className="space-y-4 text-base text-muted-foreground sm:text-lg">
          <p>
            I&apos;m <span className="font-medium text-foreground">Sabbir Hossen</span>,
            a full-stack MERN developer with <span className="font-medium text-foreground">2+ years</span>{" "}
            of professional experience building production-grade web applications
            for clients and product teams in the <span className="font-medium text-foreground">United States</span>{" "}
            and <span className="font-medium text-foreground">Saudi Arabia</span>.
          </p>
          <p>
            Currently I work as a <span className="font-medium text-foreground">Front-End Engineer</span> on a
            multi-tenant CRM/SaaS platform, where I help ship a reusable
            component library in Next.js + TypeScript and own the BFF layer
            written in Nest.js. I care deeply about accessibility, performance,
            and clean architecture — code that another engineer can read six
            months from now without wanting to throw their laptop.
          </p>
          <p>
            I&apos;m actively exploring <span className="font-medium text-foreground">Nest.js</span> and
            distributed-system patterns, with a clear plan to grow into a
            well-rounded full-stack engineer who can own both the UI and the
            services behind it.
          </p>

          <div className="pt-2">
            <a href={SITE.resumeUrl} download>
              <Button variant="outline">
                <Download className="h-4 w-4" />
                Download Résumé
              </Button>
            </a>
          </div>
        </Reveal>

        <Stagger
          as="div"
          className="grid grid-cols-2 gap-3 sm:gap-4"
          step={100}
          initialDelay={120}
          variant="up"
        >
          {STATS.map((s) => (
            <div
              key={s.label}
              className="card-hover gradient-border rounded-xl border border-border bg-card p-4 sm:p-6"
            >
              <div className="font-mono text-2xl font-bold tracking-tight sm:text-3xl">
                {s.value}
              </div>
              <div className="mt-1 text-xs text-muted-foreground sm:text-sm">
                {s.label}
              </div>
            </div>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}