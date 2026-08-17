import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { useInView } from "motion/react";
import { ArrowRight, ExternalLink, Github } from "lucide-react";
import type { Project } from "@/data/portfolio";
import { relicButton } from "@/components/site/primitives";
import { CampaignEnvironment } from "@/components/site/CampaignEnvironment";

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const flipped = index % 2 === 1;
  const ref = useRef<HTMLElement | null>(null);
  // Environments only breathe while you are actually looking at them.
  const live = useInView(ref, { margin: "-10% 0px -10% 0px" });

  return (
    <article ref={ref} className="group panel-stone grain-overlay overflow-hidden rounded-sm">
      <div
        className={`grid gap-0 md:grid-cols-2 ${flipped ? "md:[&>figure]:order-2" : ""}`}
      >
        <figure className="relative h-56 overflow-hidden sm:h-72 md:h-full md:min-h-[340px]">
          <img
            src={project.image}
            alt={`${project.realm} — visual environment for ${project.name}`}
            width={1024}
            height={768}
            loading="lazy"
            className="h-full w-full object-cover opacity-[0.62] transition-all duration-[1400ms] ease-out group-hover:scale-[1.03] group-hover:opacity-[0.82]"
          />
          <CampaignEnvironment slug={project.slug} live={live} />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,oklch(0_0_0/0.85),transparent_60%)]" />
          <figcaption className="absolute bottom-4 left-5 font-mono text-[0.6rem] tracking-[0.3em] text-gold-dim uppercase">
            {project.realm}
          </figcaption>
        </figure>


        <div className="flex flex-col justify-center gap-5 p-6 sm:p-9">
          <div>
            <h3 className="font-display text-xl tracking-[0.1em] text-gold-gradient uppercase sm:text-2xl">
              {project.name}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {project.oneLiner}
            </p>
          </div>

          <ul className="flex flex-wrap gap-x-3 gap-y-1.5">
            {project.technologies.slice(0, 8).map((t) => (
              <li
                key={t}
                className="font-mono text-[0.62rem] tracking-wide text-muted-foreground"
              >
                {t}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/campaigns/$slug"
              params={{ slug: project.slug }}
              className={relicButton({ variant: "forged", size: "sm" })}
            >
              Enter Campaign <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            {project.demo ? (
              <a
                href={project.demo}
                target="_blank"
                rel="noreferrer"
                className={relicButton({ variant: "stone", size: "sm" })}
              >
                <ExternalLink className="h-3.5 w-3.5" /> Live Demo
              </a>
            ) : null}
            {project.github ? (
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                className={relicButton({ variant: "stone", size: "sm" })}
              >
                <Github className="h-3.5 w-3.5" /> GitHub
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
