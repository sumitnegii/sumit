import { ExternalLink, Github, Mail, Phone } from "lucide-react";
import { profile } from "@/data/portfolio";

/**
 * ResumeDocument — Exact 1:1 reflection of Sumit_Singh_Resume.pdf.
 *
 * Formatted cleanly with recruiter-grade typographic precision.
 */
export function ResumeDocument() {
  return (
    <article
      className="resume-sheet mx-auto w-full max-w-[920px] rounded-[2px] bg-white px-7 py-9 text-[#14171c] shadow-[0_40px_120px_-40px_rgba(0,0,0,0.85)] sm:px-12 sm:py-12"
      style={{
        fontFamily:
          "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* ── Header ── */}
      <header className="border-b border-[#d8dce2] pb-5 text-center sm:text-left">
        <h1
          className="text-3xl font-bold tracking-tight text-[#111827] sm:text-4xl"
          style={{ letterSpacing: "-0.02em" }}
        >
          {profile.name}
        </h1>

        <div className="mt-2.5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[0.84rem] text-[#4b5563] sm:justify-start">
          <span className="inline-flex items-center gap-1.5 font-medium text-[#1f2937]">
            <Phone className="h-3.5 w-3.5 text-[#6b7280]" />
            (+91) 8218121084
          </span>
          <span className="text-[#9ca3af] hidden sm:inline">|</span>
          <a
            className="inline-flex items-center gap-1 text-[#2563eb] hover:underline"
            href={`mailto:${profile.email}`}
          >
            <Mail className="h-3.5 w-3.5 text-[#6b7280]" />
            {profile.email}
          </a>
          <span className="text-[#9ca3af] hidden sm:inline">|</span>
          <a
            className="inline-flex items-center gap-1 text-[#2563eb] hover:underline"
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
          >
            linkedin.com/in/sumitnegii
          </a>
          <span className="text-[#9ca3af] hidden sm:inline">|</span>
          <a
            className="inline-flex items-center gap-1 text-[#2563eb] hover:underline"
            href={profile.github}
            target="_blank"
            rel="noreferrer"
          >
            github.com/sumitnegii
          </a>
        </div>
      </header>

      {/* ── Education ── */}
      <Section title="Education">
        <div>
          <div className="flex flex-wrap items-baseline justify-between gap-x-4">
            <h3 className="text-[0.96rem] font-bold text-[#111827]">
              Graphic Era Deemed University, Dehradun
            </h3>
            <span className="text-[0.82rem] font-medium text-[#4b5563]">
              Jun 2024 – May 2026
            </span>
          </div>
          <p className="mt-0.5 text-[0.88rem] text-[#374151]">
            <span className="font-medium">Master of Computer Applications (MCA)</span> — CGPA:{" "}
            <span className="font-semibold text-[#111827]">8.00/10</span>
          </p>
        </div>
      </Section>

      {/* ── Experience ── */}
      <Section title="Experience">
        <div className="space-y-5">
          {/* Hind AI */}
          <div>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
              <h3 className="text-[0.96rem] font-bold text-[#111827]">
                Hind AI, Dehradun
              </h3>
              <span className="text-[0.82rem] font-medium text-[#4b5563]">
                Mar 2026 – Present
              </span>
            </div>
            <p className="text-[0.88rem] font-semibold text-[#4b5563] italic">
              Junior Software Engineer (Founding Team)
            </p>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[0.85rem] leading-relaxed text-[#374151]">
              <li>
                Developed backend and full-stack features using{" "}
                <span className="font-medium text-[#111827]">Node.js, FastAPI, Next.js, PostgreSQL, and Redis</span> for
                an AI-powered education platform.
              </li>
              <li>
                Designed and maintained REST APIs for authentication, user management, and core platform
                workflows, securing access with{" "}
                <span className="font-medium text-[#111827]">JWT and Role-Based Access Control (RBAC)</span>.
              </li>
              <li>
                Optimized PostgreSQL queries and added Redis caching, reducing average API response latency by{" "}
                <span className="font-semibold text-[#111827]">20%</span>.
              </li>
              <li>
                Triaged and resolved <span className="font-semibold text-[#111827]">70+ production issues</span> across
                APIs, databases, and deployments, improving platform reliability and release stability.
              </li>
              <li>
                Engineered a <span className="font-medium text-[#111827]">RAG pipeline</span> for document chunking,
                embedding, and Qdrant indexing to support semantic search and context-aware retrieval.
              </li>
              <li>
                Containerized backend services with Docker and managed production deployments on{" "}
                <span className="font-medium text-[#111827]">AWS EC2</span>.
              </li>
            </ul>
          </div>

          {/* Crobstacle */}
          <div>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
              <h3 className="text-[0.96rem] font-bold text-[#111827]">
                Crobstacle Ventures LLP, Dehradun
              </h3>
              <span className="text-[0.82rem] font-medium text-[#4b5563]">
                Dec 2025 – Jan 2026
              </span>
            </div>
            <p className="text-[0.88rem] font-semibold text-[#4b5563] italic">
              Software Engineer Intern
            </p>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[0.85rem] leading-relaxed text-[#374151]">
              <li>
                Built backend APIs using{" "}
                <span className="font-medium text-[#111827]">Node.js, Express.js, and MongoDB</span> for
                authentication, input validation, and core business workflows.
              </li>
              <li>
                Implemented <span className="font-medium text-[#111827]">JWT-based authentication</span> and
                asynchronous processing to support scalable and reliable backend workflows.
              </li>
              <li>
                Collaborated with senior engineers through Git-based development and pull-request reviews to ship
                features and resolve production issues.
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* ── Projects ── */}
      <Section title="Projects">
        <div className="space-y-4.5">
          {/* E-Commerce Backend */}
          <div>
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <h3 className="text-[0.94rem] font-bold text-[#111827]">
                E-Commerce Backend Platform
              </h3>
              <a
                href="https://github.com/sumitnegii/Ecom"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[0.78rem] font-semibold text-[#2563eb] hover:underline"
              >
                <Github className="h-3 w-3" /> GitHub
              </a>
            </div>
            <p className="text-[0.78rem] font-medium text-[#4b5563]">
              Java, Spring Boot, Spring Data JPA, Spring Security, PostgreSQL, React.js, REST APIs
            </p>
            <ul className="mt-1.5 list-disc space-y-1 pl-5 text-[0.84rem] leading-relaxed text-[#374151]">
              <li>
                Built a full e-commerce backend using{" "}
                <span className="font-medium text-[#111827]">Java and Spring Boot</span> for product catalog, cart,
                order, and user management.
              </li>
              <li>
                Designed a normalized PostgreSQL schema using Hibernate and Spring Data JPA, applying Repository, DTO,
                and Builder design patterns.
              </li>
              <li>
                Secured REST APIs with Spring Security and JWT-based authentication and integrated a React.js frontend
                through Axios.
              </li>
            </ul>
          </div>

          {/* HireBuddy / TalentFlow */}
          <div>
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <h3 className="text-[0.94rem] font-bold text-[#111827]">
                HireBuddy — Multi-Agent Recruitment Platform
              </h3>
              <div className="flex items-center gap-2 text-[0.78rem] font-semibold text-[#2563eb]">
                <a
                  href="https://hirebuddy.bnova.ai/candidates"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:underline"
                >
                  <ExternalLink className="h-3 w-3" /> Live
                </a>
                <span className="text-[#9ca3af]">|</span>
                <a
                  href="https://github.com/sumitnegii/TalentFlow-AI-Multi-Agent-Enterprise-AT"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:underline"
                >
                  <Github className="h-3 w-3" /> GitHub
                </a>
              </div>
            </div>
            <p className="text-[0.78rem] font-medium text-[#4b5563]">
              Next.js, Node.js, FastAPI, PostgreSQL, MongoDB, Qdrant, Claude API, Gemini
            </p>
            <ul className="mt-1.5 list-disc space-y-1 pl-5 text-[0.84rem] leading-relaxed text-[#374151]">
              <li>
                Architected a 9-stage pipeline for resume parsing, scoring, ranking, and shortlisting using Claude and
                Gemini APIs.
              </li>
              <li>
                Designed PostgreSQL and MongoDB data models with modular REST APIs supporting recruiter workflows and
                candidate evaluation.
              </li>
              <li>
                Deployed the platform to production with retry and fallback handling, processing{" "}
                <span className="font-semibold text-[#111827]">20,000+ candidate records</span> for automated resume
                screening.
              </li>
            </ul>
          </div>

          {/* Lead Distribution */}
          <div>
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <h3 className="text-[0.94rem] font-bold text-[#111827]">
                Lead Distribution System — Event-Driven Backend Platform
              </h3>
              <div className="flex items-center gap-2 text-[0.78rem] font-semibold text-[#2563eb]">
                <a
                  href="https://github.com/sumitnegii/Lead-Management-System"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:underline"
                >
                  <Github className="h-3 w-3" /> GitHub
                </a>
              </div>
            </div>
            <p className="text-[0.78rem] font-medium text-[#4b5563]">
              Node.js, React.js, MongoDB, n8n, Telegram API
            </p>
            <ul className="mt-1.5 list-disc space-y-1 pl-5 text-[0.84rem] leading-relaxed text-[#374151]">
              <li>
                Engineered an event-driven lead assignment system with explicit state transitions and idempotent retry
                handling to prevent duplicate assignments.
              </li>
              <li>
                Built REST APIs for lead ingestion, assignment, and status tracking using MongoDB.
              </li>
              <li>
                Automated lead routing with n8n workflows and Telegram Bot API notifications for sales agents.
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* ── Technical Skills ── */}
      <Section title="Technical Skills">
        <div className="space-y-1.5 text-[0.84rem] text-[#374151] leading-relaxed">
          <p>
            <span className="font-bold text-[#111827]">Languages:</span> Java, JavaScript, TypeScript, Python, SQL,
            C++
          </p>
          <p>
            <span className="font-bold text-[#111827]">Backend:</span> Spring Boot, Spring Data JPA, Spring Security,
            Node.js, Express.js, FastAPI, REST APIs
          </p>
          <p>
            <span className="font-bold text-[#111827]">Databases:</span> PostgreSQL, MongoDB, MySQL, Redis, Qdrant
          </p>
          <p>
            <span className="font-bold text-[#111827]">Cloud &amp; Tools:</span> AWS EC2, AWS S3, Docker, Linux, Git,
            Postman
          </p>
          <p>
            <span className="font-bold text-[#111827]">Frontend:</span> React.js, Next.js, HTML, CSS
          </p>
          <p>
            <span className="font-bold text-[#111827]">Core CS:</span> Data Structures &amp; Algorithms,
            Object-Oriented Programming, DBMS, Operating Systems, CN, System Design
          </p>
        </div>
      </Section>

      {/* ── Achievements ── */}
      <Section title="Achievements">
        <ul className="list-disc space-y-1 pl-5 text-[0.85rem] leading-relaxed text-[#374151]">
          <li>
            Ranked <span className="font-semibold text-[#111827]">Top 100 (Top 0.7%)</span> in HackWithInfy among{" "}
            <span className="font-semibold text-[#111827]">15,000+ participants</span> nationwide.
          </li>
          <li>
            Solved <span className="font-semibold text-[#111827]">800+ DSA problems</span>, ranking in the{" "}
            <span className="font-semibold text-[#111827]">Top 2%</span> on GeeksforGeeks.
          </li>
          <li>
            <span className="font-semibold text-[#111827]">AWS Certified Cloud Practitioner</span> (2025).
          </li>
        </ul>
      </Section>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-5">
      <h2
        className="border-b-2 border-[#111827] pb-0.5 text-[0.82rem] font-bold tracking-[0.12em] text-[#111827] uppercase"
      >
        {title}
      </h2>
      <div className="pt-2">{children}</div>
    </section>
  );
}
