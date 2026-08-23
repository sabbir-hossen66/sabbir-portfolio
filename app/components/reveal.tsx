"use client";

/**
 * Reveal: lightweight IntersectionObserver wrapper that swaps
 * a `reveal` (or `reveal-fade` / `reveal-scale`) class for
 * `is-visible`, triggering CSS-defined keyframes.
 *
 * Supports per-child `delay` for stagger. Respects prefers-reduced-motion
 * via the global rule in globals.css.
 *
 * Industry-standard pattern (Linear / Vercel / Framer Motion docs style).
 */
import * as React from "react";

type Variant = "up" | "fade" | "scale";

type RevealProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Animation variant. */
  variant?: Variant;
  /** Trigger threshold (0–1). Default 0.12 */
  threshold?: number;
  /** Trigger only once. Default true. */
  once?: boolean;
  /** Optional stagger delay in ms. */
  delay?: number;
  /** Render as a different element. */
  as?: React.ElementType;
};

export function Reveal({
  variant = "up",
  threshold = 0.12,
  once = true,
  delay = 0,
  as: Tag = "div",
  className,
  children,
  style,
  ...props
}: RevealProps) {
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reduced motion or no IO — reveal immediately.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof IntersectionObserver === "undefined") {
      el.classList.add("is-visible");
      return;
    }

    // Safety net: if the element is already fully visible in the
    // viewport on mount, don't wait for IO — just reveal it.
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    if (rect.top < vh && rect.bottom > 0) {
      const d = Number(el.dataset.revealDelay || "0");
      if (d > 0) el.style.animationDelay = `${d}ms`;
      el.classList.add("is-visible");
      if (once) return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const node = entry.target as HTMLElement;
            const d = Number(node.dataset.revealDelay || "0");
            if (d > 0) {
              node.style.animationDelay = `${d}ms`;
            }
            node.classList.add("is-visible");
            if (once) io.unobserve(node);
          } else if (!once) {
            entry.target.classList.remove("is-visible");
          }
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [threshold, once]);

  const revealClass =
    variant === "fade"
      ? "reveal-fade"
      : variant === "scale"
      ? "reveal-scale"
      : "reveal";

  return (
    <Tag
      ref={ref}
      data-reveal-delay={delay || undefined}
      className={[revealClass, className].filter(Boolean).join(" ")}
      style={style}
      {...props}
    >
      {children}
    </Tag>
  );
}

/**
 * Stagger: render N children wrapped in Reveal with auto-incrementing delay.
 */
type StaggerProps = {
  children: React.ReactNode;
  className?: string;
  /** Base delay per item in ms. Default 90. */
  step?: number;
  /** Initial offset in ms before first child. */
  initialDelay?: number;
  variant?: Variant;
  threshold?: number;
  as?: React.ElementType;
  itemClassName?: string;
  /** Optional override on each child wrapper. */
  itemProps?: Omit<RevealProps, "delay" | "children" | "className">;
};

export function Stagger({
  children,
  className,
  step = 90,
  initialDelay = 0,
  variant = "up",
  threshold = 0.12,
  as: Tag = "div",
  itemClassName,
  itemProps,
}: StaggerProps) {
  const items = React.Children.toArray(children);
  return (
    <Tag className={className}>
      {items.map((child, i) => (
        <Reveal
          key={(child as React.ReactElement)?.key ?? i}
          as="div"
          variant={variant}
          threshold={threshold}
          delay={initialDelay + i * step}
          className={itemClassName}
          {...itemProps}
        >
          {child}
        </Reveal>
      ))}
    </Tag>
  );
}
