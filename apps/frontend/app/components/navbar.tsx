"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV_LINKS, siteConfig } from "@/lib/data";
import { useScroll } from "@/app/hooks/use-scroll";
import { useMounted } from "@/app/hooks/use-mounted";
import { ThemeToggle } from "@/app/components/theme-toggle";
import { cn } from "@/lib/cn";

export function Navbar() {
  const mounted = useMounted();
  const scrolled = useScroll();
  const [active, setActive] = useState<string>(NAV_LINKS[0]?.href ?? "#about");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.replace("#", ""));
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(`#${visible[0].target.id}`);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0.1, 0.5, 1] }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b border-transparent bg-background/60 backdrop-blur transition-colors",
        scrolled && "border-border bg-background/80"
      )}
    >
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between gap-4">
        <Link
          href="#top"
          className="font-mono text-sm font-semibold tracking-tight"
          aria-label={`${siteConfig.name} — home`}
        >
          <span className="text-muted-foreground">&lt;</span>
          {siteConfig.name.split(" ")[0]?.toLowerCase()}
          <span className="text-muted-foreground"> /&gt;</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => {
            const isActive = mounted && active === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                  isActive && "text-foreground"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/admin"
            className="hidden rounded-md px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground md:inline-block"
            aria-label="Owner inbox"
          >
            Inbox
          </Link>
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-card md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          className="container mx-auto flex max-w-6xl flex-col gap-1 pb-4 md:hidden"
          aria-label="Mobile"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/admin"
            onClick={() => setOpen(false)}
            className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            Inbox
          </Link>
        </nav>
      )}
    </header>
  );
}
