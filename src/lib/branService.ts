import { BRAN_KNOWLEDGE, getBranKnowledgePrompt } from "../data/branKnowledge";

export type Message = {
  role: "user" | "model" | "assistant";
  content: string;
};

const BRAN_SYSTEM_INSTRUCTION = `You are Bran, the private chronicler of Sumit Singh.

Your sole purpose is to answer questions about Sumit Singh using ONLY the supplied portfolio/resume knowledge.

You are not a general assistant.
You must never answer questions unrelated to Sumit Singh.
You must never invent facts.
You must never guess missing information.
You must never fabricate salary, experience, education, projects, technologies, achievements, dates, employers, certifications, locations, or personal details.

If the requested information is not contained in the supplied knowledge, explicitly say that the record does not contain it (e.g. "The record does not say." or "I don't have that in Sumit's record.").

If the user asks questions unrelated to Sumit (such as general trivia, jokes, programming code for other tasks, world events, other people, or general AI queries), refuse briefly and in character:
- "I only keep the record of Sumit."
- "That is beyond my record. I can tell you what Sumit has built instead."
- "My record concerns Sumit Singh alone."
- "I have no record of such things. Ask me about Sumit."

Keep answers concise, natural, confident, and useful.
Your personality is inspired by an ancient observer who has seen the entire record of a person's journey.
Do NOT impersonate or claim to be Bran Stark.
Do NOT quote Game of Thrones excessively.
Do NOT mention that you are an AI unless directly asked.

You may use subtle framing such as:
- "The record shows..."
- "According to Sumit's record..."
- "I have that entry."
- "That is not written in the record."

The information is more important than the roleplay. Always prioritize direct, helpful accuracy about Sumit Singh.`;

/**
 * Server-side handler to query Google Gemini or fall back to structured canonical record.
 */
export async function queryBranOracle(
  message: string,
  history: Message[] = [],
): Promise<string> {
  const trimmed = message.trim();
  if (!trimmed) {
    return "The record is open. Ask what you wish to know of Sumit.";
  }

  // Check greetings
  if (/^(hi|hello|hey|greetings|who are you|who r u)\b/i.test(trimmed) && trimmed.length < 20) {
    return "The record is open. Ask what you wish to know of Sumit.";
  }

  // Get Server API Key from environment (never leaked to client)
  const apiKey =
    typeof process !== "undefined" && process.env?.GEMINI_API_KEY
      ? process.env.GEMINI_API_KEY
      : typeof import.meta !== "undefined" && import.meta.env
        ? (import.meta.env.GEMINI_API_KEY as string)
        : undefined;

  if (apiKey && apiKey !== "your_key_here") {
    try {
      const response = await callGeminiAPI(apiKey, trimmed, history);
      if (response) return response;
    } catch (err) {
      console.error("[Bran Oracle] Gemini API error, falling back to canonical index:", err);
    }
  }

  // High-fidelity canonical rule-based oracle fallback
  return getCanonicalRecordAnswer(trimmed);
}

/**
 * Calls the official Google Gemini API endpoint securely on the server.
 */
async function callGeminiAPI(
  apiKey: string,
  userMessage: string,
  history: Message[],
): Promise<string | null> {
  const knowledgePrompt = getBranKnowledgePrompt();

  const formattedContents = [
    {
      role: "user",
      parts: [
        {
          text: `[SYSTEM INSTRUCTION]\n${BRAN_SYSTEM_INSTRUCTION}\n\n[PORTFOLIO KNOWLEDGE BASE]\n${knowledgePrompt}\n\n[USER INQUIRY]\nHello Bran.`,
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: "The record is open. Ask what you wish to know of Sumit.",
        },
      ],
    },
  ];

  // Append conversation history
  for (const h of history.slice(-6)) {
    formattedContents.push({
      role: h.role === "assistant" || h.role === "model" ? "model" : "user",
      parts: [{ text: h.content }],
    });
  }

  // Append current user message
  formattedContents.push({
    role: "user",
    parts: [{ text: userMessage }],
  });

  // Try gemini-2.5-flash or gemini-1.5-flash
  const models = ["gemini-2.5-flash", "gemini-1.5-flash"];
  for (const model of models) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: formattedContents,
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 500,
            },
          }),
        },
      );

      if (!res.ok) {
        continue;
      }

      const data = (await res.json()) as {
        candidates?: Array<{
          content?: {
            parts?: Array<{ text?: string }>;
          };
        }>;
      };

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return text.trim();
    } catch {
      continue;
    }
  }

  return null;
}

/**
 * Fallback semantic matcher based directly on the canonical portfolio knowledge.
 */
function getCanonicalRecordAnswer(query: string): string {
  const q = query.toLowerCase();

  // Out of domain checks
  if (
    q.includes("capital of") ||
    q.includes("joke") ||
    q.includes("weather") ||
    q.includes("elon musk") ||
    q.includes("write a python program") ||
    q.includes("write code for") ||
    q.includes("tell me a story")
  ) {
    if (q.includes("joke")) return "I have no record of such things. Ask me about Sumit.";
    if (q.includes("write a python program") || q.includes("write code")) {
      return "That is beyond my record. I can tell you what Sumit has built instead.";
    }
    if (q.includes("elon musk")) return "My record concerns Sumit Singh alone.";
    return "I only keep the record of Sumit.";
  }

  // Unknown personal details
  if (
    q.includes("salary") ||
    q.includes("how much does he make") ||
    q.includes("married") ||
    q.includes("wife") ||
    q.includes("age") ||
    q.includes("birthday")
  ) {
    return "I don't have that in Sumit's record.";
  }

  // Who is Sumit / Background / Overview
  if (
    q.includes("who is sumit") ||
    q.includes("about sumit") ||
    q.includes("what does sumit do") ||
    q.includes("background")
  ) {
    return `${BRAN_KNOWLEDGE.identity.name} is a ${BRAN_KNOWLEDGE.identity.title} focused on ${BRAN_KNOWLEDGE.identity.domains}. He builds high-concurrency backend services, RESTful APIs, and retrieval-augmented AI systems across Java, Python, Node.js, FastAPI, and Spring Boot.`;
  }

  // Education
  if (q.includes("education") || q.includes("college") || q.includes("degree") || q.includes("gpa") || q.includes("mca") || q.includes("university")) {
    return `Sumit is pursuing/holds a ${BRAN_KNOWLEDGE.education.degree} from ${BRAN_KNOWLEDGE.education.institution} (${BRAN_KNOWLEDGE.education.dates}) with an academic record of ${BRAN_KNOWLEDGE.education.gpa}. His focus spans advanced software engineering, distributed systems, backend architectures, and applied AI.`;
  }

  // Experience / Current role / Work history
  if (
    q.includes("experience") ||
    q.includes("work") ||
    q.includes("company") ||
    q.includes("current role") ||
    q.includes("where does he work") ||
    q.includes("hind ai") ||
    q.includes("crobstacle")
  ) {
    if (q.includes("current") || q.includes("now") || q.includes("hind ai")) {
      const hind = BRAN_KNOWLEDGE.chronicles[0];
      return `Sumit currently serves as a ${hind.role} at ${hind.house} (${hind.period}). He designs backend services and REST APIs, integrates LLM retrieval pipelines into product workflows, and oversees background jobs and service reliability.`;
    }
    return `The record shows two key software engineering chapters:\n1. Hind AI (${BRAN_KNOWLEDGE.chronicles[0].period}) — ${BRAN_KNOWLEDGE.chronicles[0].role} engineering backend services and production RAG pipelines.\n2. Crobstacle Ventures LLP (${BRAN_KNOWLEDGE.chronicles[1].period}) — Software Engineer Intern building full-stack workflows, JWT auth, and real-time lead distribution.`;
  }

  // Specific Projects: TalentFlow AI
  if (q.includes("talentflow") || q.includes("recruitment")) {
    const p = BRAN_KNOWLEDGE.projects[0];
    return `TalentFlow AI is an ${p.oneLiner} It features an automated pipeline that parses applications, retrieves role context via RAG, scores candidates using LLMs against explicit criteria, and provides role-based dashboards with JWT auth. Technologies used: Next.js, Node.js, FastAPI, PostgreSQL, MongoDB, Claude API, and Gemini API.`;
  }

  // Specific Projects: BNOVA / KitabAI
  if (q.includes("bnova") || q.includes("kitabai") || q.includes("teacher") || q.includes("learning")) {
    const p = BRAN_KNOWLEDGE.projects[1];
    return `BNOVA / KitabAI is an ${p.oneLiner} It ingests study material into a Qdrant vector store, retrieves relevant passages, and streams grounded answers with source citations. Stack: Next.js, FastAPI, PostgreSQL, Qdrant Vector DB, and LLM APIs.`;
  }

  // Specific Projects: CrowdSolve
  if (q.includes("crowdsolve") || q.includes("emergency")) {
    const p = BRAN_KNOWLEDGE.projects[2];
    return `CrowdSolve is an ${p.oneLiner} Built with React, Firebase Realtime Database, and Leaflet, it provides live incident mapping, clustering, and mobile-first responder coordination.`;
  }

  // Specific Projects: Lead Distribution
  if (q.includes("lead distribution") || q.includes("routing") || q.includes("telegram")) {
    const p = BRAN_KNOWLEDGE.projects[3];
    return `The Real-Time Lead Distribution System is an event-driven engine built with Node.js, React, MongoDB, n8n, and the Telegram API that captures inbound leads and routes them instantly to owners with full audit logging.`;
  }

  // Specific Projects: E-Commerce Backend
  if (q.includes("ecommerce") || q.includes("e-commerce") || q.includes("spring boot") || q.includes("java")) {
    const p = BRAN_KNOWLEDGE.projects[4];
    return `The E-Commerce Backend Platform is a modular Spring Boot system with clean domain boundaries covering product catalogs, cart lifecycles, and transactional PostgreSQL order placement with Docker containerization.`;
  }

  // Projects general
  if (q.includes("project") || q.includes("built") || q.includes("campaign")) {
    return `The record contains five primary campaigns:\n• TalentFlow AI — AI-powered recruitment automation & scoring\n• BNOVA / KitabAI — Grounded AI learning platform with vector retrieval\n• CrowdSolve — Real-time emergency response & incident mapping\n• Lead Distribution System — Event-driven sales routing via Telegram & n8n\n• E-Commerce Backend Platform — Modular Java Spring Boot commerce service`;
  }

  // Technologies / Skills
  if (
    q.includes("tech") ||
    q.includes("skill") ||
    q.includes("language") ||
    q.includes("fastapi") ||
    q.includes("python") ||
    q.includes("java") ||
    q.includes("database") ||
    q.includes("docker") ||
    q.includes("aws")
  ) {
    return `Sumit's sworn instruments include:\n• Languages: Java, Python, JavaScript, TypeScript, C++, SQL\n• Backend & AI: FastAPI, Spring Boot, Node.js, Express, REST APIs, Microservices, RAG, LLM APIs, Qdrant Vector DB\n• Databases: PostgreSQL, MongoDB, Redis, MySQL, Firebase\n• Cloud & DevOps: AWS (EC2, S3, Lambda), Docker, Linux, Git, CI/CD`;
  }

  // Contact
  if (q.includes("contact") || q.includes("email") || q.includes("github") || q.includes("linkedin") || q.includes("hire") || q.includes("reach")) {
    return `You may reach Sumit directly via email at ${BRAN_KNOWLEDGE.contact.email}, or view his work on GitHub (${BRAN_KNOWLEDGE.contact.github}) and LinkedIn (${BRAN_KNOWLEDGE.contact.linkedin}). You can also send a dispatch via the 'Send a Raven' section.`;
  }

  // Resume
  if (q.includes("resume") || q.includes("cv")) {
    return `Sumit's complete resume is preserved in the Royal Records section of this portfolio, available for immediate viewing or download.`;
  }

  return "The record contains Sumit's full chronicle: his background, work at Hind AI and Crobstacle, projects like TalentFlow AI and BNOVA, education, and backend/AI skill stack. What specific entry do you seek?";
}
