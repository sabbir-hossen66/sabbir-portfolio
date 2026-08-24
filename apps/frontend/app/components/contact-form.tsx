"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, MailCheck, Send } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { cn } from "@/lib/cn";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(80),
  email: z.string().email("Please enter a valid email"),
  subject: z.string().min(3, "Subject is too short").max(120),
  message: z.string().min(10, "Tell me a bit more (min 10 chars)").max(2000),
});

type FormValues = z.infer<typeof schema>;

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const onSubmit = async (values: FormValues) => {
    setStatus("submitting");
    setErrorMsg(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }
      setStatus("success");
      reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-10 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
          <MailCheck className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-semibold">Message sent</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Thanks for reaching out. I&apos;ll get back to you within 1–2 business days.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-medium text-foreground/80 underline-offset-4 hover:underline"
        >
          Send another message
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" error={errors.name?.message}>
          <input
            {...register("name")}
            type="text"
            placeholder="Your name"
            className={inputClass(!!errors.name)}
            disabled={status === "submitting"}
          />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <input
            {...register("email")}
            type="email"
            placeholder="you@company.com"
            className={inputClass(!!errors.email)}
            disabled={status === "submitting"}
          />
        </Field>
      </div>

      <Field label="Subject" error={errors.subject?.message}>
        <input
          {...register("subject")}
          type="text"
          placeholder="What's it about?"
          className={inputClass(!!errors.subject)}
          disabled={status === "submitting"}
        />
      </Field>

      <Field label="Message" error={errors.message?.message}>
        <textarea
          {...register("message")}
          rows={5}
          placeholder="Tell me about your project, timeline, and what you're looking for."
          className={cn(inputClass(!!errors.message), "resize-y")}
          disabled={status === "submitting"}
        />
      </Field>

      {errorMsg && (
        <p className="text-sm text-red-500">{errorMsg}</p>
      )}

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
            Send Message
          </>
        )}
      </Button>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
    </label>
  );
}