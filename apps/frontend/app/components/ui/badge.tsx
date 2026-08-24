import * as React from "react";
import { cn } from "@/lib/cn";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "muted" | "outline";
};

const variantStyles: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "bg-foreground text-background",
  muted: "bg-muted text-muted-foreground",
  outline: "border border-border text-foreground",
};

export function Badge({
  className,
  variant = "muted",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}
