/**
 * Site-wide background — three layered elements:
 *   1. A soft vertical wash that adapts to theme.
 *   2. A fine 14px dot grid that fades toward the edges (mask-image).
 *   3. A larger 22px dot grid overlay for depth, with a subtle mask.
 *
 * Pure CSS. No motion (the "animation" here is static / theme-aware),
 * so it's friendly to reduced-motion users.
 */
export function DotGridBg() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-50 overflow-hidden"
    >
      {/* Theme-aware base wash */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background" />

      {/* Primary fine dot grid (faded toward edges) */}
      <div
        className="absolute inset-0 bg-dots-fine opacity-60 dark:opacity-50"
        style={{
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 30%, black 25%, transparent 80%)",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 30%, black 25%, transparent 80%)",
        }}
      />

      {/* Secondary coarser dot grid, lower opacity, offset mask */}
      <div
        className="absolute inset-0 bg-dots opacity-[0.55] dark:opacity-[0.45]"
        style={{
          WebkitMaskImage:
            "radial-gradient(ellipse 90% 70% at 50% 60%, black 30%, transparent 85%)",
          maskImage:
            "radial-gradient(ellipse 90% 70% at 50% 60%, black 30%, transparent 85%)",
        }}
      />

      {/* Soft top vignette for hero contrast */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background/80 to-transparent" />
    </div>
  );
}
