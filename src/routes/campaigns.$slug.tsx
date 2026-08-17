import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { projects } from "@/data/portfolio";
import { Reveal, TechBadge, relicButton } from "@/components/site/primitives";
import { ParticleBackground } from "@/components/site/ParticleBackground";
import { Footer } from "@/components/site/Footer";
import { BranOracle } from "@/components/site/bran/BranOracle";

export const Route = createFileRoute("/campaigns/$slug")({
  loader: ({ params }) => {
    const project = projects.find((p) => p.slug === params.slug);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Campaign not found" }, { name: "robots", content: "noindex" }],
      };
    }
    const t = `${loaderData.project.name} — Case Study | Sumit Singh`;
    const d = loaderData.project.oneLiner;
    return {
      meta: [
        { title: t },
        { name: "description", content: d },
        { property: "og:title", content: t },
        { property: "og:description", content: d },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: CampaignDetail,
  notFoundComponent: CampaignNotFound,
});

function CampaignNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="font-display text-3xl tracking-[0.14em] text-gold-gradient uppercase">
        No such campaign
      </h1>
      <p className="text-sm text-muted-foreground">This chapter is not in the records.</p>
      <Link to="/" className={relicButton({ variant: "forged", size: "md" })}>
        Return to the Realm
      </Link>
    </div>
  );
}

function CampaignDetail() {
  const { project } = Route.useLoaderData();

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <header className="relative h-[52vh] min-h-[360px] overflow-hidden">
        <img
          src={project.image}
          alt={`${project.realm} — visual environment for ${project.name}`}
          width={1024}
          height={768}
          className="h-full w-full object-cover opacity-55"
        />
        <div className="absolute inset-0" style={{ background: "var(--gradient-veil)" }} />
        <ParticleBackground density={18} />
        <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-5xl px-5 pb-10 sm:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-mono text-[0.62rem] tracking-[0.26em] text-gold-dim uppercase transition-colors hover:text-gold"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to the Realm
          </Link>
          <p className="eyebrow mt-6">{project.realm}</p>
          <h1 className="mt-3 text-3xl tracking-[0.1em] text-gold-gradient uppercase sm:text-5xl">
            {project.name}
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
            {project.oneLiner}
          </p>
        </div>
      </header>

      <main className="relative mx-auto w-full max-w-5xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-12 md:grid-cols-[1fr_280px] md:items-start">
          <div className="space-y-12">
            <Prose title="Overview" body={project.overview} />
            <Prose title="The Problem" body={project.problem} />
            <Prose title="The Solution" body={project.solution} />

            <Reveal>
              <h2 className="font-display text-sm tracking-[0.3em] text-parchment uppercase">
                Architecture
              </h2>
              <div className="rule-gold mt-4 w-full" />
              <ol className="mt-6 space-y-3">
                {project.architecture.map((layer, i) => (
                  <li
                    key={layer}
                    className="panel-stone flex items-start gap-4 rounded-sm p-4 text-sm text-muted-foreground"
                  >
                    <span className="font-mono text-[0.7rem] text-gold-dim">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {layer}
                  </li>
                ))}
              </ol>
            </Reveal>

            <List title="Key Features" items={project.features} />
            <List title="Challenges" items={project.challenges} />
            <List title="What I Built" items={project.built} />
            <List title="Results" items={project.results} />
          </div>

          <aside className="space-y-6 md:sticky md:top-24">
            <div className="panel-stone rounded-sm p-6">
              <p className="eyebrow">Technologies</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.technologies.map((t) => (
                  <TechBadge key={t} label={t} />
                ))}
              </div>
            </div>
            {project.github || project.demo ? (
              <div className="flex flex-col gap-3">
                {project.github ? (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    className={relicButton({ variant: "forged", size: "md" })}
                  >
                    <Github className="h-4 w-4" /> GitHub
                  </a>
                ) : null}
                {project.demo ? (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noreferrer"
                    className={relicButton({ variant: "stone", size: "md" })}
                  >
                    <ExternalLink className="h-4 w-4" /> Live Demo
                  </a>
                ) : null}
              </div>
            ) : null}
            <Link
              to="/"
              hash="campaigns"
              className={`${relicButton({ variant: "ghost", size: "sm" })} w-full`}
            >
              All Campaigns
            </Link>
          </aside>
        </div>
      </main>

      <BranOracle />
      <Footer />
    </div>
  );
}

function Prose({ title, body }: { title: string; body: string }) {
  return (
    <Reveal>
      <h2 className="font-display text-sm tracking-[0.3em] text-parchment uppercase">{title}</h2>
      <div className="rule-gold mt-4 w-full" />
      <p className="mt-5 text-base leading-relaxed text-muted-foreground">{body}</p>
    </Reveal>
  );
}

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <Reveal>
      <h2 className="font-display text-sm tracking-[0.3em] text-parchment uppercase">{title}</h2>
      <div className="rule-gold mt-4 w-full" />
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
            <span className="mt-2 h-1 w-1 shrink-0 rotate-45 bg-gold-dim" />
            {item}
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
