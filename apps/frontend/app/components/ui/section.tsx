import * as React from "react";
import { cn } from "@/lib/cn";
import { Reveal, Stagger } from "@/app/components/reveal";

type SectionProps = React.HTMLAttributes<HTMLElement> & {
  id: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  subtitle?: string;
};

export function Section({
  id,
  eyebrow,
  title,
  description,
  subtitle,
  className,
  children,
  ...props
}: SectionProps) {
  const body = description ?? subtitle;

  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn("relative scroll-mt-24 py-20 sm:py-28", className)}
      {...props}
    >
      <div className="container mx-auto max-w-6xl">
        {(eyebrow || title || body) && (
          <Stagger
            className="mb-12 max-w-2xl space-y-3"
            step={80}
            initialDelay={0}
            as="header"
            itemClassName=""
            variant="up"
          >
            {eyebrow && (
              <Reveal as="p" className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                {eyebrow}
              </Reveal>
            )}
            {title && (
              <Reveal
                as="h2"
                id={`${id}-title`}
                className="text-3xl font-semibold tracking-tight sm:text-4xl"
              >
                {title}
              </Reveal>
            )}
            {body && (
              <Reveal as="p" className="text-base text-muted-foreground sm:text-lg">
                {body}
              </Reveal>
            )}
          </Stagger>
        )}
        {children}
      </div>
    </section>
  );
}
