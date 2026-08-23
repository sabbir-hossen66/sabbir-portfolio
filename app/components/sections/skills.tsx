import { Section } from "@/app/components/ui/section";
import { Badge } from "@/app/components/ui/badge";
import { Stagger } from "@/app/components/reveal";
import { SKILLS } from "@/lib/data";

export function Skills() {
  const categories = Array.from(new Set(SKILLS.map((s) => s.category)));

  return (
    <Section
      id="skills"
      title="Skills & Stack"
      subtitle="Tools I reach for daily — and a few I'm actively learning."
    >
      <Stagger
        as="div"
        className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3"
        step={110}
        initialDelay={60}
        variant="up"
      >
        {categories.map((category) => {
          const items = SKILLS.filter((s) => s.category === category);
          return (
            <div
              key={category}
              className="card-hover gradient-border rounded-xl border border-border bg-card p-6"
            >
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                {category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {items.map((skill) => {
                  const Icon = skill.icon;
                  return (
                    <Badge
                      key={skill.name}
                      variant="outline"
                      className="gap-1.5 px-2.5 py-1.5 text-xs"
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {skill.name}
                    </Badge>
                  );
                })}
              </div>
            </div>
          );
        })}
      </Stagger>
    </Section>
  );
}