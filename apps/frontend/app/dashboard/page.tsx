"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Inbox,
  KeyRound,
  Loader2,
  LogOut,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  Trash2,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { cn } from "@/lib/cn";

const TOKEN_KEY = "portfolio-admin-token";

type Category = "compliment" | "project" | "hire" | "chat";

type Message = {
  id: string;
  category: Category;
  emoji: string | null;
  name: string | null;
  message: string;
  createdAt: string;
};

type FetchState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "ready"; data: Message[] }
  | { kind: "error"; error: string };

const CATEGORY_META: Record<
  Category,
  { label: string; icon: string; tone: string }
> = {
  compliment: {
    label: "Compliment",
    icon: "❤️",
    tone: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  },
  project: {
    label: "Project",
    icon: "🚀",
    tone: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  },
  hire: {
    label: "Hire",
    icon: "💼",
    tone: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  chat: {
    label: "Just Chat",
    icon: "💬",
    tone: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function DashboardPage() {
  const [token, setToken] = useState<string | null>(null);
  const [tokenInput, setTokenInput] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [state, setState] = useState<FetchState>({ kind: "idle" });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Load token from sessionStorage on mount.
  useEffect(() => {
    const stored = window.sessionStorage.getItem(TOKEN_KEY);
    if (stored) setToken(stored);
  }, []);

  const fetchMessages = useCallback(async (auth: string) => {
    setState({ kind: "loading" });
    try {
      const res = await fetch(
        `/api/messages/list?limit=100`,
        {
          method: "GET",
          cache: "no-store",
          headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
        },
      );

      if (res.status === 401) {
        setAuthError(
          "Dashboard misconfigured — the server rejected the request. Check ADMIN_TOKEN in apps/api/.env.",
        );
        setState({ kind: "idle" });
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `Request failed (${res.status})`);
      }

      // Accept either { items: [] } (current Nest shape) or { messages: [] }
      // (legacy / future shape). Fall back to [] only when we genuinely don't
      // recognise the payload — don't silently coerce nested objects to [].
      const raw = (await res.json()) as unknown;
      let items: Message[] = [];
      if (raw && typeof raw === "object") {
        const r = raw as Record<string, unknown>;
        if (Array.isArray(r.items)) items = r.items as Message[];
        else if (Array.isArray(r.messages)) items = r.messages as Message[];
      }
      setState({ kind: "ready", data: items });
    } catch (err) {
      setState({
        kind: "error",
        error: err instanceof Error ? err.message : "Something went wrong.",
      });
    }
  }, []);
    } catch (err) {
      setState({
        kind: "error",
        error: err instanceof Error ? err.message : "Something went wrong.",
      });
    }
  }, []);

  // Fetch when token becomes available.
  useEffect(() => {
    if (token) {
      void fetchMessages(token);
    }
  }, [token, fetchMessages]);

  const handleLogin = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const next = tokenInput.trim();
      if (!next) {
        setAuthError("Please paste your admin token.");
        return;
      }
      setAuthError(null);
      window.sessionStorage.setItem(TOKEN_KEY, next);
      setToken(next);
      setTokenInput("");
    },
    [tokenInput],
  );

  const handleLogout = useCallback(() => {
    window.sessionStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setState({ kind: "idle" });
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      const ok = window.confirm(
        "Delete this message? This action cannot be undone.",
      );
      if (!ok) return;

      setDeletingId(id);
      try {
        const res = await fetch(`/api/messages/${id}`, {
          method: "DELETE",
        });

        if (res.status === 401) {
          window.sessionStorage.removeItem(TOKEN_KEY);
          setToken(null);
          setAuthError("Session expired. Please sign in again.");
          setState({ kind: "idle" });
          return;
        }

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? `Delete failed (${res.status})`);
        }

        setState((prev) => {
          if (prev.kind !== "ready") return prev;
          return { kind: "ready", data: prev.data.filter((m) => m.id !== id) };
        });
      } catch (err) {
        window.alert(
          err instanceof Error ? err.message : "Failed to delete message.",
        );
      } finally {
        setDeletingId(null);
      }
    },
    [token],
  );

  const messages = state.kind === "ready" ? state.data : [];

  const grouped = useMemo(() => {
    const out: Record<Category, Message[]> = {
      compliment: [],
      project: [],
      hire: [],
      chat: [],
    };
    for (const m of messages) {
      out[m.category].push(m);
    }
    return out;
  }, [messages]);

  // ── Login view ────────────────────────────────────────────────────────
  if (!token) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12 text-foreground">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to portfolio
          </Link>

          <div className="card-hover gradient-border rounded-2xl border border-border bg-card p-8 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <KeyRound className="h-5 w-5" />
              </span>
              <div>
                <h1 className="text-xl font-semibold">Dashboard access</h1>
                <p className="text-sm text-muted-foreground">
                  Private inbox for anonymous notes.
                </p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium">
                  Admin token
                </span>
                <input
                  type="password"
                  autoComplete="off"
                  autoFocus
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder="Paste your token"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm transition-colors placeholder:text-muted-foreground/60 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                />
              </label>

              {authError && (
                <p className="flex items-center gap-1.5 text-sm text-red-500">
                  <XCircle className="h-4 w-4" />
                  {authError}
                </p>
              )}

              <Button type="submit" size="lg" className="w-full">
                <ShieldCheck className="h-4 w-4" />
                Unlock inbox
              </Button>

              <p className="flex items-start gap-2 text-xs text-muted-foreground">
                <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                Token is stored only in your browser session and never sent to
                the site.
              </p>
            </form>
          </div>
        </div>
      </main>
    );
  }

  // ── Authed view ───────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Inbox className="h-4 w-4" />
            </span>
            <div>
              <h1 className="text-base font-semibold sm:text-lg">
                Anonymous inbox
              </h1>
              <p className="text-xs text-muted-foreground sm:text-sm">
                {messages.length === 0
                  ? "No notes yet"
                  : `${messages.length} ${messages.length === 1 ? "note" : "notes"}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => fetchMessages(token)}
              disabled={state.kind === "loading"}
            >
              <RefreshCcw
                className={cn(
                  "h-4 w-4",
                  state.kind === "loading" && "animate-spin",
                )}
              />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
            <Link
              href="/"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-sm font-medium hover:bg-muted"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Site</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-6xl px-4 py-8">
        {state.kind === "loading" && (
          <div className="flex items-center justify-center gap-2 py-20 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading notes…
          </div>
        )}

        {state.kind === "error" && (
          <div className="card-hover gradient-border rounded-xl border border-border bg-card p-6 text-sm text-red-500">
            <div className="flex items-start gap-2">
              <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <p className="font-medium">Couldn&apos;t load messages.</p>
                <p className="mt-1 text-muted-foreground">{state.error}</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="mt-4"
              onClick={() => fetchMessages(token)}
            >
              <RefreshCcw className="h-4 w-4" />
              Try again
            </Button>
          </div>
        )}

        {state.kind === "ready" && messages.length === 0 && (
          <div className="card-hover gradient-border mx-auto max-w-md rounded-xl border border-border bg-card p-10 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-semibold">Inbox zero</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              No anonymous notes yet. Share your portfolio link to start
              receiving messages.
            </p>
          </div>
        )}

        {state.kind === "ready" && messages.length > 0 && (
          <div className="grid gap-8">
            {(Object.keys(grouped) as Category[]).map((cat) => {
              const list = grouped[cat];
              if (list.length === 0) return null;
              const meta = CATEGORY_META[cat];
              return (
                <section key={cat}>
                  <header className="mb-4 flex items-center gap-2">
                    <span
                      className={cn(
                        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium",
                        meta.tone,
                      )}
                    >
                      <span aria-hidden>{meta.icon}</span>
                      {meta.label}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {list.length}
                    </span>
                  </header>

                  <ul className="grid gap-3">
                    {list.map((m) => (
                      <li
                        key={m.id}
                        className="card-hover gradient-border rounded-xl border border-border bg-card p-5"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                            {m.emoji && (
                              <span className="text-lg leading-none">
                                {m.emoji}
                              </span>
                            )}
                            <span className="font-medium text-foreground">
                              {m.name?.trim() || "Anonymous"}
                            </span>
                            <span aria-hidden>·</span>
                            <span>{formatDate(m.createdAt)}</span>
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(m.id)}
                            disabled={deletingId === m.id}
                            className="h-8 px-2 text-muted-foreground hover:bg-red-500/10 hover:text-red-500"
                            aria-label="Delete message"
                          >
                            {deletingId === m.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-relaxed">
                          {m.message}
                        </p>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}