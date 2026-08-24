"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Heart, Loader2, MailCheck, Send } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { cn } from "@/lib/cn";

/** Must stay in sync with the server allowlist (CreateMessageDto). */
const CATEGORIES = [
  { id: "compliment", label: "Compliment", icon: "❤️" },
  { id: "project", label: "Project", icon: "🚀" },
  { id: "hire", label: "Hire", icon: "💼" },
  { id: "chat", label: "Just Chat", icon: "💬" },
] as const;

const EMOJIS = ["❤️", "☕", "🚀", "💼", "💬", "🙏", "🔥", "✨", "💡", "🤝", "🌟", "🎉", "👍", "🙌"];

const schema = z.object({
  category: z.enum(["compliment", "project", "hire", "chat"]),
  emoji: z.string().max(8).optional().or(z.literal("")),
  name: z.string().max(60).optional().or(z.literal("")),
  message: z
    .string()
    .min(1, "Message can't be empty")
    .max(2000, "Message is too long (max 2000 chars)"),
});

type FormValues = z.infer<typeof schema>;
type Status = "idle" | "submitting" | "success" | "error";

export function MessagesForm() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { category: "compliment", emoji: "❤️", name: "", message: "" },
  });

  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const category = watch("category");
  const emoji = watch("emoji");

  const onSubmit = async (values: FormValues) => {
    setStatus("submitting");
    setErrorMsg(null);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: values.category,
          emoji: values.emoji || undefined,
          name: values.name?.trim() || undefined,
          message: values.message.trim(),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const firstDetail = Array.isArray(data?.message) ? data.message[0] : null;
        throw new Error(firstDetail ?? data.error ?? "Couldn't send your note. Please try again.");
      }
      setStatus("success");
      reset({ category: "compliment", emoji: "❤️", name: "", message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Couldn't send your note.");
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-10 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
          <MailCheck className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-semibold">Note delivered anonymously</h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Your note reached the dashboard. Thank you — every message is read.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-medium text-foreground/80 underline-offset-4 hover:underline"
        >
          Leave another note
        </button>
      </div>
    );
  }

  const inputClass = (hasError?: boolean) =>
    cn(
      "w-full rounded-lg border bg-background px-3 py-2.5 text-sm transition-colors",
      "placeholder:text-muted-foreground/60",
      "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
      hasError ? "border-red-500" : "border-input",
    );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* Category chips */}
      <div>
        <span className="mb-2 block text-sm font-medium">What kind of note?</span>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => {
            const active = category === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setValue("category", c.id, { shouldDirty: true })}
                aria-pressed={active}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm transition-all",
                  active
                    ? "border-foreground bg-foreground text-background shadow-sm"
                    : "border-input bg-background hover:border-foreground/40 hover:bg-muted"
                )}
              >
                <span aria-hidden>{c.icon}</span>
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Emoji picker */}
      <div>
        <span className="mb-2 block text-sm font-medium">Pick a vibe</span>
        <div className="flex flex-wrap gap-1.5">
          {EMOJIS.map((e) => {
            const active = emoji === e;
            return (
              <button
                key={e}
                type="button"
                onClick={() => setValue("emoji", e, { shouldDirty: true })}
                aria-pressed={active}
                aria-label={`Use emoji ${e}`}
                className={cn(
                  "inline-flex h-9 w-9 items-center justify-center rounded-full border text-lg transition-all",
                  active
                    ? "border-foreground bg-muted ring-2 ring-foreground/20"
                    : "border-input bg-background hover:border-foreground/40 hover:bg-muted"
                )}
              >
                {e}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-[1fr_2fr]">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">
            Display name <span className="text-muted-foreground/70">(optional)</span>
          </span>
          <input
            {...register("name")}
            type="text"
            placeholder="Anonymous"
            maxLength={60}
            className={inputClass(!!errors.name)}
            disabled={status === "submitting"}
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Your note</span>
        <textarea
          {...register("message")}
          rows={5}
          maxLength={2000}
          placeholder={
            category === "compliment"
              ? "Something kind you appreciated about the work…"
              : category === "project"
              ? "A project you'd love to build together…"
              : category === "hire"
              ? "The role, the team, the timeline…"
              : "Anything on your mind…"
          }
          className={cn(inputClass(!!errors.message), "resize-y")}
          disabled={status === "submitting"}
        />
        {errors.message && (
          <span className="mt-1 block text-xs text-red-500">{errors.message.message}</span>
        )}
      </label>

      {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}

      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <p className="text-xs text-muted-foreground">
          <Heart className="mr-1 inline h-3 w-3" />
          100% anonymous — only the owner can read this.
        </p>
        <Button
          type="submit"
          size="lg"
          className="w-full sm:w-auto"
          disabled={status === "submitting"}
        >
          {status === "submitting" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending…
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Send Anonymously
            </>
          )}
        </Button>
      </div>
    </form>
  );
}