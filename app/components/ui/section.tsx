import * as React from "react";
import { cn } from "@/lib/cn";

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
          <header className="mb-12 max-w-2xl">
            {eyebrow && (
              <p className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2
                id={`${id}-title`}
                className="text-3xl font-semibold tracking-tight sm:text-4xl"
              >
                {title}
              </h2>
            )}
            {body && (
              <p className="mt-4 text-base text-muted-foreground sm:text-lg">
                {body}
              </p>
            )}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
