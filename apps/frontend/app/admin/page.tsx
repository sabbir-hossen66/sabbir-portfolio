"use client";

/**
 * /admin — Beautiful owner-only inbox with login & infinite scroll.
 *
 * Login: User enters their ADMIN_TOKEN → stored in sessionStorage.
 * Messages: Fetched page-by-page via IntersectionObserver (infinite scroll).
 * Token is sent from the browser → Next.js API route → NestJS backend.
 * It is never stored in plain text beyond sessionStorage.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Inbox,
  KeyRound,
  Loader2,
  Lock,
  LogOut,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  Trash2,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";

const TOKEN_KEY = "portfolio-admin-token";
const PAGE_SIZE = 20;

type Category = "compliment" | "project" | "hire" | "chat";

type Message = {
  id: string;
  category: Category;
  emoji: string | null;
  name: string | null;
  message: string;
  replyEmail?: string | null;
  createdAt: string;
};

type PageState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "error"; error: string };

const CATEGORY_META: Record<Category, { label: string; icon: string; tone: string }> = {
  compliment: { label: "Compliment", icon: "💬", tone: "bg-rose-500/10 text-rose-500 border-rose-500/20" },
  project:    { label: "Project",    icon: "🚀", tone: "bg-sky-500/10 text-sky-500 border-sky-500/20" },
  hire:       { label: "Hire",       icon: "🤝", tone: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  chat:       { label: "Just Chat",  icon: "💬", tone: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
};

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

/* ─────────────────────────────────────────────────────────── */
/*  Login Page                                                  */
/* ─────────────────────────────────────────────────────────── */
function LoginPage({ onLogin }: { onLogin: (token: string) => void }) {
  const [input, setInput] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = input.trim();
    if (!token) { setError("Please enter your admin token."); return; }

    setLoading(true);
    setError(null);

    // Verify token is correct before entering
    try {
      const res = await fetch("/api/messages/admin-list?limit=1", {
        headers: { authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        setError("Invalid token. Please check your ADMIN_TOKEN and try again.");
        setLoading(false);
        return;
      }
      if (!res.ok) {
        setError(`Server error (${res.status}). Please try again.`);
        setLoading(false);
        return;
      }
      window.sessionStorage.setItem(TOKEN_KEY, token);
      onLogin(token);
    } catch {
      setError("Could not connect to the server. Make sure the API is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12 text-foreground">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to portfolio
        </Link>

        <div className="card-hover gradient-border rounded-2xl border border-border bg-card p-8 shadow-sm">
          {/* Icon + title */}
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/20">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">Admin Access</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Enter your secret token to view the anonymous inbox.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Admin Token
              </label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  autoComplete="off"
                  autoFocus
                  value={input}
                  onChange={(e) => { setInput(e.target.value); setError(null); }}
                  placeholder="Paste your token here…"
                  className={cn(
                    "w-full rounded-xl border bg-background/60 px-4 py-3 pr-11 text-sm transition-colors outline-none",
                    "placeholder:text-muted-foreground/50",
                    "focus:border-foreground/30 focus:ring-2 focus:ring-foreground/10",
                    error ? "border-red-500/60" : "border-border",
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={show ? "Hide token" : "Show token"}
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-xs text-red-500"
                >
                  <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-3 text-sm font-semibold text-background transition-all hover:bg-foreground/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verifying…
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  Enter Inbox
                </>
              )}
            </button>
          </form>

          <p className="mt-5 flex items-start gap-2 text-xs text-muted-foreground">
            <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
            Token is saved only in your browser session — cleared when you close
            the tab.
          </p>
        </div>

       
      </motion.div>
    </main>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  Message Card                                               */
/* ─────────────────────────────────────────────────────────── */
function MessageCard({
  message,
  onDelete,
  deleting,
}: {
  message: Message;
  onDelete: () => void;
  deleting: boolean;
}) {
  const meta = CATEGORY_META[message.category] ?? { label: message.category, icon: "📨", tone: "bg-muted text-muted-foreground border-border" };

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      layout
      className="card-hover gradient-border rounded-2xl border border-border bg-card/70 p-5 shadow-sm backdrop-blur"
    >
      <header className="mb-3 flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium", meta.tone)}>
            <span>{meta.icon}</span>
            {meta.label}
          </span>
          <span className="text-xs text-muted-foreground">{formatDate(message.createdAt)}</span>
        </div>
        <button
          type="button"
          onClick={onDelete}
          disabled={deleting}
          aria-label="Delete message"
          className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-500 disabled:opacity-40"
        >
          {deleting
            ? <Loader2 className="h-4 w-4 animate-spin" />
            : <Trash2 className="h-4 w-4" />
          }
        </button>
      </header>

      <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-foreground">
        {message.message}
      </p>

      {message.replyEmail && (
        <footer className="mt-3 flex items-center gap-1.5 border-t border-border/50 pt-3 text-xs text-muted-foreground">
          <CheckCircle2 className="h-3 w-3 text-emerald-500" />
          Reply to:{" "}
          <a
            href={`mailto:${message.replyEmail}`}
            className="font-medium text-foreground underline-offset-2 hover:underline"
          >
            {message.replyEmail}
          </a>
        </footer>
      )}
    </motion.article>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  Main Inbox                                                  */
/* ─────────────────────────────────────────────────────────── */
function InboxPage({ token, onLogout }: { token: string; onLogout: () => void }) {
  const [messages, setMessages]   = useState<Message[]>([]);
  const [cursor, setCursor]       = useState<string | null>(null);
  const [hasMore, setHasMore]     = useState(true);
  const [pageState, setPageState] = useState<PageState>({ kind: "loading" });
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filter, setFilter]       = useState<Category | "all">("all");

  const sentinelRef = useRef<HTMLDivElement>(null);
  const isLoadingRef = useRef(false);

  // ── Fetch a page ────────────────────────────────────────
  const fetchPage = useCallback(async (cur: string | null, reset = false) => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    setPageState({ kind: "loading" });

    const qs = new URLSearchParams({ limit: String(PAGE_SIZE) });
    if (cur) qs.set("cursor", cur);

    try {
      const res = await fetch(`/api/messages/admin-list?${qs}`, {
        headers: { authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        window.sessionStorage.removeItem(TOKEN_KEY);
        onLogout();
        return;
      }
      if (!res.ok) throw new Error(`Request failed (${res.status})`);

      const raw = (await res.json()) as unknown;
      let items: Message[] = [];
      let nextCursor: string | null = null;

      if (raw && typeof raw === "object") {
        const r = raw as Record<string, unknown>;
        if (Array.isArray(r.items))    items = r.items as Message[];
        else if (Array.isArray(r.messages)) items = r.messages as Message[];
        if (typeof r.nextCursor === "string") nextCursor = r.nextCursor;
      }

      setMessages((prev) => reset ? items : [...prev, ...items]);
      setCursor(nextCursor);
      setHasMore(items.length === PAGE_SIZE && nextCursor !== null);
      setPageState({ kind: "idle" });
    } catch (err) {
      setPageState({ kind: "error", error: err instanceof Error ? err.message : "Something went wrong." });
    } finally {
      isLoadingRef.current = false;
    }
  }, [token, onLogout]);

  // ── Initial load ─────────────────────────────────────────
  useEffect(() => {
    void fetchPage(null, true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Infinite scroll via IntersectionObserver ────────────
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && pageState.kind === "idle") {
          void fetchPage(cursor);
        }
      },
      { rootMargin: "200px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [cursor, hasMore, pageState, fetchPage]);

  // ── Delete ───────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this message? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: "DELETE",
        headers: { authorization: `Bearer ${token}` },
      });
      if (res.status === 401) { onLogout(); return; }
      if (!res.ok) throw new Error("Delete failed");
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Delete failed.");
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = filter === "all" ? messages : messages.filter((m) => m.category === filter);

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* ── Top bar ─────────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Portfolio</span>
            </Link>
            <span className="text-border">·</span>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                <Inbox className="h-3.5 w-3.5" />
              </span>
              <div>
                <p className="text-sm font-semibold leading-tight">Anonymous Inbox</p>
                <p className="text-xs text-muted-foreground">
                  {messages.length > 0 ? `${messages.length} message${messages.length !== 1 ? "s" : ""}` : "No messages yet"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => { setMessages([]); setCursor(null); setHasMore(true); void fetchPage(null, true); }}
              disabled={pageState.kind === "loading"}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-card/60 px-3 text-sm font-medium hover:bg-card disabled:opacity-50"
            >
              <RefreshCcw className={cn("h-4 w-4", pageState.kind === "loading" && "animate-spin")} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-card/60 px-3 text-sm font-medium hover:bg-card"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Filter pills ─────────────────────────────────── */}
      <div className="mx-auto max-w-4xl px-4 pt-6">
        <div className="flex flex-wrap items-center gap-2">
          {(["all", "compliment", "hire", "project", "chat"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors capitalize",
                filter === f
                  ? "border-foreground/30 bg-foreground/5 text-foreground"
                  : "border-border bg-card/40 text-muted-foreground hover:bg-card hover:text-foreground",
              )}
            >
              {f === "all" ? "All" : `${CATEGORY_META[f].icon} ${CATEGORY_META[f].label}`}
            </button>
          ))}
          <span className="ml-auto text-xs text-muted-foreground">
            {filtered.length} shown
          </span>
        </div>
      </div>

      {/* ── Message list ─────────────────────────────────── */}
      <div className="mx-auto max-w-4xl px-4 pb-20 pt-5">
        {/* Error banner */}
        {pageState.kind === "error" && (
          <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-500">
            <p className="font-medium">Could not load messages</p>
            <p className="mt-1 text-xs text-muted-foreground">{pageState.error}</p>
            <button
              type="button"
              onClick={() => void fetchPage(cursor)}
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-border bg-card/60 px-3 py-1.5 text-xs hover:bg-card"
            >
              <RefreshCcw className="h-3 w-3" /> Retry
            </button>
          </div>
        )}

        {/* Initial loading skeleton */}
        {pageState.kind === "loading" && messages.length === 0 && (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-2xl border border-border bg-card/40" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {pageState.kind !== "loading" && filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/30 py-24 text-center"
          >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Inbox className="h-6 w-6 text-muted-foreground/60" />
            </div>
            <p className="text-sm font-medium text-foreground">
              {filter === "all" ? "No messages yet" : `No ${filter} messages`}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {filter === "all"
                ? "Share your portfolio — messages will appear here."
                : "Try switching to a different category."}
            </p>
          </motion.div>
        )}

        {/* Cards */}
        <AnimatePresence mode="popLayout">
          <div className="space-y-3">
            {filtered.map((m) => (
              <MessageCard
                key={m.id}
                message={m}
                onDelete={() => handleDelete(m.id)}
                deleting={deletingId === m.id}
              />
            ))}
          </div>
        </AnimatePresence>

        {/* Sentinel — triggers more loading */}
        <div ref={sentinelRef} className="py-4 flex items-center justify-center">
          {pageState.kind === "loading" && messages.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading more…
            </div>
          )}
          {!hasMore && messages.length > 0 && (
            <p className="text-xs text-muted-foreground">
              You've seen all {messages.length} messages ✓
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  Root                                                        */
/* ─────────────────────────────────────────────────────────── */
export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);

  // Restore from sessionStorage
  useEffect(() => {
    const stored = window.sessionStorage.getItem(TOKEN_KEY);
    if (stored) setToken(stored);
  }, []);

  const handleLogin = (t: string) => {
    window.sessionStorage.setItem(TOKEN_KEY, t);
    setToken(t);
  };

  const handleLogout = () => {
    window.sessionStorage.removeItem(TOKEN_KEY);
    setToken(null);
  };

  if (!token) return <LoginPage onLogin={handleLogin} />;
  return <InboxPage token={token} onLogout={handleLogout} />;
}