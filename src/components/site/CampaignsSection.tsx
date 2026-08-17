import { projects } from "@/data/portfolio";
import { ProjectCard } from "@/components/site/ProjectCard";
import { Reveal, SectionHeading, SectionShell } from "@/components/site/primitives";

export function CampaignsSection() {
  return (
    <SectionShell id="campaigns">
      <Reveal>
        <SectionHeading
          eyebrow="Dragonstone"
          title="THE CAMPAIGNS"
          subtitle="Systems built. Problems solved. Battles fought."
        />
      </Reveal>

      <div className="mt-16 space-y-8">
        {projects.map((project, i) => (
          <Reveal key={project.slug} delay={Math.min(i * 0.06, 0.24)}>
            <ProjectCard project={project} index={i} />
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
