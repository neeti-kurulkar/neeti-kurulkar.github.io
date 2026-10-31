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
    period: '2026 — 2027',
    detail: '',
  },
  {
    school: 'Savitribai Phule Pune University',
    degree: 'B.E. Computer Science',
    period: '2022 — 2026',
    detail: 'CGPA 9.3 / 10',
  },
]

export const internships = [
  {
    role: 'Full Stack Developer Intern',
    company: 'Out of the Blue, Inc.',
    period: '2025 — 2026',
    detail: 'Pune',
    points: [
      'Revenue intelligence for a B2B eCommerce observability platform: ad spend attribution, ROAS optimisation, conversion funnel analytics.',
      'Extended the MCP Gateway Server so natural-language questions reach distributed analytics backends, with request routing and multi-server aggregation behind them.',
    ],
  },
  {
    role: 'Software Developer Intern',
    company: 'Plural Technology',
    period: '2024 — 2025',
    detail: 'Pune',
    points: [
      'An AI-powered 3D virtual assistant with facial and speech recognition, in TensorFlow/Keras and FastAPI with custom multilingual models.',
      'Its front end in React, Three.js and Blender for real-time interaction.',
    ],
  },
]

/* The four in the spotlight. Each carries the figures that matter, so a panel
   can be read without opening anything. */
export const projects = [
  {
    id: 'injection',
    name: 'Injection failures in a bank bot',
    year: '2026',
    tags: ['AI safety', 'Evaluation'],
    readings: [
      { k: 'attack success', v: '27.6% → 13.6%' },
      { k: 'attacks run', v: '608' },
      { k: 'models tested', v: '3' },
      { k: 'cross-customer access', v: '0 of 1,824' },
    ],
    blurb:
      'A measurement study of prompt injection against a tool-using support agent for a fictional Indian bank, across three models and four language variants.',
    detail:
      'The protocol was fixed before any results were seen: designs before code, a pre-registered benign threshold, deterministic scoring with no LLM judge, and three of eight attack families sealed until the defense was frozen. Under the defense no attack achieved cross-customer access in 1,824 scenarios, and none of 40 benign look-alikes were wrongly blocked. Repeating a planted policy value needs no tool, so the defense could not stop that one. Devanagari Hindi came out the weakest variant on all three models, including the Hindi-focused one.',
    stack: ['Python', 'Ollama', 'SQLite', 'BM25'],
    demo: { label: 'Open the dashboard', href: 'https://neeti-kurulkar.github.io/bot-injection-eval/' },
    code: 'https://github.com/neeti-kurulkar/bot-injection-eval',
  },
  {
    id: 'finsql',
    name: 'Text-to-SQL financial analytics',
    year: '2026',
    tags: ['Agents', 'Data platform'],
    readings: [
      { k: 'agents in the pipeline', v: '6' },
      { k: 'tenancy', v: 'multi-org, RBAC' },
      { k: 'retrieval', v: 'ChromaDB few-shot' },
      { k: 'charts', v: 'chosen by the data' },
    ],
    blurb:
      'A multi-tenant platform that lets business users ask financial questions in plain English, answered by a six-agent LangGraph pipeline.',
    detail:
      'The agents handle intent, schema navigation, SQL generation, validation, insight and visualisation in turn. Retrieval-augmented generation pulls few-shot examples from ChromaDB by semantic similarity. Organisations are isolated from each other with role-based access behind JWT, and the React front end renders whichever chart the data actually warrants rather than a fixed dashboard.',
    stack: ['LangGraph', 'FastAPI', 'PostgreSQL', 'React', 'ChromaDB'],
    demo: { label: 'Open finq', href: 'https://finq.web.app/' },
    code: 'https://github.com/neeti-kurulkar/be-project-text-to-sql',
  },
  {
    id: 'sentiment',
    name: 'Financial news sentiment reader',
    year: '2026',
    tags: ['Fine-tuning', 'Evaluation'],
    readings: [
      { k: 'fine-tuned accuracy', v: '82%' },
      { k: 'larger untrained model', v: '66%' },
      { k: 'predicts the stock', v: 'no' },
      { k: 'directional vs guessing', v: '58.6% / 54.9%' },
    ],
    blurb:
      'A fine-tuned DistilBERT that labels this week of real headlines for a ticker, with a local LLM writing up what the news says.',
    detail:
      'Then I checked whether any of it was worth anything. The sentiment does not predict the stock: 58.6% directional accuracy against 54.9% for always guessing the common outcome. So the tool reports the mood, prints its own limits, and refuses to say whether to invest. Fine-tuning bought real accuracy and bought nothing useful downstream, and finding that out honestly was the project.',
    stack: ['PyTorch', 'DistilBERT', 'Ollama', 'pandas'],
    demo: { label: 'Watch the walkthrough', href: 'https://youtu.be/2MEHOc2EDn0' },
    code: 'https://github.com/neeti-kurulkar/plaksha-python-mini-capstone',
  },
  {
    id: 'chaos',
    name: 'Choose Your Chaos',
    year: '2026',
    tags: ['HCI', 'Game'],
    readings: [
      { k: 'scenarios', v: '4, all playable' },
      { k: 'backend', v: 'none' },
      { k: 'accessibility', v: 'axe, mobile + desktop' },
      { k: 'helplines', v: 'sourced and dated' },
    ],
    blurb:
      'A short, sarcastic, comic-panel choose-your-path game about everyday safety situations for adult women in India.',
    detail:
      'Four scenarios: a cab, a late dinner invitation from a senior, a crowded commute, and a wedding uncle with opinions. A university HCI prototype, built as a static front end with nothing leaving the browser. Hand-drawn SVG scenes animated with GSAP, per-choice visual gags, a full accessibility pass, and a user-test plan with a consent script and aftercare.',
    stack: ['JavaScript', 'GSAP', 'SVG', 'Playwright'],
    demo: { label: 'Play it', href: 'https://neeti-kurulkar.github.io/choose-your-chaos/' },
    code: 'https://github.com/neeti-kurulkar/choose-your-chaos',
  },
]

/* Everything else, behind "see more". */
export const archive = [
  {
    name: 'RegTech compliance copilot',
    year: '2026',
    note: 'A compliance assistant for Indian non-bank lenders that cites every claim, across the RBI rulebook, company codes and penalty orders.',
    code: 'https://github.com/neeti-kurulkar/regtech-copilot',
  },
  {
    name: 'CodeMorph',
    year: '2025',
    note: 'A four-agent Autogen pipeline that automated legacy code migration: strategy, migration, testing, documentation.',
    code: 'https://github.com/adv-11/TheBetterHack-2025',
  },
  {
    name: 'Disaster Resilience Platform',
    year: '2025',
    note: 'Real-time SOS alerts, geospatial resource mapping and volunteer coordination, with Watsonx.ai filtering incoming news.',
    demo: 'https://disaster-platform-ibm.streamlit.app/',
    code: 'https://github.com/adv-11/Disaster_Resilience_Platform',
  },
  {
    name: 'PMAY-G Insights Dashboard',
    year: '2025',
    note: 'Rural housing fund allocation across India, from state down to panchayat, with questions answered by generated SQL.',
    code: 'https://github.com/neeti-kurulkar/gramnivesh-avishkar-project',
  },
  {
    name: 'Sansthaein Aur Samvidhan',
    year: '2024',
    note: 'The Indian Constitution taught through interactive 3D gameplay in Unreal Engine, with an AI guide.',
    demo: 'https://www.youtube.com/watch?v=txhCER6uMyA',
  },
  {
    name: 'Cold Email Generator',
    year: '2024',
    note: 'Personalised internship outreach for a college placement cell, from job posts and student portfolios.',
    code: 'https://github.com/neeti-kurulkar/cold-email-generator',
  },
  {
    name: 'MConnect Q&A',
    year: '2024',
    note: 'A question-and-answer platform for college students, with a FastAPI backend over MySQL.',
    code: 'https://github.com/neeti-kurulkar/mconnect-qna-website',
  },
]

export const skills = [
  { group: 'Languages', items: 'Python · JavaScript · Java · SQL · C++' },
  { group: 'Frameworks', items: 'React · Node · FastAPI · LangChain · LangGraph · Autogen · PyTorch · scikit-learn · pandas' },
  { group: 'Data', items: 'PostgreSQL · MongoDB · SQLite · ChromaDB' },
  { group: 'Platforms', items: 'Git · AWS · Azure · IBM Cloud · Databricks · Docker · Kubernetes' },
]

export const spoken = [
  { name: 'Hindi', level: 'Native' },
  { name: 'Marathi', level: 'Native' },
  { name: 'English', level: 'C2' },
  { name: 'German', level: 'B1' },
]

export const achievements = [
  { name: 'The Better Hack 2025', place: '1st', of: 'city-wide hackathon, Pune' },
  { name: 'IBM SkillsBuild Hackathon 2025', place: 'Top 10', of: 'of 70+ entries, state level' },
  { name: 'Smart India Hackathon 2024', place: '6th', of: 'of 500+ entries, EdTech' },
]

// CC BY 4.0 makes this credit a licence condition, not a courtesy.
export const credits = [
  {
    title: 'Cute Ghost',
    author: 'Arsyuta777',
    licence: 'CC BY 4.0',
    href: 'https://sketchfab.com/3d-models/cute-ghost-animated-idle-wave-scared-e50bb17a19d849c590bac5d66779a6c9',
  },
]
