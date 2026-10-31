// Every word on the page. Nothing is hardcoded in markup.

export const person = {
  name: 'Neeti Kurulkar',
  first: 'Neeti',
  last: 'Kurulkar',
  line: 'I measure how AI systems fail, then build the part that stops them.',
  where: 'MSc Artificial Intelligence · Plaksha University',
  email: 'neetikurulkar@gmail.com',
  github: 'https://github.com/neeti-kurulkar',
  linkedin: 'https://www.linkedin.com/in/neeti-kurulkar/',
}

export const education = [
  {
    school: 'Plaksha University',
    degree: 'MSc Artificial Intelligence',
    period: 'July 2026 — July 2027',
    detail: '',
  },
  {
    school: 'Savitribai Phule Pune University',
    degree: 'B.E. Computer Science',
    period: '2022 — 2026',
    detail: 'GPA 9.2 / 10',
  },
]

export const projects = [
  {
    id: 'injection',
    name: 'Injection failures in a bank bot',
    year: '2026',
    tags: ['AI safety', 'Evaluation'],
    blurb:
      'A measurement study of prompt injection against a tool-using support agent for a fictional Indian bank, across three models and four language variants. 608 attacks, run with and without permission checks in the tool layer.',
    detail:
      'The protocol was fixed before any results were seen: designs before code, a pre-registered benign threshold, deterministic scoring with no LLM judge, and three of eight attack families sealed until the defense was frozen. Under the defense no attack achieved cross-customer access in 1,824 scenarios, and none of 40 benign look-alikes were wrongly blocked. Repeating a planted policy value needs no tool, so the defense could not stop that. Devanagari Hindi came out the weakest variant on all three models, including the Hindi-focused one.',
    stat: '27.6% → 13.6%',
    statNote: 'attack success, before and after',
    stack: ['Python', 'Ollama', 'SQLite', 'BM25'],
    links: [
      { label: 'Dashboard', href: 'https://neeti-kurulkar.github.io/bot-injection-eval/' },
      { label: 'Code', href: 'https://github.com/neeti-kurulkar/bot-injection-eval' },
    ],
  },
  {
    id: 'finsql',
    name: 'Text-to-SQL financial analytics',
    year: '2026',
    tags: ['Agents', 'Data platform'],
    blurb:
      'A multi-tenant platform that lets business users ask financial questions in plain English. A six-agent LangGraph pipeline works out the intent, navigates the schema, writes the SQL, validates it, explains the result and picks the chart.',
    detail:
      'Retrieval-augmented SQL generation pulls few-shot examples from ChromaDB by semantic similarity. Organisations are isolated from each other with role-based access behind JWT, and the React front end renders whichever chart the data actually warrants rather than a fixed dashboard.',
    stat: '6 agents',
    statNote: 'understanding to visualisation',
    stack: ['LangGraph', 'FastAPI', 'PostgreSQL', 'React', 'ChromaDB'],
    links: [{ label: 'Code', href: 'https://github.com/neeti-kurulkar/be-project-text-to-sql' }],
  },
  {
    id: 'sentiment',
    name: 'Financial news sentiment reader',
    year: '2026',
    tags: ['Fine-tuning', 'Evaluation'],
    blurb:
      'A fine-tuned DistilBERT that labels this week of real headlines for a given ticker, with a local LLM writing up what the news says. Fine-tuning reached 82% against 66% for a much larger untrained model.',
    detail:
      'Then I checked whether any of it was worth anything. The sentiment does not predict the stock: 58.6% directional accuracy against 54.9% for always guessing the common outcome. So the tool reports the mood, prints its own limits, and refuses to say whether to invest. Fine-tuning bought real accuracy and bought nothing useful downstream, and finding that out honestly was the project.',
    stat: '82% vs 66%',
    statNote: 'fine-tuned against a larger untrained model',
    stack: ['PyTorch', 'DistilBERT', 'Ollama', 'pandas'],
    links: [{ label: 'Code', href: 'https://github.com/neeti-kurulkar/plaksha-python-mini-capstone' }],
  },
  {
    id: 'chaos',
    name: 'Choose Your Chaos',
    year: '2026',
    tags: ['HCI', 'Game'],
    blurb:
      'A short, sarcastic, comic-panel choose-your-path game about everyday safety situations for adult women in India. Four scenarios: a cab, a late dinner invitation from a senior, a crowded commute, and a wedding uncle with opinions.',
    detail:
      'A university HCI prototype, built as a static front end with no backend and nothing leaving the browser. Hand-drawn SVG scenes animated with GSAP, per-choice visual gags, a full accessibility pass with axe scans on mobile and desktop, and a user-test plan with a consent script and aftercare. The helplines carry sources and last-verified dates.',
    stat: '4 scenarios',
    statNote: 'all playable, nothing leaves the browser',
    stack: ['JavaScript', 'GSAP', 'SVG', 'Playwright'],
    links: [
      { label: 'Play it', href: 'https://neeti-kurulkar.github.io/choose-your-chaos/' },
      { label: 'Code', href: 'https://github.com/neeti-kurulkar/choose-your-chaos' },
    ],
  },
]

export const internships = [
  {
    role: 'Full Stack Developer Intern',
    company: 'Out of the Blue, Inc.',
    period: 'October 2025 — present',
    place: 'Pune',
    points: [
      'Building revenue intelligence for a B2B eCommerce observability platform: ad spend attribution, ROAS optimisation and conversion funnel analytics.',
      'Extending the MCP Gateway Server so natural-language questions can reach distributed analytics backends, with request routing and multi-server aggregation behind them.',
    ],
  },
  {
    role: 'Software Developer Intern',
    company: 'Plural Technology Pvt. Ltd.',
    period: 'December 2024 — February 2025',
    place: 'Pune',
    points: [
      'Built an AI-powered 3D virtual assistant with facial and speech recognition, using TensorFlow/Keras and FastAPI with custom multilingual models.',
      'Gave it an interactive front end in React, Three.js and Blender for real-time interaction.',
    ],
  },
  {
    role: 'Technical Lead',
    company: 'ACM Student Chapter',
    period: 'January 2024 — present',
    place: 'Pune',
    points: [
      'Ran workshops on web development, AI/ML and competitive programming.',
      'Organised a 12-hour city-wide hackathon and a 30-day nationwide DSA challenge.',
    ],
  },
]

export const skills = [
  { group: 'Languages', items: 'Python · JavaScript · Java · SQL · C++' },
  { group: 'Frameworks', items: 'React · Node · FastAPI · LangChain · LangGraph · Autogen · PyTorch · scikit-learn · pandas' },
  { group: 'Data', items: 'PostgreSQL · MongoDB · SQLite · ChromaDB' },
  { group: 'Platforms', items: 'Git · AWS · Azure · IBM Cloud · Databricks · Docker · Kubernetes' },
  { group: 'Languages spoken', items: 'Hindi and Marathi native · English C2 · German B1' },
]

export const awards = [
  { name: 'The Better Hack 2025', value: '1st, city-wide' },
  { name: 'IBM SkillsBuild Hackathon 2025', value: 'Top 10 of 70+' },
  { name: 'Smart India Hackathon 2024', value: '6th of 500+' },
]

// CC-BY and CC-BY-SA both require this to stay on the page.
export const credits = [
  {
    title: 'Cute Ghost',
    author: 'Arsyuta777',
    licence: 'CC BY 4.0',
    href: 'https://sketchfab.com/3d-models/cute-ghost-animated-idle-wave-scared-e50bb17a19d849c590bac5d66779a6c9',
  },
]
