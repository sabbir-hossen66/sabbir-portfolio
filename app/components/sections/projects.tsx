import { ExternalLink, Github } from "lucide-react";
import { Section } from "@/app/components/ui/section";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Stagger } from "@/app/components/reveal";
import { PROJECTS } from "@/lib/data";

export function Projects() {
  return (
    <Section
      id="projects"
      title="Selected Projects"
      subtitle="A few things I've built or led across product and contract work."
    >
      <Stagger
        as="div"
        className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2"
        step={120}
        initialDelay={80}
        variant="up"
      >
        {PROJECTS.map((p) => (
          <Card key={p.title} className="group flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <CardTitle className="leading-tight">{p.title}</CardTitle>
                {p.featured && (
                  <Badge variant="default" className="shrink-0">
                    Featured
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{p.description}</p>
            </CardHeader>

            <CardContent className="mt-auto space-y-4">
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                {p.highlights.map((h) => (
                  <li key={h} className="flex gap-2">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-foreground/40" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-1.5">
                {p.stack.map((s) => (
                  <Badge key={s} variant="outline">
                    {s}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-1">
                {p.liveUrl && (
                  <a
                    href={p.liveUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1 text-xs font-medium text-foreground/80 transition-colors hover:text-foreground"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Live
                  </a>
                )}
                {p.repoUrl && (
                  <a
                    href={p.repoUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1 text-xs font-medium text-foreground/80 transition-colors hover:text-foreground"
                  >
                    <Github className="h-3.5 w-3.5" />
                    Code
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </Stagger>
    </Section>
  );
}