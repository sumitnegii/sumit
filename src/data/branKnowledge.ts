import { chronicles, profile, projects, realmLocations, skillGroups } from "./portfolio";

/**
 * BRAN'S CANONICAL KNOWLEDGE BASE
 *
 * This structured knowledge base is the single source of truth for the Bran Oracle.
 * Bran answers strictly and exclusively from this record.
 */

export const BRAN_KNOWLEDGE = {
  identity: {
    name: profile.name,
    title: profile.title,
    tagline: profile.tagline,
    domains: "Backend Systems, APIs, Microservices & Applied AI Systems",
    summary:
      "Sumit Singh is a software engineer specializing in scalable backend services, RESTful APIs, distributed workflows, and production AI/LLM retrieval systems. He works across Java, Python, Node.js, FastAPI, and Spring Boot, deploying on modern cloud infrastructure, Docker, and relational/document databases.",
  },

  education: {
    institution: "Graphic Era Deemed University, Dehradun",
    degree: "Master of Computer Applications (MCA)",
    period: "2024 — 2026",
    dates: "June 2024 — May 2026",
    gpa: "8.00 / 10 CGPA",
    focus: "Advanced software engineering, distributed systems, backend architectures, and applied AI.",
  },

  contact: {
    email: profile.email,
    github: profile.github,
    linkedin: profile.linkedin,
    resumeUrl: profile.resumeUrl,
  },

  chronicles: chronicles.map((c) => ({
    house: c.house,
    role: c.role,
    period: c.period,
    summary: c.summary,
    responsibilities: c.responsibilities,
    technologies: c.technologies,
    achievements: c.achievements,
  })),

  projects: projects.map((p) => ({
    name: p.name,
    slug: p.slug,
    realm: p.realm,
    oneLiner: p.oneLiner,
    overview: p.overview,
    problem: p.problem,
    solution: p.solution,
    technologies: p.technologies,
    architecture: p.architecture,
    features: p.features,
    results: p.results,
  })),

  skills: skillGroups.map((g) => ({
    category: g.name,
    items: g.items,
  })),

  portfolioSections: realmLocations.map((loc) => ({
    name: loc.name,
    meaning: loc.meaning,
    blurb: loc.blurb,
    href: loc.href,
  })),
};

/**
 * Formatted prompt text representation supplied to the Gemini LLM on the server.
 */
export function getBranKnowledgePrompt(): string {
  return `
### THE CHRONICLES & RECORDS OF SUMIT SINGH (CANONICAL KNOWLEDGE)

1. IDENTITY & PROFILE
- Name: ${BRAN_KNOWLEDGE.identity.name}
- Title: ${BRAN_KNOWLEDGE.identity.title} (${BRAN_KNOWLEDGE.identity.domains})
- Tagline: "${BRAN_KNOWLEDGE.identity.tagline}"
- Summary: ${BRAN_KNOWLEDGE.identity.summary}
- Email: ${BRAN_KNOWLEDGE.contact.email}
- GitHub: ${BRAN_KNOWLEDGE.contact.github}
- LinkedIn: ${BRAN_KNOWLEDGE.contact.linkedin}

2. EDUCATION
- Degree: ${BRAN_KNOWLEDGE.education.degree}
- Institution: ${BRAN_KNOWLEDGE.education.institution}
- Period: ${BRAN_KNOWLEDGE.education.period} (${BRAN_KNOWLEDGE.education.dates})
- Academic Record: ${BRAN_KNOWLEDGE.education.gpa}
- Focus: ${BRAN_KNOWLEDGE.education.focus}

3. EXPERIENCE & WORK CHRONICLES
${BRAN_KNOWLEDGE.chronicles
  .map(
    (c) => `
- Organization / House: ${c.house}
  Role: ${c.role}
  Period: ${c.period}
  Summary: ${c.summary}
  Technologies: ${c.technologies.join(", ")}
  Responsibilities:
    ${c.responsibilities.map((r) => `* ${r}`).join("\n    ")}
  Key Achievements:
    ${c.achievements.map((a) => `* ${a}`).join("\n    ")}`,
  )
  .join("\n")}

4. CAMPAIGNS & NOTABLE PROJECTS
${BRAN_KNOWLEDGE.projects
  .map(
    (p) => `
- Project Name: ${p.name} (Hold: ${p.realm})
  One-Liner: ${p.oneLiner}
  Technologies: ${p.technologies.join(", ")}
  Overview: ${p.overview}
  Problem Solved: ${p.problem}
  Solution: ${p.solution}
  Architecture Highlights:
    ${p.architecture.map((a) => `* ${a}`).join("\n    ")}
  Key Features:
    ${p.features.map((f) => `* ${f}`).join("\n    ")}
  Results:
    ${p.results.map((r) => `* ${r}`).join("\n    ")}`,
  )
  .join("\n")}

5. TECHNICAL SKILLS & INSTRUMENTS
${BRAN_KNOWLEDGE.skills.map((s) => `- ${s.category}: ${s.items.join(", ")}`).join("\n")}

6. REALM HOLDS & SECTIONS
${BRAN_KNOWLEDGE.portfolioSections.map((sec) => `- ${sec.name} (${sec.meaning}): ${sec.blurb}`).join("\n")}
`;
}
