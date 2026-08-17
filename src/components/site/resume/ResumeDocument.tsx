import { useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ExternalLink, Github, Mail, Phone, ShieldCheck } from "lucide-react";
import { profile } from "@/data/portfolio";
import resumeLetterBg from "@/assets/resume-letter-bg.png";
import { cn } from "@/lib/utils";

/**
 * TypewriterText — Generates words smoothly word-by-word with subtle ink emergence.
 */
function TypewriterWords({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  const words = useMemo(() => text.split(" "), [text]);

  if (reduced) {
    return <span className={className}>{text}</span>;
  }

  return (
    <motion.span
      className={cn("inline", className)}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 1 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.016,
            delayChildren: delay,
          },
        },
      }}
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          variants={{
            hidden: { opacity: 0, y: 3, filter: "blur(1.5px)" },
            visible: {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
            },
          }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}

/**
 * ResumeDocument — On-site royal decree parchment resume viewer.
 *
 * Uses the authentic dragon & wax seal parchment background asset without stretching,
 * framing the central writable chamber with recruiter-grade typographic clarity.
 */
export function ResumeDocument() {
  return (
    <article
      className="relative mx-auto w-full max-w-[940px] overflow-hidden rounded-[3px] shadow-[0_45px_130px_-30px_rgba(0,0,0,0.92),0_0_0_1px_rgba(212,175,98,0.22)]"
      style={{
        fontFamily:
          "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* ── 1. Authentic Royal Parchment Background (Dragon Illustrations, Wax Seal & Margins) ── */}
      <img
        src={resumeLetterBg}
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full object-fill select-none"
        style={{
          filter: "brightness(0.97) contrast(1.03)",
        }}
      />

      {/* ── 2. Delicate Radial Light Veil for High-Contrast Central Readability ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(253,248,240,0.86)_0%,rgba(248,241,230,0.82)_55%,rgba(238,225,205,0.48)_100%)]"
      />

      {/* ── 3. Central Reading Chamber ── */}
      <div className="relative z-10 px-7 py-9 text-[#1c1917] sm:px-12 sm:py-14 md:px-16 md:py-16">
        {/* ── Top Royal Monogram & Header ── */}
        <header className="border-b border-[#a88a58]/40 pb-4 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
            <div>
              <h1
                className="font-serif text-3xl font-bold tracking-tight text-[#110e0c] sm:text-4xl"
                style={{
                  fontFamily: "'Cinzel', Georgia, serif",
                  letterSpacing: "0.06em",
                  textShadow: "0 1px 1px rgba(255,255,255,0.6)",
                }}
              >
                <TypewriterWords text={profile.name.toUpperCase()} delay={0.05} />
              </h1>
              <p className="mt-1 font-mono text-[0.72rem] tracking-[0.26em] text-[#785928] uppercase font-semibold">
                <TypewriterWords text="Software Engineer · Backend & AI Systems" delay={0.2} />
              </p>
            </div>

            <div className="flex items-center justify-center sm:justify-end gap-1.5 text-[0.68rem] font-mono text-[#8c6d32] uppercase tracking-widest opacity-85">
              <ShieldCheck className="h-3.5 w-3.5 text-[#a88a58]" />
              <span>Verified Record</span>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[0.82rem] text-[#44382e] sm:justify-start">
            <span className="inline-flex items-center gap-1.5 font-medium text-[#1f2937]">
              <Phone className="h-3.5 w-3.5 text-[#785928]" />
              (+91) 8218121084
            </span>
            <span className="text-[#a88a58]/60 hidden sm:inline">|</span>
            <a
              className="inline-flex items-center gap-1 text-[#1d4ed8] hover:underline"
              href={`mailto:${profile.email}`}
            >
              <Mail className="h-3.5 w-3.5 text-[#785928]" />
              {profile.email}
            </a>
            <span className="text-[#a88a58]/60 hidden sm:inline">|</span>
            <a
              className="inline-flex items-center gap-1 text-[#1d4ed8] hover:underline"
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
            >
              linkedin.com/in/sumitnegii
            </a>
            <span className="text-[#a88a58]/60 hidden sm:inline">|</span>
            <a
              className="inline-flex items-center gap-1 text-[#1d4ed8] hover:underline"
              href={profile.github}
              target="_blank"
              rel="noreferrer"
            >
              github.com/sumitnegii
            </a>
          </div>
        </header>

        {/* ── Education ── */}
        <Section title="Education" delay={0.35}>
          <div>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
              <h3 className="text-[0.95rem] font-bold text-[#1a140e]">
                <TypewriterWords text="Graphic Era Deemed University, Dehradun" delay={0.4} />
              </h3>
              <span className="text-[0.8rem] font-semibold text-[#5c4a38]">
                Jun 2024 – May 2026
              </span>
            </div>
            <p className="mt-0.5 text-[0.86rem] text-[#29221b]">
              <span className="font-semibold text-[#1a140e]">Master of Computer Applications (MCA)</span> — CGPA:{" "}
              <span className="font-bold text-[#110e0c]">8.00/10</span>
            </p>
          </div>
        </Section>

        {/* ── Experience ── */}
        <Section title="Experience" delay={0.55}>
          <div className="space-y-4.5">
            {/* Hind AI */}
            <div>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <h3 className="text-[0.95rem] font-bold text-[#1a140e]">
                  <TypewriterWords text="Hind AI, Dehradun" delay={0.6} />
                </h3>
                <span className="text-[0.8rem] font-semibold text-[#5c4a38]">
                  Mar 2026 – Present
                </span>
              </div>
              <p className="text-[0.86rem] font-semibold text-[#6b4f21] italic">
                Junior Software Engineer (Founding Team)
              </p>
              <ul className="mt-1.5 list-disc space-y-1 pl-5 text-[0.84rem] leading-relaxed text-[#2c241c]">
                <li>
                  <TypewriterWords
                    text="Developed backend and full-stack features using Node.js, FastAPI, Next.js, PostgreSQL, and Redis for an AI-powered education platform."
                    delay={0.7}
                  />
                </li>
                <li>
                  <TypewriterWords
                    text="Designed and maintained REST APIs for authentication, user management, and core platform workflows, securing access with JWT and Role-Based Access Control (RBAC)."
                    delay={0.8}
                  />
                </li>
                <li>
                  <TypewriterWords
                    text="Optimized PostgreSQL queries and added Redis caching, reducing average API response latency by 20%."
                    delay={0.9}
                  />
                </li>
                <li>
                  <TypewriterWords
                    text="Triaged and resolved 70+ production issues across APIs, databases, and deployments, improving platform reliability and release stability."
                    delay={1.0}
                  />
                </li>
                <li>
                  <TypewriterWords
                    text="Engineered a RAG pipeline for document chunking, embedding, and Qdrant indexing to support semantic search and context-aware retrieval."
                    delay={1.1}
                  />
                </li>
                <li>
                  <TypewriterWords
                    text="Containerized backend services with Docker and managed production deployments on AWS EC2."
                    delay={1.2}
                  />
                </li>
              </ul>
            </div>

            {/* Crobstacle */}
            <div>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <h3 className="text-[0.95rem] font-bold text-[#1a140e]">
                  <TypewriterWords text="Crobstacle Ventures LLP, Dehradun" delay={1.3} />
                </h3>
                <span className="text-[0.8rem] font-semibold text-[#5c4a38]">
                  Dec 2025 – Jan 2026
                </span>
              </div>
              <p className="text-[0.86rem] font-semibold text-[#6b4f21] italic">
                Software Engineer Intern
              </p>
              <ul className="mt-1.5 list-disc space-y-1 pl-5 text-[0.84rem] leading-relaxed text-[#2c241c]">
                <li>
                  <TypewriterWords
                    text="Built backend APIs using Node.js, Express.js, and MongoDB for authentication, input validation, and core business workflows."
                    delay={1.4}
                  />
                </li>
                <li>
                  <TypewriterWords
                    text="Implemented JWT-based authentication and asynchronous processing to support scalable and reliable backend workflows."
                    delay={1.5}
                  />
                </li>
                <li>
                  <TypewriterWords
                    text="Collaborated with senior engineers through Git-based development and pull-request reviews to ship features and resolve production issues."
                    delay={1.6}
                  />
                </li>
              </ul>
            </div>
          </div>
        </Section>

        {/* ── Projects ── */}
        <Section title="Projects" delay={1.7}>
          <div className="space-y-4">
            {/* E-Commerce Backend */}
            <div>
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <h3 className="text-[0.93rem] font-bold text-[#1a140e]">
                  <TypewriterWords text="E-Commerce Backend Platform" delay={1.75} />
                </h3>
                <a
                  href="https://github.com/sumitnegii/Ecom"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[0.76rem] font-bold text-[#1d4ed8] hover:underline"
                >
                  <Github className="h-3 w-3" /> GitHub
                </a>
              </div>
              <p className="text-[0.76rem] font-semibold text-[#6b4f21]">
                Java, Spring Boot, Spring Data JPA, Spring Security, PostgreSQL, React.js, REST APIs
              </p>
              <ul className="mt-1 list-disc space-y-0.5 pl-5 text-[0.83rem] leading-relaxed text-[#2c241c]">
                <li>
                  <TypewriterWords
                    text="Built a full e-commerce backend using Java and Spring Boot for product catalog, cart, order, and user management."
                    delay={1.8}
                  />
                </li>
                <li>
                  <TypewriterWords
                    text="Designed a normalized PostgreSQL schema using Hibernate and Spring Data JPA, applying Repository, DTO, and Builder design patterns."
                    delay={1.9}
                  />
                </li>
                <li>
                  <TypewriterWords
                    text="Secured REST APIs with Spring Security and JWT-based authentication and integrated a React.js frontend through Axios."
                    delay={2.0}
                  />
                </li>
              </ul>
            </div>

            {/* HireBuddy / TalentFlow */}
            <div>
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <h3 className="text-[0.93rem] font-bold text-[#1a140e]">
                  <TypewriterWords text="HireBuddy — Multi-Agent Recruitment Platform" delay={2.05} />
                </h3>
                <div className="flex items-center gap-2 text-[0.76rem] font-bold text-[#1d4ed8]">
                  <a
                    href="https://hirebuddy.bnova.ai/candidates"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 hover:underline"
                  >
                    <ExternalLink className="h-3 w-3" /> Live
                  </a>
                  <span className="text-[#a88a58]/60">|</span>
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
              <p className="text-[0.76rem] font-semibold text-[#6b4f21]">
                Next.js, Node.js, FastAPI, PostgreSQL, MongoDB, Qdrant, Claude API, Gemini
              </p>
              <ul className="mt-1 list-disc space-y-0.5 pl-5 text-[0.83rem] leading-relaxed text-[#2c241c]">
                <li>
                  <TypewriterWords
                    text="Architected a 9-stage pipeline for resume parsing, scoring, ranking, and shortlisting using Claude and Gemini APIs."
                    delay={2.1}
                  />
                </li>
                <li>
                  <TypewriterWords
                    text="Designed PostgreSQL and MongoDB data models with modular REST APIs supporting recruiter workflows and candidate evaluation."
                    delay={2.2}
                  />
                </li>
                <li>
                  <TypewriterWords
                    text="Deployed the platform to production with retry and fallback handling, processing 20,000+ candidate records for automated resume screening."
                    delay={2.3}
                  />
                </li>
              </ul>
            </div>

            {/* Lead Distribution */}
            <div>
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <h3 className="text-[0.93rem] font-bold text-[#1a140e]">
                  <TypewriterWords text="Lead Distribution System — Event-Driven Backend Platform" delay={2.35} />
                </h3>
                <div className="flex items-center gap-2 text-[0.76rem] font-bold text-[#1d4ed8]">
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
              <p className="text-[0.76rem] font-semibold text-[#6b4f21]">
                Node.js, React.js, MongoDB, n8n, Telegram API
              </p>
              <ul className="mt-1 list-disc space-y-0.5 pl-5 text-[0.83rem] leading-relaxed text-[#2c241c]">
                <li>
                  <TypewriterWords
                    text="Engineered an event-driven lead assignment system with explicit state transitions and idempotent retry handling to prevent duplicate assignments."
                    delay={2.4}
                  />
                </li>
                <li>
                  <TypewriterWords
                    text="Built REST APIs for lead ingestion, assignment, and status tracking using MongoDB."
                    delay={2.5}
                  />
                </li>
                <li>
                  <TypewriterWords
                    text="Automated lead routing with n8n workflows and Telegram Bot API notifications for sales agents."
                    delay={2.6}
                  />
                </li>
              </ul>
            </div>
          </div>
        </Section>

        {/* ── Technical Skills ── */}
        <Section title="Technical Skills" delay={2.7}>
          <div className="space-y-1 text-[0.83rem] text-[#2c241c] leading-relaxed">
            <p>
              <span className="font-bold text-[#110e0c]">Languages:</span> Java, JavaScript, TypeScript, Python, SQL,
              C++
            </p>
            <p>
              <span className="font-bold text-[#110e0c]">Backend:</span> Spring Boot, Spring Data JPA, Spring Security,
              Node.js, Express.js, FastAPI, REST APIs
            </p>
            <p>
              <span className="font-bold text-[#110e0c]">Databases:</span> PostgreSQL, MongoDB, MySQL, Redis, Qdrant
            </p>
            <p>
              <span className="font-bold text-[#110e0c]">Cloud &amp; Tools:</span> AWS EC2, AWS S3, Docker, Linux, Git,
              Postman
            </p>
            <p>
              <span className="font-bold text-[#110e0c]">Frontend:</span> React.js, Next.js, HTML, CSS
            </p>
            <p>
              <span className="font-bold text-[#110e0c]">Core CS:</span> Data Structures &amp; Algorithms,
              Object-Oriented Programming, DBMS, Operating Systems, CN, System Design
            </p>
          </div>
        </Section>

        {/* ── Achievements ── */}
        <Section title="Achievements" delay={2.9}>
          <ul className="list-disc space-y-0.5 pl-5 text-[0.83rem] leading-relaxed text-[#2c241c]">
            <li>
              Ranked <span className="font-bold text-[#110e0c]">Top 100 (Top 0.7%)</span> in HackWithInfy among{" "}
              <span className="font-bold text-[#110e0c]">15,000+ participants</span> nationwide.
            </li>
            <li>
              Solved <span className="font-bold text-[#110e0c]">800+ DSA problems</span>, ranking in the{" "}
              <span className="font-bold text-[#110e0c]">Top 2%</span> on GeeksforGeeks.
            </li>
            <li>
              <span className="font-bold text-[#110e0c]">AWS Certified Cloud Practitioner</span> (2025).
            </li>
          </ul>
        </Section>
      </div>
    </article>
  );
}

function Section({
  title,
  children,
  delay = 0,
}: {
  title: string;
  children: React.ReactNode;
  delay?: number;
}) {
  const reduced = useReducedMotion();

  return (
    <section className="mt-4">
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center gap-2 border-b border-[#a88a58]/50 pb-0.5">
          <span className="h-1.5 w-1.5 rotate-45 bg-[#8c6d32]" />
          <h2
            className="font-serif text-[0.82rem] font-bold tracking-[0.16em] text-[#110e0c] uppercase"
            style={{ fontFamily: "'Cinzel', Georgia, serif" }}
          >
            {title}
          </h2>
          <div className="h-px flex-1 bg-gradient-to-r from-[#a88a58]/40 to-transparent" />
        </div>
      </motion.div>
      <div className="pt-1.5">{children}</div>
    </section>
  );
}
