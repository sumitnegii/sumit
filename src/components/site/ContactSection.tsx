import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Github, Linkedin, Mail, Send } from "lucide-react";
import { toast } from "sonner";
import { profile } from "@/data/portfolio";
import { Reveal, SectionHeading, SectionShell, relicButton } from "@/components/site/primitives";
import { RavenCinematic, preloadRavenScene } from "@/components/site/RavenCinematic";
import { useSound } from "@/components/site/sound-context";

const WEB3FORMS_ACCESS_KEY =
  (import.meta as unknown as { env?: { VITE_WEB3FORMS_ACCESS_KEY?: string } }).env
    ?.VITE_WEB3FORMS_ACCESS_KEY || "";

export function ContactSection() {
  const [sending, setSending] = useState(false);
  const [flying, setFlying] = useState(false);
  const [sent, setSent] = useState(false);
  const { cue } = useSound();

  // the cinematic must be ready before the visitor ever clicks send
  useEffect(() => {
    const el = document.getElementById("raven");
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          preloadRavenScene();
          io.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    if (!name || !email || !message) {
      toast.error("The raven needs a name, an address and a message.");
      return;
    }

    // Append Web3Forms access key and contextual subject
    if (!formData.has("access_key")) {
      formData.append("access_key", WEB3FORMS_ACCESS_KEY);
    }
    formData.append("subject", `Raven from ${name} via Realm Portfolio`);

    setSending(true);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        form.reset();
        // Dispatch the cinematic flight
        cue("raven");
        setFlying(true);
      } else {
        toast.error("THE RAVEN COULD NOT REACH ITS DESTINATION.");
      }
    } catch {
      toast.error("THE RAVEN COULD NOT REACH ITS DESTINATION.");
    } finally {
      setSending(false);
    }
  }

  // the confirmation only arrives once the bird is gone into the dark
  function onRavenGone() {
    setFlying(false);
    setSent(true);
    window.setTimeout(() => setSent(false), 5200);
  }

  return (
    <SectionShell id="raven">
      <RavenCinematic active={flying} onDone={onRavenGone} />

      <Reveal>
        <SectionHeading
          eyebrow="The Ravenry"
          title="SEND A RAVEN"
          subtitle="Have a project, opportunity, or challenge?"
        />
      </Reveal>

      <div className="mt-14 grid gap-8 md:grid-cols-[1.2fr_0.8fr]">
        <Reveal>
          <div className="relative">
            <motion.form
              onSubmit={onSubmit}
              className="panel-stone grain-overlay rounded-sm p-6 sm:p-8"
              animate={{ opacity: 1 }}
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Name" name="name" autoComplete="name" />
                <Field label="Email" name="email" type="email" autoComplete="email" />
              </div>
              <div className="mt-5">
                <label
                  htmlFor="message"
                  className="font-mono text-[0.62rem] tracking-[0.26em] text-gold-dim uppercase"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  required
                  className="mt-2 w-full resize-y rounded-sm border border-input bg-[color-mix(in_oklab,var(--background)_70%,transparent)] px-4 py-3 text-sm text-foreground transition-colors outline-none placeholder:text-muted-foreground/60 focus:border-[color-mix(in_oklab,var(--gold)_60%,transparent)]"
                  placeholder="Write your message…"
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                aria-disabled={sending}
                className={`${relicButton({ variant: "blood", size: "lg" })} mt-7 w-full sm:w-auto`}
              >
                <Send className="h-4 w-4" /> {sending ? "SENDING RAVEN..." : "SEND RAVEN"}
              </button>
            </motion.form>

            <AnimatePresence>
              {sent ? (
                <motion.p
                  key="sent"
                  role="status"
                  aria-live="polite"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                  className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center font-display text-[0.72rem] tracking-[0.42em] text-gold uppercase"
                >
                  THE RAVEN HAS BEEN SENT.
                </motion.p>
              ) : null}
            </AnimatePresence>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="panel-stone flex h-full flex-col justify-center gap-4 rounded-sm p-6 sm:p-8">
            <p className="eyebrow">Other Roads</p>
            <ContactLink
              href={`mailto:${profile.email}`}
              icon={<Mail className="h-4 w-4" />}
              label="Email"
              value={profile.email}
            />
            <ContactLink
              href={profile.github}
              icon={<Github className="h-4 w-4" />}
              label="GitHub"
              value="View repositories"
            />
            <ContactLink
              href={profile.linkedin}
              icon={<Linkedin className="h-4 w-4" />}
              label="LinkedIn"
              value="Connect professionally"
            />
          </div>
        </Reveal>
      </div>
    </SectionShell>
  );
}

function Field({
  label,
  name,
  type = "text",
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="font-mono text-[0.62rem] tracking-[0.26em] text-gold-dim uppercase"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required
        autoComplete={autoComplete}
        className="mt-2 w-full rounded-sm border border-input bg-[color-mix(in_oklab,var(--background)_70%,transparent)] px-4 py-3 text-sm text-foreground transition-colors outline-none focus:border-[color-mix(in_oklab,var(--gold)_60%,transparent)]"
      />
    </div>
  );
}

function ContactLink({
  href,
  icon,
  label,
  value,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noreferrer"
      className="group flex items-center gap-4 border-b border-border/60 pb-4 last:border-0"
    >
      <span className="text-gold-dim transition-colors group-hover:text-gold">{icon}</span>
      <span>
        <span className="block font-display text-[0.66rem] tracking-[0.26em] text-parchment uppercase">
          {label}
        </span>
        <span className="block text-sm text-muted-foreground">{value}</span>
      </span>
    </a>
  );
}
