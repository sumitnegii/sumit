import warroom from "@/assets/campaign-warroom.jpg";
import citadel from "@/assets/campaign-citadel.jpg";
import beacons from "@/assets/campaign-beacons.jpg";
import ravens from "@/assets/campaign-ravens.jpg";
import forge from "@/assets/campaign-forge.jpg";

export const profile = {
  name: "Sumit Singh",
  title: "Software Engineer",
  tagline: "Every realm has its builders.",
  github: "https://github.com/sumitnegii",
  linkedin: "https://www.linkedin.com/in/sumitnegii",
  email: "negisumit308@gmail.com",
  resumeUrl: "/Sumit_Singh_Resume.pdf",
};

export const personalMotto = "BORN OF THE NORTH. FORGED IN CODE.";

export const recordAuthentication = {
  label: "LAST ENTERED INTO THE RECORD",
  date: "AUGUST 2026",
  subtext: "THE CHRONICLES OF SUMIT SINGH",
};

export const royalRecordsStats = [
  {
    stat: "MCA",
    label: "Graphic Era Deemed University",
  },
  {
    stat: "800+",
    label: "DSA Problems Solved",
  },
  {
    stat: "AWS",
    label: "Cloud Practitioner Certified",
  },
];

export const navigation = [
  { label: "The Realm", href: "#realm", meaning: "Home" },
  { label: "The Citadel", href: "#citadel", meaning: "About" },
  { label: "The Chronicles", href: "#chronicles", meaning: "Experience" },
  { label: "Campaigns", href: "#campaigns", meaning: "Projects" },
  { label: "The Forge", href: "#forge", meaning: "Skills" },
  { label: "The Archives", href: "#archives", meaning: "GitHub" },
  { label: "Royal Records", href: "#records", meaning: "Resume" },
  { label: "Send a Raven", href: "#raven", meaning: "Contact" },
];

export const realmLocations = [
  {
    name: "THE CITADEL",
    meaning: "About / Citadel",
    blurb: "The record of the man behind the crown.",
    href: "#citadel",
    x: 22,
    y: 30,
  },
  {
    name: "THE KINGDOM",
    meaning: "Experience / Chronicles",
    blurb: "The chronicles of the journey.",
    href: "#chronicles",
    x: 48,
    y: 18,
  },
  {
    name: "DRAGONSTONE",
    meaning: "Projects / Campaigns",
    blurb: "The campaigns and systems built.",
    href: "#campaigns",
    x: 72,
    y: 44,
  },
  {
    name: "THE FORGE",
    meaning: "Skills / Forge",
    blurb: "Where the code is written.",
    href: "#forge",
    x: 33,
    y: 66,
  },
  {
    name: "THE RAVENRY",
    meaning: "Contact / Send a Raven",
    blurb: "Open a channel.",
    href: "#raven",
    x: 66,
    y: 78,
  },
];

export type Chronicle = {
  house: string;
  role: string;
  period: string;
  summary: string;
  responsibilities: string[];
  technologies: string[];
  achievements: string[];
};

export const chronicles: Chronicle[] = [
  {
    house: "Hind AI, Dehradun",
    role: "Junior Software Engineer (Founding Team)",
    period: "March 2026 — Present",
    summary: "Developing backend services, full-stack features, and AI-powered workflows for an educational platform.",
    responsibilities: [
      "Develop backend and full-stack features using Node.js, FastAPI, Next.js, PostgreSQL, and Redis",
      "Design and maintain REST APIs for authentication, user management, and core workflows with JWT and RBAC",
      "Optimize PostgreSQL queries and Redis caching, reducing average API response latency by 20%",
      "Triage and resolve 70+ production issues across APIs, databases, and deployments",
      "Engineer a RAG pipeline with document chunking, embedding, and Qdrant indexing for semantic retrieval",
      "Containerize backend services with Docker and manage production deployments on AWS EC2",
    ],
    technologies: ["Node.js", "FastAPI", "Next.js", "PostgreSQL", "Redis", "Qdrant", "Docker", "AWS EC2", "JWT", "RBAC", "RAG"],
    achievements: [
      "Reduced average API response latency by 20% via query optimization and Redis caching",
      "Resolved 70+ production issues and engineered core RAG semantic search pipelines",
    ],
  },
  {
    house: "Crobstacle Ventures LLP, Dehradun",
    role: "Software Engineer Intern",
    period: "December 2025 — January 2026",
    summary: "Built backend APIs and asynchronous workflows for internal tools and lead automation.",
    responsibilities: [
      "Built backend APIs using Node.js, Express.js, and MongoDB for authentication and core business workflows",
      "Implemented JWT-based authentication and asynchronous processing for scalable backend workflows",
      "Collaborated through Git-based development and pull-request reviews to ship features and resolve production issues",
    ],
    technologies: ["Node.js", "Express.js", "MongoDB", "React", "JWT", "Git"],
    achievements: [
      "Delivered reliable backend APIs and asynchronous lead routing pipelines",
      "Maintained structured pull-request reviews and resolved production issues with senior engineering teams",
    ],
  },
];

export type Education = {
  institution: string;
  degree: string;
  period: string;
  dates: string;
  grade: string;
  summary: string;
  highlights: string[];
};

export const education: Education[] = [
  {
    institution: "Graphic Era Deemed University, Dehradun",
    degree: "Master of Computer Applications (MCA)",
    period: "2024 — 2026",
    dates: "June 2024 — May 2026",
    grade: "CGPA: 8.00 / 10",
    summary: "Advanced software engineering, distributed systems, backend architectures, and applied AI.",
    highlights: [
      "Master of Computer Applications with specialized focus on backend architectures and applied intelligence",
      "Academic record maintained at 8.00 / 10 CGPA across full curriculum",
    ],
  },
];

export type Project = {
  slug: string;
  name: string;
  realm: string;
  oneLiner: string;
  image: string;
  technologies: string[];
  overview: string;
  problem: string;
  solution: string;
  architecture: string[];
  features: string[];
  challenges: string[];
  built: string[];
  results: string[];
  github?: string;
  demo?: string;
};

export const projects: Project[] = [
  {
    slug: "talentflow-ai",
    name: "TalentFlow AI",
    realm: "The War Room",
    oneLiner: "AI-powered recruitment automation platform.",
    image: warroom,
    demo: "https://hirebuddy.bnova.ai/candidates",
    github: "https://github.com/sumitnegii/TalentFlow-AI-Multi-Agent-Enterprise-AT",
    technologies: [
      "Next.js",
      "Node.js",
      "MongoDB",
      "FastAPI",
      "PostgreSQL",
      "Claude API",
      "Gemini API",
      "JWT",
      "RBAC",
      "RAG",
    ],
    overview:
      "A recruitment platform that automates screening, ranking and structured evaluation of candidates using large language models and retrieval over role-specific context.",
    problem:
      "Hiring teams spend hours manually reading resumes, matching them to job requirements and keeping evaluation consistent across interviewers.",
    solution:
      "An end-to-end pipeline that parses applications, retrieves relevant role context, scores candidates with LLMs against explicit criteria, and exposes results through a role-based dashboard.",
    architecture: [
      "Next.js client — recruiter dashboard, pipelines and candidate views",
      "Node.js API — auth, JWT sessions, RBAC, pipeline orchestration",
      "FastAPI AI service — parsing, embeddings, RAG retrieval, LLM scoring",
      "PostgreSQL — structured pipeline, roles and evaluation records",
      "MongoDB — raw documents, parsed resume payloads and logs",
    ],
    features: [
      "Resume parsing and structured candidate profiles",
      "RAG-backed matching against job requirements",
      "Role-based access control for recruiters and admins",
      "Explainable scoring with per-criterion reasoning",
      "Pipeline stages with activity history",
    ],
    challenges: [
      "Keeping LLM output deterministic enough for fair comparison",
      "Cost control across two model providers under bulk workloads",
      "Designing permission boundaries that survive multi-tenant use",
    ],
    built: [
      "Backend service architecture and data models",
      "RAG retrieval layer and prompt/evaluation contracts",
      "Authentication, JWT session handling and RBAC policies",
      "Dashboard integration between the Next.js client and both services",
    ],
    results: [
      "Screening turned from manual reading into a reviewable, repeatable pipeline",
      "Consistent evaluation criteria across every candidate in a role",
    ],
  },
  {
    slug: "metabuddy",
    name: "MetaBuddy",
    realm: "Dragonstone",
    oneLiner: "AI-powered Meta Ads management platform for creating, analyzing, and optimizing advertising campaigns.",
    image: citadel,
    demo: "https://metabuddy-frontend.vercel.app/",
    github: "https://github.com/sumitnegii/metabuddy",
    technologies: ["Next.js", "TypeScript", "Meta Marketing API", "AI Agents"],
    overview:
      "An AI-powered platform that connects to a Meta Business account and helps manage the complete advertising workflow — from fetching existing ads and creating campaigns to previewing, analyzing, and optimizing campaign performance.",
    problem:
      "Managing Meta advertising requires jumping between campaign creation, ad management, previews, performance analytics, and optimization decisions. These workflows are fragmented and require repetitive manual analysis.",
    solution:
      "MetaBuddy connects directly with Meta Business accounts and uses AI agents to handle advertising workflows, including campaign creation, ad analysis, performance evaluation, pre-campaign analysis, and optimization recommendations.",
    architecture: [
      "Meta Business integration — connects the platform with Meta advertising accounts",
      "Meta Marketing API — fetches business, campaign, ad and performance data",
      "AI agent layer — analyzes campaigns and orchestrates advertising workflows",
      "Next.js application — provides the management interface for campaigns, ads and analytics",
    ],
    features: [
      "Meta Business Account integration",
      "Create and manage advertising campaigns",
      "Fetch and inspect existing ads",
      "Ad preview before publishing",
      "AI-powered pre-campaign analysis",
      "AI analysis of campaign and ad performance",
      "Optimization recommendations",
      "Automated campaign workflows",
    ],
    challenges: [
      "Integrating Meta's advertising workflows into a single application",
      "Designing AI agents that can safely orchestrate multi-step campaign workflows",
      "Turning raw advertising performance data into useful optimization insights",
      "Keeping campaign creation and analysis workflows reliable across multiple API operations",
    ],
    built: [
      "Meta Business Account integration",
      "Meta Marketing API integration for advertising data and operations",
      "AI agent workflows for campaign creation and analysis",
      "Ad preview and management workflows",
      "Performance analysis and optimization recommendation system",
    ],
    results: [
      "Advertising workflows can be managed from a single platform",
      "AI agents reduce repetitive campaign analysis and management work",
      "Users can evaluate campaigns before and after launch with AI-assisted insights",
      "Existing Meta advertising data can be fetched and analyzed directly inside the platform",
    ],
  },
  {
    slug: "crowdsolve",
    name: "CrowdSolve",
    realm: "The Beacons",
    oneLiner: "Emergency response web application with live incident mapping.",
    image: beacons,
    github: "https://github.com/sumitnegii/Crowd_Community",
    technologies: ["React", "Firebase", "Leaflet"],
    overview:
      "A community emergency response app where incidents are reported, mapped and tracked in real time so nearby responders can act quickly.",
    problem:
      "During local emergencies, reports are scattered across calls and messages with no shared, current picture of what is happening where.",
    solution:
      "A single live map backed by realtime storage: reports appear instantly for every connected user, with status updates as situations resolve.",
    architecture: [
      "React client — reporting flow, live map and incident feed",
      "Firebase Realtime data — live incident sync and auth",
      "Leaflet — clustered geospatial rendering of incidents",
    ],
    features: [
      "Realtime incident reporting and status updates",
      "Interactive map with clustering and filters",
      "Location capture with manual override",
      "Mobile-first responder view",
    ],
    challenges: [
      "Rendering many markers without dropping frames on mobile",
      "Handling unreliable connectivity during incidents",
      "Preventing duplicate reports for the same event",
    ],
    built: [
      "Full frontend application and map layer",
      "Realtime data model and sync logic",
      "Reporting and moderation flows",
    ],
    results: [
      "A shared, always-current view of active incidents",
      "Report-to-visibility time reduced to seconds",
    ],
  },
  {
    slug: "lead-distribution",
    name: "Real-Time Lead Distribution System",
    realm: "The Ravenry",
    oneLiner: "Event-driven routing of incoming leads to the right owner, instantly.",
    image: ravens,
    github: "https://github.com/sumitnegii/Lead-Management-System",
    technologies: ["Node.js", "React", "MongoDB", "n8n", "Telegram API"],
    overview:
      "A routing system that captures inbound leads, applies assignment rules and notifies the right person in real time through chat.",
    problem:
      "Leads arrived through multiple channels and were assigned manually, causing slow first-response times and lost opportunities.",
    solution:
      "Normalize every inbound lead into one event stream, run rule-based distribution, and push instant notifications with acknowledgement tracking.",
    architecture: [
      "Node.js service — ingestion, validation and distribution rules",
      "MongoDB — lead records, assignment history and audit trail",
      "n8n workflows — channel integrations and retries",
      "Telegram API — instant delivery and acknowledgement",
      "React dashboard — queue, ownership and response metrics",
    ],
    features: [
      "Rule-based round-robin and priority assignment",
      "Instant chat notification with claim/ack flow",
      "Full audit trail of every assignment",
      "Dashboard for queue health and response time",
    ],
    challenges: [
      "Guaranteeing exactly-once assignment under concurrent inbound events",
      "Retry handling for flaky third-party channels",
      "Keeping the rule engine configurable without redeploys",
    ],
    built: [
      "Distribution engine and data model",
      "Workflow integrations and notification layer",
      "Dashboard and reporting views",
    ],
    results: [
      "Manual routing removed from the daily workflow",
      "First-response time dropped from minutes to near-instant",
    ],
  },
  {
    slug: "ecommerce-backend",
    name: "E-Commerce Backend Platform",
    realm: "The Forge",
    oneLiner: "Modular commerce backend with catalog, cart, orders and auth.",
    image: forge,
    github: "https://github.com/sumitnegii/Ecom",
    technologies: ["Java", "Spring Boot", "PostgreSQL", "REST APIs", "Docker"],
    overview:
      "A backend platform covering the core commerce domain: products, inventory, carts, orders and authenticated customer accounts.",
    problem:
      "Commerce logic sprawls quickly; without clear domain boundaries, catalog, pricing and order rules become impossible to change safely.",
    solution:
      "A layered Spring Boot service with clean domain separation, validated REST contracts and transactional order handling.",
    architecture: [
      "Spring Boot modules — catalog, cart, orders, identity",
      "PostgreSQL — relational schema with transactional order writes",
      "REST API layer — validated DTOs and consistent error contracts",
      "Docker — reproducible local and deployment environments",
    ],
    features: [
      "Product catalog with categories and inventory",
      "Cart lifecycle and order placement",
      "Authentication and role-protected endpoints",
      "Consistent, documented REST contracts",
    ],
    challenges: [
      "Keeping order placement transactional across inventory and payment state",
      "Avoiding leaked persistence models in the API layer",
      "Designing for future service extraction without over-engineering",
    ],
    built: [
      "Complete backend domain and persistence layer",
      "REST API surface and validation",
      "Containerized build and run setup",
    ],
    results: [
      "A backend that supports new commerce features without rewrites",
      "Clear domain boundaries and testable service layers",
    ],
  },
];

export const skillGroups = [
  {
    name: "Languages",
    items: ["Java", "Python", "JavaScript", "TypeScript", "C++", "SQL"],
  },
  {
    name: "Backend",
    items: [
      "Spring Boot",
      "FastAPI",
      "Node.js",
      "Express.js",
      "REST APIs",
      "Microservices",
      "Event-Driven Architecture",
      "RAG",
    ],
  },
  { name: "Frontend", items: ["React", "Next.js"] },
  { name: "Databases", items: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Firebase"] },
  {
    name: "Cloud / DevOps",
    items: ["AWS", "EC2", "S3", "Lambda", "Docker", "Linux", "Git", "GitHub Actions", "CI/CD"],
  },
  {
    name: "AI",
    items: ["Claude", "Gemini", "LLM APIs", "RAG", "Vector Databases", "Qdrant"],
  },
];
