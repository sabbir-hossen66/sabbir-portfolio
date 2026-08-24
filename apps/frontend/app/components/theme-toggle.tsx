"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/app/components/theme-provider";
import { useMounted } from "@/app/hooks/use-mounted";
import { cn } from "@/lib/cn";

export function ThemeToggle({ className }: { className?: string }) {
  const mounted = useMounted();
  const { resolvedTheme, setTheme } = useTheme();

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-card text-foreground",
        "transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
    >
      <Sun
        className={cn(
          "h-4 w-4 transition-all",
          isDark ? "rotate-90 scale-0" : "rotate-0 scale-100"
        )}
      />
      <Moon
        className={cn(
          "absolute h-4 w-4 transition-all",
          isDark ? "rotate-0 scale-100" : "-rotate-90 scale-0"
        )}
      />
    </button>
  );
}
