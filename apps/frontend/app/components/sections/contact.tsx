import { Mail, MapPin, Phone } from "lucide-react";
import { Section } from "@/app/components/ui/section";
import { ContactForm } from "@/app/components/contact-form";
import { Reveal, Stagger } from "@/app/components/reveal";
import { SITE } from "@/lib/data";

export function Contact() {
  return (
    <Section
      id="contact"
      title="Get in Touch"
      subtitle="Have a project, a role, or just want to say hi? Drop a message."
    >
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-6">
          <Reveal className="text-base text-muted-foreground sm:text-lg">
            I&apos;m currently open to <span className="font-medium text-foreground">full-time front-end / full-stack roles</span>{" "}
            and short-term contract work. If you&apos;re building something
            interesting in React, Next.js, or Nest.js — let&apos;s talk.
          </Reveal>

          <Stagger
            as="ul"
            className="space-y-4 text-sm"
            step={100}
            initialDelay={120}
            variant="up"
          >
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card">
                <Mail className="h-4 w-4" />
              </span>
              <div>
                <div className="font-medium">Email</div>
                <a
                  href={`mailto:${SITE.email}`}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {SITE.email}
                </a>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card">
                <Phone className="h-4 w-4" />
              </span>
              <div>
                <div className="font-medium">Phone</div>
                <span className="text-muted-foreground">{SITE.phone}</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card">
                <MapPin className="h-4 w-4" />
              </span>
              <div>
                <div className="font-medium">Availability</div>
                <span className="text-muted-foreground">{SITE.location}</span>
              </div>
            </li>
          </Stagger>
        </div>

        <Reveal
          variant="scale"
          delay={120}
          className="card-hover gradient-border rounded-xl border border-border bg-card p-6 sm:p-8"
        >
          <ContactForm />
        </Reveal>
      </div>
    </Section>
  );
}