"use client";

/**
 * Anonymous messages section.
 *
 * Anyone can leave a message — a compliment, a hire inquiry, a project
 * note, or just a friendly hello. The owner reads them at /admin.
 *
 * No auth, no account required. Submission is anonymous; the only
 * optional field is a reply email (only used if you tick "allow reply").
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, Loader2, ShieldCheck, X } from "lucide-react";
import { Reveal, Stagger } from "@/app/components/reveal";

function SuccessToast({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="fixed right-4 top-4 z-50 flex items-start gap-3 rounded-2xl border border-emerald-500/30 bg-card/90 p-4 shadow-lg backdrop-blur-sm sm:right-6 sm:top-6 sm:min-w-[320px]"
    >
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500">
        <CheckCircle2 className="h-4 w-4" />
      </span>
      <div className="flex-1">
        <p className="text-sm font-semibold text-foreground">Message sent! 🎉</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Thanks for reaching out. I&apos;ll read it soon.
        </p>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="ml-1 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label="Close"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </motion.div>
  );
}

type Category = "compliment" | "hire" | "project" | "chat";

const CATEGORIES: { id: Category; label: string; emoji: string; hint: string }[] = [
  { id: "compliment", label: "Compliment", emoji: "💬", hint: "Say something nice" },
  { id: "hire",      label: "Hire me",    emoji: "🤝", hint: "Project / role inquiry" },
  { id: "project",   label: "Project",    emoji: "🚀", hint: "Feedback on my work" },
  { id: "chat",      label: "Just chat",  emoji: "👋", hint: "Anything else" },
];

const MAX_MESSAGE = 1000;
const COOLDOWN_MS = 15_000; // simple client-side throttle

export function MessagesSection() {
  const [category, setCategory] = useState<Category>("compliment");
  const [message, setMessage]   = useState("");
  const [replyEmail, setReplyEmail] = useState("");
  const [allowReply, setAllowReply] = useState(false);

  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  const canSend =
    message.trim().length >= 3 &&
    status !== "sending" &&
    (!allowReply || /.+@.+\..+/.test(replyEmail));

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!canSend) return;

    // Client-side throttle — one submission every 15s.
    const last = Number(localStorage.getItem("anon_msg_last") ?? 0);
    if (Date.now() - last < COOLDOWN_MS) {
      setStatus("error");
      setErrorMsg("Please wait a few seconds before sending another message.");
      return;
    }

    setStatus("sending");
    setErrorMsg(null);

    try {
      const res = await fetch("/api/messages/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          message: message.trim(),
          replyEmail: allowReply ? replyEmail.trim() : undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message ?? data?.error ?? "Failed to send");
      }

      localStorage.setItem("anon_msg_last", String(Date.now()));
      setMessage("");
      setReplyEmail("");
      setAllowReply(false);
      setStatus("sent");
      setShowToast(true);

      // Reset success state after a moment so the user can send again
      setTimeout(() => {
        setStatus("idle");
        setShowToast(false);
      }, 4000);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <>
      {/* Success Toast */}
      <AnimatePresence>
        {showToast && (
          <SuccessToast onClose={() => setShowToast(false)} />
        )}
      </AnimatePresence>

    <section id="messages" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-6">
        <Stagger as="header" step={80} className="mb-10 text-center">
          <Reveal variant="fade" as="span" className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <ShieldCheck className="h-3.5 w-3.5" />
            Anonymous · End-to-end yours
          </Reveal>
          <Reveal as="h2" className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Drop me a note
          </Reveal>
          <Reveal as="p" className="mt-3 text-balance text-muted-foreground">
            A compliment, a hire inquiry, or just a hello. Only I can read these.
          </Reveal>
        </Stagger>

        <Reveal>
          <form
            onSubmit={submit}
            className="card-hover gradient-border relative rounded-2xl border border-border bg-card/70 p-6 shadow-sm backdrop-blur sm:p-8"
          >
            {/* Category picker */}
            <fieldset className="mb-6">
              <legend className="mb-2 text-sm font-medium text-foreground">
                What&apos;s this about?
              </legend>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategory(c.id)}
                    aria-pressed={category === c.id}
                    className={`group flex flex-col items-start gap-1 rounded-xl border px-3 py-2.5 text-left text-sm transition-all ${
                      category === c.id
                        ? "border-foreground/30 bg-foreground/5 ring-1 ring-foreground/20"
                        : "border-border bg-background/40 hover:bg-foreground/[0.03]"
                    }`}
                  >
                    <span className="text-base">{c.emoji}</span>
                    <span className="font-medium">{c.label}</span>
                    <span className="text-[11px] text-muted-foreground">
                      {c.hint}
                    </span>
                  </button>
                ))}
              </div>
            </fieldset>

            {/* Message */}
            <label className="mb-1 block text-sm font-medium text-foreground">
              Your message
            </label>
            <div className="relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, MAX_MESSAGE))}
                placeholder="Say anything — be kind, be honest, be you."
                rows={5}
                maxLength={MAX_MESSAGE}
                className="w-full resize-none rounded-xl border border-border bg-background/60 px-4 py-3 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/70 outline-none transition-colors focus:border-foreground/30 focus:ring-2 focus:ring-foreground/10"
              />
              <span className="absolute bottom-2 right-3 text-[11px] text-muted-foreground">
                {message.length}/{MAX_MESSAGE}
              </span>
            </div>

            {/* Optional reply */}
            <div className="mt-5 rounded-xl border border-border/60 bg-background/40 p-3">
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={allowReply}
                  onChange={(e) => setAllowReply(e.target.checked)}
                  className="h-4 w-4 rounded border-border accent-foreground"
                />
                <span className="text-foreground">Leave an email if you want a reply</span>
              </label>
              <AnimatePresence initial={false}>
                {allowReply && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <input
                      type="email"
                      value={replyEmail}
                      onChange={(e) => setReplyEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="mt-2 w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-foreground/30 focus:ring-2 focus:ring-foreground/10"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Submit row */}
            <div className="mt-6 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground">
                Anonymous by default. Stored in my private database.
              </p>
              <button
                type="submit"
                disabled={!canSend}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background shadow-sm transition-all duration-300 ease-out-expo hover:scale-[1.02] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
              >
                {status === "sending" && (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending…
                  </>
                )}
                {status === "sent" && (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Sent — thank you
                  </>
                )}
                {(status === "idle" || status === "error") && (
                  <>
                    Send
                    <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </div>

            {/* Error */}
            <AnimatePresence>
              {status === "error" && errorMsg && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-3 text-xs text-red-500"
                >
                  {errorMsg}
                </motion.p>
              )}
            </AnimatePresence>
          </form>
        </Reveal>
      </div>
    </section>
    </>
  );
}
