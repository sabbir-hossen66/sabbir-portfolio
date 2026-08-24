import { Briefcase } from "lucide-react";
import { Section } from "@/app/components/ui/section";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent } from "@/app/components/ui/card";
import { Reveal, Stagger } from "@/app/components/reveal";
import { EXPERIENCES } from "@/lib/data";

export function Experience() {
  return (
    <Section
      id="experience"
      title="Experience"
      subtitle="Two years, two countries, and a stack that keeps growing."
    >
      <Stagger
        as="ol"
        className="relative mx-auto max-w-3xl space-y-8 border-l border-border pl-6 sm:pl-8"
        step={140}
        initialDelay={80}
        variant="up"
      >
        {EXPERIENCES.map((exp) => (
          <li key={exp.company} className="relative">
            <span
              className="absolute -left-[33px] flex h-7 w-7 items-center justify-center rounded-full border border-border bg-background sm:-left-[41px]"
              aria-hidden
            >
              <Briefcase className="h-3.5 w-3.5 text-foreground" />
            </span>

            <Card>
              <CardContent className="space-y-4 p-6">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-semibold">{exp.role}</h3>
                    <p className="text-sm text-muted-foreground">
                      {exp.company}
                    </p>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <div className="font-mono">{exp.period}</div>
                    <div>{exp.location}</div>
                  </div>
                </div>

                <ul className="space-y-2 text-sm text-muted-foreground">
                  {exp.highlights.map((h) => (
                    <li key={h} className="flex gap-2">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-foreground/40" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {exp.stack.map((s) => (
                    <Badge key={s} variant="outline">
                      {s}
                    </Badge>
                  ))}
                </div>

                {exp.current && (
                  <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                    <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Current
                  </Badge>
                )}
              </CardContent>
            </Card>
          </li>
        ))}
      </Stagger>
    </Section>
  );
}