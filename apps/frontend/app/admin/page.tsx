"use client";

/**
 * /admin — Owner-only inbox.
 *
 * Lists anonymous messages, lets the owner delete spam. The browser
 * never sees the admin token — auth is enforced server-side in the
 * Next.js proxy via the ADMIN_TOKEN env, so if the dashboard renders
 * at all, the env is already valid. (Re-deploy to rotate the token.)
 */
import { useCallback, useEffect, useState } from "react";
import { Trash2, RefreshCw, Inbox, Lock, KeyRound } from "lucide-react";
import { Reveal, Stagger } from "@/app/components/reveal";

type Category = "compliment" | "hire" | "project" | "chat";

interface Message {
  id: string;
  category: Category;
  message: string;
  replyEmail: string | null;
  createdAt: string;
}

const CATEGORY_META: Record<Category, { emoji: string; label: string }> = {
  compliment: { emoji: "💬", label: "Compliment" },
  hire:       { emoji: "🤝", label: "Hire" },
  project:    { emoji: "🚀", label: "Project" },
  chat:       { emoji: "👋", label: "Chat" },
};

export default function AdminPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<Category | "all">("all");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/messages/list", { cache: "no-store" });
      if (res.status === 401) {
        throw new Error("Server admin token is invalid. Update ADMIN_TOKEN in your env.");
      }
      if (!res.ok) throw new Error(`Failed to load (${res.status})`);
      const data = await res.json();
      setMessages(data.messages ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load messages");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (id: string) => {
    if (!confirm("Delete this message permanently?")) return;
    setDeletingId(id);
    // Optimistic
    setMessages((cur) => cur.filter((m) => m.id !== id));
    try {
      const res = await fetch(`/api/messages/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
    } catch (err) {
      // Revert on failure
      await load();
      alert(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  const filtered =
    filter === "all" ? messages : messages.filter((m) => m.category === filter);

  return (
    <div className="relative min-h-screen">
      <div className="mx-auto max-w-4xl px-6 py-16 sm:py-24">
        {/* Header */}
        <Reveal as="header" className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <Lock className="h-3 w-3" />
              Owner only
            </span>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Anonymous inbox
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Messages left on the public form. Private to you.
            </p>
          </div>
          <button
            type="button"
            onClick={load}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-2 text-sm font-medium backdrop-blur transition-colors hover:bg-card"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </Reveal>

        {/* Filters */}
        <Reveal className="mb-6 flex flex-wrap items-center gap-2">
          <FilterPill active={filter === "all"} onClick={() => setFilter("all")}>
            All
          </FilterPill>
          {(Object.keys(CATEGORY_META) as Category[]).map((k) => (
            <FilterPill key={k} active={filter === k} onClick={() => setFilter(k)}>
              <span className="mr-1">{CATEGORY_META[k].emoji}</span>
              {CATEGORY_META[k].label}
            </FilterPill>
          ))}
          <span className="ml-auto text-xs text-muted-foreground">
            {messages.length} total
          </span>
        </Reveal>

        {/* Content */}
        {error ? (
          <ErrorState message={error} onRetry={load} />
        ) : loading && messages.length === 0 ? (
          <LoadingState />
        ) : filtered.length === 0 ? (
          <EmptyState hasAny={messages.length > 0} />
        ) : (
          <Stagger className="space-y-3">
            {filtered.map((m) => (
              <MessageCard
                key={m.id}
                message={m}
                onDelete={() => remove(m.id)}
                deleting={deletingId === m.id}
              />
            ))}
          </Stagger>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Pieces                                                                     */
/* -------------------------------------------------------------------------- */

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
        active
          ? "border-foreground/30 bg-foreground/5 text-foreground"
          : "border-border bg-card/40 text-muted-foreground hover:bg-card hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function MessageCard({
  message,
  onDelete,
  deleting,
}: {
  message: Message;
  onDelete: () => void;
  deleting: boolean;
}) {
  const meta = CATEGORY_META[message.category];
  const date = new Date(message.createdAt);
  const replyAllowed = !!message.replyEmail;

  return (
    <Reveal variant="up">
      <article className="card-hover gradient-border relative rounded-2xl border border-border bg-card/70 p-5 shadow-sm backdrop-blur">
        <header className="mb-3 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="text-base leading-none">{meta.emoji}</span>
            <span className="font-medium text-foreground">{meta.label}</span>
            <span>·</span>
            <time dateTime={message.createdAt}>
              {date.toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </time>
          </div>
          <button
            type="button"
            onClick={onDelete}
            disabled={deleting}
            aria-label="Delete message"
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-500 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </header>
        <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-foreground">
          {message.message}
        </p>
        {replyAllowed && (
          <footer className="mt-3 flex items-center gap-1.5 border-t border-border/60 pt-3 text-xs text-muted-foreground">
            <KeyRound className="h-3 w-3" />
            Reply email:{" "}
            <a
              href={`mailto:${message.replyEmail}`}
              className="font-medium text-foreground underline-offset-2 hover:underline"
            >
              {message.replyEmail}
            </a>
          </footer>
        )}
      </article>
    </Reveal>
  );
}

function LoadingState() {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-border bg-card/30 py-20 text-sm text-muted-foreground">
      Loading messages…
    </div>
  );
}

function EmptyState({ hasAny }: { hasAny: boolean }) {
  return (
    <Reveal variant="fade">
      <div className="grid place-items-center rounded-2xl border border-dashed border-border bg-card/30 py-20 text-center">
        <Inbox className="mb-3 h-8 w-8 text-muted-foreground/60" />
        <p className="text-sm font-medium text-foreground">
          {hasAny ? "Nothing matches this filter" : "No messages yet"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {hasAny
            ? "Try a different category."
            : "Share your site with people — they'll show up here."}
        </p>
      </div>
    </Reveal>
  );
}

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-5 text-sm">
      <p className="font-medium text-red-500">Could not load inbox</p>
      <p className="mt-1 text-xs text-muted-foreground">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-border bg-card/60 px-3 py-1.5 text-xs hover:bg-card"
      >
        <RefreshCw className="h-3 w-3" />
        Retry
      </button>
    </div>
  );
}