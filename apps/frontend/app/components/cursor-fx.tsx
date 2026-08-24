"use client";

/**
 * Cursor reactive effects.
 * - Magnetic trail blob (soft gradient that follows the pointer)
 * - Outer ring that snaps to the pointer with a slight lag
 * - Sparkle particles emitted on quick movements
 *
 * Pure DOM + CSS. Pointer-events: none everywhere.
 * Touch / reduced-motion devices get a static fallback.
 */
import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
};

export function CursorFX() {
  const blobRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    x: -1000,
    y: -1000,
    tx: -1000,
    ty: -1000,
    rx: -1000,
    ry: -1000,
    lastX: -1000,
    lastY: -1000,
    lastEmit: 0,
  });

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduceMotion || isCoarse) return;

    const blob = blobRef.current;
    const ring = ringRef.current;
    const canvas = canvasRef.current;
    if (!blob || !ring || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let particles: Particle[] = [];

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: PointerEvent) => {
      const s = stateRef.current;
      s.tx = e.clientX;
      s.ty = e.clientY;

      const dx = e.clientX - s.lastX;
      const dy = e.clientY - s.lastY;
      const speed = Math.hypot(dx, dy);
      const now = performance.now();

      // Emit sparkles on quick flicks
      if (speed > 18 && now - s.lastEmit > 16) {
        const count = Math.min(4, Math.floor(speed / 12));
        for (let i = 0; i < count; i++) {
          const a = Math.atan2(dy, dx) + (Math.random() - 0.5) * 1.2;
          const v = 0.6 + Math.random() * 1.4;
          particles.push({
            x: e.clientX,
            y: e.clientY,
            vx: Math.cos(a) * v,
            vy: Math.sin(a) * v,
            life: 0,
            max: 380 + Math.random() * 260,
            size: 1 + Math.random() * 1.8,
          });
        }
        s.lastEmit = now;
      }

      s.lastX = e.clientX;
      s.lastY = e.clientY;
    };

    const onLeave = () => {
      stateRef.current.tx = -1000;
      stateRef.current.ty = -1000;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);

    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(48, now - last);
      last = now;
      const s = stateRef.current;

      // Blob: eases towards target with ease-out
      s.x += (s.tx - s.x) * 0.22;
      s.y += (s.ty - s.y) * 0.22;
      blob.style.transform = `translate3d(${s.x - 160}px, ${
        s.y - 160
      }px, 0)`;
      blob.style.opacity =
        s.tx < 0 ? "0" : "1";

      // Ring: slower lag for parallax
      s.rx += (s.tx - s.rx) * 0.12;
      s.ry += (s.ty - s.ry) * 0.12;
      ring.style.transform = `translate3d(${s.rx - 18}px, ${
        s.ry - 18
      }px, 0)`;
      ring.style.opacity = s.tx < 0 ? "0" : "1";

      // Particles
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const next: Particle[] = [];
      for (const p of particles) {
        p.life += dt;
        if (p.life >= p.max) continue;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.015; // gentle gravity
        p.vx *= 0.985;
        p.vy *= 0.985;
        const t = 1 - p.life / p.max;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168, 85, 247, ${0.55 * t})`;
        ctx.shadowColor = "rgba(99, 102, 241, 0.9)";
        ctx.shadowBlur = 12 * t;
        ctx.fill();
        next.push(p);
      }
      particles = next;

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Hide native cursor for a cleaner trail look
    document.documentElement.classList.add("cursor-fx-active");

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.documentElement.classList.remove("cursor-fx-active");
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[60]">
      {/* Gradient magnetic blob */}
      <div
        ref={blobRef}
        className="absolute left-0 top-0 h-80 w-80 rounded-full opacity-0 transition-opacity duration-300 will-change-transform"
        style={{
          background:
            "radial-gradient(circle at center, rgba(139,92,246,0.45), rgba(56,189,248,0.25) 45%, transparent 70%)",
          filter: "blur(28px)",
          mixBlendMode: "screen",
        }}
      />
      {/* Crisp following ring */}
      <div
        ref={ringRef}
        className="absolute left-0 top-0 h-9 w-9 rounded-full opacity-0 will-change-transform"
        style={{
          border: "1.5px solid rgba(168, 85, 247, 0.85)",
          boxShadow:
            "0 0 18px rgba(99,102,241,0.55), inset 0 0 10px rgba(168,85,247,0.35)",
        }}
      />
      {/* Sparkle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
      />
    </div>
  );
}
