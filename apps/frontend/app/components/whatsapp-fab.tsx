"use client";

/**
 * Floating WhatsApp launcher.
 * - Bottom-left, animated WhatsApp logo (soft halo + ripple pulse).
 * - Click opens a chat in the WhatsApp app / web via the wa.me deep link.
 * - Native browser navigation only — no JS buffering.
 * - The whole circular surface is the hit target, so any click inside
 *   the button opens the chat.
 *
 * Uses the universal wa.me deep link — no third-party script needed.
 */
import { siteConfig } from "@/lib/data";

function buildHref() {
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
    siteConfig.whatsappMessage,
  )}`;
}

export function WhatsAppFab() {
  return (
    <a
      href={buildHref()}
      target="_blank"
      rel="noopener noreferrer"
      title=""
      // Plain anchor — the browser handles wa.me navigation natively,
      // which is the smoothest possible handoff to the WhatsApp app/web.
      aria-label="Chat with Sabbir on WhatsApp"
      className="wa-fab group fixed bottom-5 left-5 z-[55] inline-flex h-16 w-16 items-center justify-center rounded-full outline-none ring-offset-background transition-transform duration-300 ease-out-expo will-change-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 active:scale-95 sm:bottom-6 sm:left-6 sm:h-[68px] sm:w-[68px]"
    >
      {/* Soft outer halo — always visible, sells the "lifted" look */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-[-10px] rounded-full opacity-60 blur-xl transition-opacity duration-500 group-hover:opacity-90"
        style={{
          background:
            "radial-gradient(circle, rgba(34, 197, 94, 0.45) 0%, rgba(34, 197, 94, 0) 70%)",
        }}
      />

      {/* Pulse ring — single ring, smooth & slow. Stops on hover so the
          icon stays perfectly still while the user is about to click. */}
      <span
        aria-hidden
        className="wa-fab-ring pointer-events-none absolute inset-0 rounded-full bg-emerald-500/35"
        style={{
          animation: "wa-ping 2.6s cubic-bezier(0, 0, 0.2, 1) infinite",
        }}
      />

      {/* The button face — gradient + soft inner highlight for depth */}
      <span
        aria-hidden
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 30% 25%, #6ee7b7 0%, #22c55e 35%, #16a34a 70%, #15803d 100%)",
          boxShadow:
            "inset 0 -3px 8px rgba(0,0,0,0.18), inset 0 2px 4px rgba(255,255,255,0.35), 0 12px 28px -10px rgba(22, 163, 74, 0.65), 0 4px 10px -4px rgba(22, 163, 74, 0.45)",
        }}
      />

      {/* Click ripple — spawned on :active via a CSS animation triggered
          by an inner pseudo-element so it doesn't need JS to fire. */}
      <span aria-hidden className="wa-fab-ripple pointer-events-none absolute inset-0 rounded-full" />

      {/* Recognizable WhatsApp glyph — white phone-in-bubble on green */}
      <svg
        viewBox="0 0 32 32"
        className="wa-fab-icon relative h-9 w-9 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)] transition-transform duration-300 ease-out-expo group-hover:scale-110 group-active:scale-95 sm:h-10 sm:w-10"
        aria-hidden
        fill="currentColor"
      >
        <path d="M16.003 3C9.374 3 4 8.373 4 15c0 2.65.866 5.106 2.336 7.1L4 29l7.06-2.276A11.94 11.94 0 0 0 16.003 27C22.633 27 28 21.627 28 15S22.633 3 16.003 3Zm0 21.6a10.55 10.55 0 0 1-5.4-1.49l-.387-.232-4.19 1.353 1.376-4.084-.252-.42A10.59 10.59 0 0 1 5.4 15c0-5.85 4.755-10.6 10.603-10.6 5.85 0 10.6 4.75 10.6 10.6 0 5.85-4.75 10.6-10.6 10.6Zm5.815-7.928c-.318-.16-1.882-.93-2.173-1.036-.291-.107-.503-.16-.715.16-.212.318-.821 1.036-.987 1.249-.182.212-.364.239-.682.08-.318-.16-1.342-.495-2.555-1.578-.945-.842-1.582-1.882-1.764-2.2-.182-.318-.02-.49.14-.65.144-.143.318-.364.477-.546.16-.182.213-.318.318-.531.107-.212.053-.398-.027-.557-.08-.16-.715-1.724-.98-2.36-.258-.62-.521-.535-.715-.546l-.61-.011a1.17 1.17 0 0 0-.85.398c-.291.318-1.114 1.088-1.114 2.654 0 1.566 1.14 3.08 1.299 3.292.16.212 2.244 3.42 5.435 4.798.76.328 1.353.524 1.815.67.762.243 1.455.209 2.003.127.611-.091 1.882-.769 2.146-1.512.265-.743.265-1.38.186-1.512-.08-.132-.291-.213-.61-.373Z" />
      </svg>
    </a>
  );
}
