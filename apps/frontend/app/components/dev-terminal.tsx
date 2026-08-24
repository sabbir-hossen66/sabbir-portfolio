"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Mail,
  MapPin,
  Sparkles,
  Terminal as TerminalIcon,
  X,
  Github,
  Linkedin,
} from "lucide-react";
import { SITE, EXPERIENCES, SKILLS } from "@/lib/data";

type Line =
  | { kind: "system"; text: string }
  | { kind: "user"; text: string }
  | { kind: "ok"; text: string }
  | { kind: "info"; text: string };

type CommandCtx = {
  print: (line: Omit<Line, "kind"> | Line) => void;
  scrollTo: (id: string) => void;
  openLink: (url: string, target?: "_blank" | "_self") => void;
  close: () => void;
};

const BANNER = [
  "┌──────────────────────────────────────────────┐",
  "│  sabbir@portfolio ~ v1.0.0                    │",
  "│  Type 'help' to see available commands.      │",
  "└──────────────────────────────────────────────┘",
];

const SKILL_LOOKUP = SKILLS.map((s) => s.name.toLowerCase());

function whoamiText() {
  return [
    `${SITE.name} — ${SITE.role}`,
    SITE.tagline,
    `Location: ${SITE.location}`,
    `Email: ${SITE.email}`,
    "",
    "Currently shipping React/Next.js + TypeScript at Sofof Tech.",
    "Built this CLI as a small Easter egg — type 'help' to explore.",
  ].join("\n");
}

function aboutText() {
  return [
    "I help product teams ship faster with clean, accessible, and",
    "scalable interfaces. Full-stack MERN with a heavy front-end focus",
    "on Next.js, TypeScript, and design systems.",
    "",
    "Open to: full-time front-end / full-stack roles & short contracts.",
  ].join("\n");
}

function skillsText() {
  const cats = Array.from(new Set(SKILLS.map((s) => s.category)));
  return cats
    .map(
      (c) =>
        `${c.padEnd(10)} › ${SKILLS.filter((s) => s.category === c)
          .map((s) => s.name)
          .join(", ")}`,
    )
    .join("\n");
}

function experienceText() {
  return EXPERIENCES.map(
    (e, i) =>
      `#${i + 1}  ${e.role} @ ${e.company}\n` +
      `     ${e.period} · ${e.location}\n` +
      `     stack: ${e.stack.join(", ")}`,
  ).join("\n\n");
}

function socialsText() {
  return [
    `github   ${SITE.socials.github}`,
    `linkedin ${SITE.socials.linkedin}`,
    `twitter  ${SITE.socials.twitter}`,
    `email    ${SITE.email}`,
  ].join("\n");
}

function helpText() {
  return [
    "  about         who I am",
    "  skills        my tech stack",
    "  experience    work history",
    "  projects      jump to projects",
    "  contact       jump to contact",
    "  resume        download résumé",
    "  socials       show all links",
    "  email         copy email to clipboard",
    "  github        open GitHub",
    "  linkedin      open LinkedIn",
    "  theme         toggle light/dark",
    "  clear         clear the terminal",
    "  banner        show the banner again",
    "  exit          close the terminal",
  ].join("\n");
}

function buildCommands(ctx: CommandCtx): Record<string, (args: string[]) => void | Promise<void>> {
  const { print, scrollTo, openLink, close } = ctx;

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      print({ kind: "ok", text: `copied to clipboard → ${text}` });
    } catch {
      print({ kind: "info", text: `(clipboard unavailable) ${text}` });
    }
  }

  return {
    help: () => print({ kind: "info", text: helpText() }),
    banner: () => print({ kind: "system", text: BANNER.join("\n") }),
    whoami: () => print({ kind: "info", text: whoamiText() }),
    about: () => print({ kind: "info", text: aboutText() }),
    skills: () => print({ kind: "info", text: skillsText() }),
    experience: () => print({ kind: "info", text: experienceText() }),
    projects: () => {
      print({ kind: "ok", text: "jumping to projects…" });
      scrollTo("projects");
    },
    contact: () => {
      print({ kind: "ok", text: "jumping to contact…" });
      scrollTo("contact");
    },
    resume: () => {
      print({ kind: "ok", text: `opening résumé → ${SITE.resumeUrl}` });
      openLink("/api/resume", "_blank");
    },
    socials: () => print({ kind: "info", text: socialsText() }),
    email: () => copy(SITE.email),
    github: () => openLink(SITE.socials.github, "_blank"),
    linkedin: () => openLink(SITE.socials.linkedin, "_blank"),
    twitter: () => openLink(SITE.socials.twitter, "_blank"),
    clear: () => {
      // parent clears state via a sentinel line
      print({ kind: "system", text: "__CLEAR__" });
    },
    exit: () => close(),
    ls: () =>
      print({
        kind: "info",
        text: [
          "about.md  skills.json  experience/  projects/  contact.md",
          "resume.pdf  socials.txt  README.md",
        ].join("\n"),
      }),
    cat: (args) => {
      const target = args[0]?.toLowerCase();
      if (!target) return print({ kind: "info", text: "usage: cat <file>" });
      if (target === "about.md") return print({ kind: "info", text: aboutText() });
      if (target === "skills.json") return print({ kind: "info", text: skillsText() });
      if (target === "resume.pdf") return openLink("/api/resume", "_blank");
      if (target === "socials.txt") return print({ kind: "info", text: socialsText() });
      return print({ kind: "info", text: `cat: ${target}: no such file` });
    },
    sudo: () =>
      print({
        kind: "info",
        text: "Nice try. This incident will be reported to nobody 🙂",
      }),
  };
}

export function DevTerminal() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>([
    { kind: "system", text: BANNER.join("\n") },
    { kind: "info", text: "Tip: press the terminal icon, or hit `⌘ + K` anytime." },
    { kind: "system", text: "" },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const print = useCallback((line: Omit<Line, "kind"> | Line) => {
    setLines((prev) => {
      // sentinel to clear
      const full = line as Line;
      if (full.kind === "system" && full.text === "__CLEAR__") return [];
      return [...prev, full as Line];
    });
  }, []);

  const scrollTo = useCallback((id: string) => {
    setOpen(false);
    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  const openLink = useCallback((url: string, target: "_blank" | "_self" = "_blank") => {
    if (typeof window === "undefined") return;
    window.open(url, target === "_blank" ? "_blank" : "_self", "noopener,noreferrer");
  }, []);

  const commands = useMemo(
    () =>
      buildCommands({
        print,
        scrollTo,
        openLink,
        close: () => setOpen(false),
      }),
    [print, scrollTo, openLink],
  );

  const run = useCallback(
    async (raw: string) => {
      const trimmed = raw.trim();
      const echoedUser: Line = { kind: "user", text: `$ ${raw}` };
      if (!trimmed) {
        setLines((p) => [...p, echoedUser, { kind: "system", text: "" }]);
        return;
      }
      setLines((p) => [...p, echoedUser]);

      // history
      setHistory((h) => {
        const next = [...h, trimmed];
        return next.slice(-50);
      });
      setHistoryIdx(null);

      const [cmd, ...args] = trimmed.split(/\s+/);
      const handler = commands[cmd];
      if (!handler) {
        setLines((p) => [
          ...p,
          {
            kind: "info",
            text: `command not found: ${cmd} (type 'help')`,
          },
          { kind: "system", text: "" },
        ]);
        return;
      }
      try {
        await handler(args);
      } catch (err) {
        setLines((p) => [
          ...p,
          {
            kind: "info",
            text: `error: ${err instanceof Error ? err.message : String(err)}`,
          },
          { kind: "system", text: "" },
        ]);
      }
    },
    [commands],
  );

  // Global hotkey: ⌘/Ctrl + K toggles the terminal
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isToggle = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
      if (isToggle) {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Autofocus + autoscroll when opening / when output grows
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines, open]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      void run(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const idx = historyIdx === null ? history.length - 1 : Math.max(0, historyIdx - 1);
      setHistoryIdx(idx);
      setInput(history[idx] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIdx === null) return;
      const idx = Math.min(history.length - 1, historyIdx + 1);
      setHistoryIdx(idx);
      setInput(history[idx] ?? "");
    } else if (e.key === "Tab") {
      e.preventDefault();
      const match = Object.keys(commands).find((c) => c.startsWith(input.trim()));
      if (match) setInput(match);
    }
  };

  return (
    <>
      {/* Floating launcher */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open developer terminal"
        className="fixed bottom-5 right-5 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background/90 text-foreground shadow-lg backdrop-blur-md transition-all hover:scale-105 hover:border-foreground/40 sm:bottom-6 sm:right-6"
      >
        <TerminalIcon className="h-5 w-5" />
        <span className="absolute -right-1 -top-1 inline-flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-70" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
        </span>
      </button>

      {/* Modal terminal */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Developer terminal"
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 p-3 backdrop-blur-sm sm:items-center sm:p-6"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-3xl overflow-hidden rounded-xl border border-border bg-background/95 shadow-2xl ring-1 ring-foreground/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-2 border-b border-border bg-card/80 px-4 py-2.5">
              <div className="flex items-center gap-2 text-xs">
                <span className="h-3 w-3 rounded-full bg-red-500/80" />
                <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                <span className="ml-3 font-mono text-muted-foreground">
                  sabbir@portfolio:~ — zsh
                </span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close terminal"
                className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div
              ref={scrollRef}
              className="terminal-scroll h-[55vh] min-h-[320px] overflow-y-auto bg-background/80 px-4 py-3 font-mono text-[13px] leading-relaxed sm:h-[60vh]"
            >
              {lines.map((l, i) => (
                <pre
                  key={i}
                  className={
                    l.kind === "user"
                      ? "whitespace-pre-wrap text-foreground"
                      : l.kind === "ok"
                        ? "whitespace-pre-wrap text-emerald-500"
                        : l.kind === "info"
                          ? "whitespace-pre-wrap text-muted-foreground"
                          : "whitespace-pre-wrap text-foreground/70"
                  }
                >
                  {l.text}
                </pre>
              ))}

              {/* Live prompt */}
              <div className="flex items-center gap-2">
                <span className="select-none text-emerald-500">➜</span>
                <span className="select-none text-cyan-400">~</span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  spellCheck={false}
                  autoComplete="off"
                  aria-label="Terminal input"
                  className="flex-1 bg-transparent text-foreground caret-emerald-500 outline-none placeholder:text-muted-foreground/50"
                  placeholder='type "help" and press ⏎'
                />
                <span className="ml-1 inline-block h-4 w-2 translate-y-[1px] animate-cursor-blink bg-emerald-500" />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-card/70 px-4 py-2 text-[11px] text-muted-foreground">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> try:{" "}
                  <button
                    className="rounded bg-muted px-1.5 py-0.5 hover:bg-accent"
                    onClick={() => setInput("help")}
                  >
                    help
                  </button>
                  ,{" "}
                  <button
                    className="rounded bg-muted px-1.5 py-0.5 hover:bg-accent"
                    onClick={() => setInput("whoami")}
                  >
                    whoami
                  </button>
                  ,{" "}
                  <button
                    className="rounded bg-muted px-1.5 py-0.5 hover:bg-accent"
                    onClick={() => setInput("resume")}
                  >
                    resume
                  </button>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline">↑/↓ history · Tab complete</span>
                <a
                  href={`mailto:${SITE.email}`}
                  className="inline-flex h-7 items-center gap-1 rounded-md px-2 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                >
                  <Mail className="h-3 w-3" /> {SITE.email}
                </a>
                <a
                  href={SITE.socials.github}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="rounded p-1 hover:bg-accent"
                  aria-label="GitHub"
                >
                  <Github className="h-3.5 w-3.5" />
                </a>
                <a
                  href={SITE.socials.linkedin}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="rounded p-1 hover:bg-accent"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-3.5 w-3.5" />
                </a>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> remote
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Re-export for quick checks at build time
export const __devTerminalSkills = SKILL_LOOKUP;
