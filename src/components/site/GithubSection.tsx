import { Github, Code2, GitFork, BookOpen } from "lucide-react";
import { profile } from "@/data/portfolio";
import { Reveal, SectionHeading, SectionShell, relicButton } from "@/components/site/primitives";

/**
 * The Archives — Repository History & Code Records from @sumitnegii.
 */
const panels = [
  {
    title: "42 Repositories",
    subtitle: "Public Work & Systems",
    note: "Notification systems, AI multi-agent ATS, lead management, and microservices.",
    icon: BookOpen,
  },
  {
    title: "Core Languages",
    subtitle: "Java · TypeScript · Python · C++",
    note: "Enterprise Spring Boot, FastAPI RAG services, Node.js and modern React frontends.",
    icon: Code2,
  },
  {
    title: "Active Engineering",
    subtitle: "Open Source & Architecture",
    note: "Regular commits, systems design, API integrations, and backend workflows.",
    icon: GitFork,
  },
];

export function GithubSection() {
  return (
    <SectionShell id="archives" className="py-20 md:py-24">
      <Reveal>
        <SectionHeading
          eyebrow="The Scribe"
          title="THE ARCHIVES"
          subtitle="Repository history and recorded work."
        />
      </Reveal>

      <Reveal delay={0.12}>
        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {panels.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="panel-stone group rounded-sm p-6 text-center transition-colors hover:border-gold/30"
              >
                <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-gold/10 text-gold transition-colors group-hover:bg-gold/20">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="font-display text-sm tracking-[0.24em] text-parchment uppercase">
                  {p.title}
                </p>
                <p className="mt-1 font-mono text-[0.62rem] tracking-[0.2em] text-gold-dim uppercase">
                  {p.subtitle}
                </p>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{p.note}</p>
              </div>
            );
          })}
        </div>
      </Reveal>

      <Reveal delay={0.2}>
        <div className="mt-10 text-center">
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className={relicButton({ variant: "forged", size: "lg" })}
          >
            <Github className="h-4 w-4" /> Visit @sumitnegii on GitHub
          </a>
        </div>
      </Reveal>
    </SectionShell>
  );
}
