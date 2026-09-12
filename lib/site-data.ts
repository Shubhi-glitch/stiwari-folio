/**
 * ─────────────────────────────────────────────────────────────
 *  EDIT EVERYTHING ABOUT YOU IN THIS ONE FILE.
 *  Replace the placeholder values with your real details.
 * ─────────────────────────────────────────────────────────────
 */

export const profile = {
  firstName: "Shubhi",
  lastName: "Tiwari",
  initials: "ST",
  roles: ["Data Analyst", "Product Analyst", "AI / ML Engineer", "Full-Stack Developer"],
  tagline: "I turn raw datasets into clear, actionable insight.",
  bio: "Data-focused analyst turning raw datasets into clear, actionable insight — from KPI dashboards and statistical analysis to predictive modeling and stakeholder-ready reporting. Comfortable across the full analytics stack, and equally effective explaining findings to technical and non-technical audiences alike. Currently Product and Research Analyst at Ethicent, working across US banking and financial compliance research.",
  location: "Bengaluru, India",
  email: "shubhitiwari54321@gmail.com",
  availability: "Open to full-time roles",
  resumeUrl: "/resume.pdf",
  socials: [
    { label: "GitHub", href: "https://github.com/Shubhi-glitch" },
    { label: "LinkedIn", href: "https://linkedin.com/in/shubhi-tiwari-a12028254" },
    { label: "Email", href: "mailto:shubhitiwari54321@gmail.com" },
  ],
}

export type Project = {
  slug: string
  title: string
  year: string
  category: "AI / ML" | "Data Analyst" | "Business" | "Product" | "Research"
  summary: string
  description: string
  role: string
  stack: string[]
  metrics: { label: string; value: string }[]
  variant: "neural" | "lattice" | "flow" | "orbit" | "terrain" | "prism"
  href?: string
}

export const projects: Project[] = [
  {
    slug: "dataguard-ai-pro",
    title: "DataGuard AI Pro",
    year: "2025",
    category: "AI / ML",
    summary: "Enterprise data quality platform detecting anomalies across CSV, Excel, and JSON datasets.",
    description:
      "Designed a full data-quality engine detecting missing values, duplicates, and statistical anomalies using Isolation Forest across CSV, Excel, and JSON datasets, with a weighted 0-100 scoring system and exportable reports.",
    role: "Backend design, ML integration, unit testing",
    stack: ["Python", "FastAPI", "Pandas", "Scikit-learn", "Streamlit", "SQLAlchemy"],
    metrics: [
      { label: "Quality score", value: "0-100" },
      { label: "Formats supported", value: "3" },
      { label: "Detection method", value: "Isolation Forest" },
    ],
    variant: "neural",
    href: "https://github.com/Shubhi-glitch",
  },
  {
    slug: "neuraquery",
    title: "NeuraQuery — AI Document Assistant",
    year: "2025",
    category: "AI / ML",
    summary: "RAG pipeline delivering sub-second semantic search across document libraries.",
    description:
      "Architected a retrieval-augmented generation pipeline covering chunking, embedding, and vector search, delivering sub-second semantic search results across large document libraries.",
    role: "RAG architecture, backend API",
    stack: ["Python", "FastAPI", "LangChain", "FAISS"],
    metrics: [
      { label: "Query latency", value: "<1s" },
      { label: "Pipeline", value: "RAG" },
      { label: "Vector store", value: "FAISS" },
    ],
    variant: "flow",
    href: "https://github.com/Shubhi-glitch",
  },
  {
    slug: "pulsegrid",
    title: "PulseGrid",
    year: "2025",
    category: "Product",
    summary: "Real-time distributed system monitoring dashboard with automated incident detection.",
    description:
      "Built a full-stack observability platform streaming live health metrics through an interactive dashboard, with automated incident detection and a MongoDB-backed incident timeline.",
    role: "Full-stack development, real-time architecture",
    stack: ["React", "Node.js", "Express", "MongoDB", "Socket.io", "Three.js"],
    metrics: [
      { label: "Metrics tracked", value: "3+" },
      { label: "Updates", value: "Real-time" },
      { label: "Incident log", value: "MongoDB" },
    ],
    variant: "orbit",
    href: "https://github.com/Shubhi-glitch",
  },
  {
    slug: "blinkit-forecasting",
    title: "Blinkit Sales Forecasting & Performance Analysis",
    year: "2025",
    category: "Data Analyst",
    summary: "Retail sales analysis and forecasting with Power BI dashboards across outlet type and location.",
    description:
      "Analyzed Blinkit retail sales data end-to-end, engineering KPIs (Total Sales, Avg Rating, Item Count) and building Power BI dashboards to compare performance across outlet type, size, location, and item category. Trained and tuned Random Forest vs. Linear Regression models to forecast sales, identifying outlet type, size, and location as the strongest drivers.",
    role: "Data analysis, modelling, BI dashboards",
    stack: ["Python", "Pandas", "Scikit-learn", "Power BI", "Random Forest"],
    metrics: [
      { label: "Models compared", value: "2" },
      { label: "KPIs tracked", value: "3" },
      { label: "Dashboard", value: "Power BI" },
    ],
    variant: "terrain",
    href: "https://github.com/Shubhi-glitch",
  },
  {
    slug: "layoff-stock-impact",
    title: "Layoff Impact on Stock Performance — A/B Test",
    year: "2025",
    category: "Business",
    summary: "Statistical A/B testing framework evaluating layoff size against post-announcement stock returns.",
    description:
      "Designed an A/B testing framework and ran an independent two-sample t-test on 55 layoff events across 19 public companies to evaluate whether layoff size significantly affects 90-day post-announcement stock returns. Found no statistically significant difference (p = 0.45) and built a Power BI executive dashboard to present findings to stakeholders.",
    role: "Statistical analysis, dashboard design",
    stack: ["Python", "Pandas", "SciPy", "yfinance", "Power BI"],
    metrics: [
      { label: "Events analyzed", value: "55" },
      { label: "Companies", value: "19" },
      { label: "p-value", value: "0.45" },
    ],
    variant: "lattice",
    href: "https://github.com/Shubhi-glitch",
  },
  {
    slug: "ml-musical-therapy",
    title: "ML Approach for Musical Therapy Using Facial Expressions",
    year: "2024",
    category: "Research",
    summary: "Real-time facial emotion detection driving accessibility-focused music therapy.",
    description:
      "Built a real-time front-end emotion-detection system using face-api.js, validating accuracy across happy, sad, angry, and neutral expressions for accessibility-focused wellness use cases, paired with the Web Audio API for responsive playback.",
    role: "Front-end ML integration, UX",
    stack: ["JavaScript", "face-api.js", "HTML/CSS", "Web Audio API"],
    metrics: [
      { label: "Expressions", value: "4" },
      { label: "Detection", value: "Real-time" },
      { label: "Focus", value: "Accessibility" },
    ],
    variant: "prism",
    href: "https://github.com/Shubhi-glitch",
  },
]

export const stats = [
  { value: String(projects.length), label: "Projects shipped" },
  { value: "5", label: "Professional roles" },
  { value: "4", label: "Disciplines" },
  { value: "7.70", label: "CGPA / 10" },
]

export const skillGroups = [
  {
    title: "Data & Analytics",
    items: [
      "SQL",
      "Python (Pandas, NumPy)",
      "Excel",
      "Power BI",
      "Tableau",
      "Statistical Analysis",
      "A/B Testing",
      "Regression",
      "Predictive Modeling",
    ],
  },
  {
    title: "Databases & Systems",
    items: ["DBMS", "Data Mining", "Segmentation Techniques", "SQLite", "SQLAlchemy"],
  },
  {
    title: "Programming",
    items: ["Python", "SQL", "Java", "C++", "JavaScript", "HTML/CSS"],
  },
  {
    title: "Tools & Cloud",
    items: ["Git", "GitHub", "AWS", "Azure", "GCP"],
  },
]

export const timeline = [
  {
    period: "Aug 2026 — Present",
    title: "Product and Research Analyst",
    org: "Ethicent, Bengaluru (Remote/Hybrid)",
    detail:
      "Conduct research and lead structured discussions with subject-matter consultants to synthesize domain insights across compliance topics, producing reports used for internal decision-making. Coordinate and host client-facing webinars end-to-end, translating research into clear, audience-ready content, while building and maintaining client and consultant relationships.",
  },
  {
    period: "Aug 2026 — Present",
    title: "Data and AI Operations Intern",
    org: "MetaBit (Remote, part-time)",
    detail:
      "Support data and AI operations for an early-stage startup alongside the primary role at Ethicent — processing datasets and running quality and calibration checks on AI-generated outputs to catch inconsistencies before delivery.",
  },
  {
    period: "Jul 2025 — Aug 2025",
    title: "Machine Learning Intern",
    org: "Tripple One Solutions, Remote",
    detail:
      "Sourced, cleaned, and preprocessed datasets from 5+ sources in Python, writing validation checks that improved downstream model accuracy. Developed and unit-tested ML components (TensorFlow, Pandas, NumPy) to surface patterns and debug issues across large datasets — hands-on experience with data mining at scale.",
  },
  {
    period: "May 2025 — Jun 2025",
    title: "Web Development Intern",
    org: "Cognifyz Technologies, Remote",
    detail:
      "Engineered and maintained 3+ client-facing web applications, rapidly learning new frameworks and delivering all milestones on schedule.",
  },
  {
    period: "Mar 2025 — Jun 2025",
    title: "Business Development Associate",
    org: "Intellipaat, Remote",
    detail:
      "Explained technical course offerings to non-technical leads over calls, translating complex information into clear, goal-relevant insights while pitching and qualifying leads daily.",
  },
  {
    period: "2022 — 2026",
    title: "B.Tech, Computer Science and Engineering",
    org: "KIIT, Bhubaneswar, Odisha",
    detail: "CGPA 7.70/10. Certified in AI by IIT Kanpur; active GitHub portfolio across backend systems, RAG pipelines, and data engineering.",
  },
]

export const capabilities = [
  {
    index: "01",
    title: "Frame the question",
    body: "Before touching a dataset: what decision does this change, and for whom? I frame the objective and the metric that actually matters.",
  },
  {
    index: "02",
    title: "Interrogate the data",
    body: "Profiling, validation checks, distribution checks. Most model and dashboard failures are data failures wearing a disguise.",
  },
  {
    index: "03",
    title: "Analyze and validate",
    body: "Honest baselines first, statistical rigor throughout. A/B tests, regression, and predictive models — validated, not just fitted.",
  },
  {
    index: "04",
    title: "Report and deliver",
    body: "An insight nobody understands is not an insight. I build the dashboard, report, or webinar that makes it actionable for the room it's presented to.",
  },
]

export const experiments = [
  {
    slug: "particle-field",
    title: "Attention Field",
    subtitle: "GPU particle system",
    note: "30,000 points on the GPU, curl-noise displacement, mouse acting as an attractor. Move your cursor.",
    tags: ["WebGL", "GLSL", "Instancing"],
  },
  {
    slug: "flow-ribbon",
    title: "Gradient Descent",
    subtitle: "Animated loss surface",
    note: "A vertex-displaced surface standing in for a loss landscape, with a marker descending toward the minimum.",
    tags: ["Shaders", "Vertex Displacement"],
  },
  {
    slug: "voronoi",
    title: "Latent Cells",
    subtitle: "Fragment shader",
    note: "Raw fragment-shader voronoi noise, animated in time. Pure math, zero geometry.",
    tags: ["Fragment Shader", "Noise"],
  },
  {
    slug: "morph",
    title: "Dimensional Reduction",
    subtitle: "Geometry morph",
    note: "A point cloud collapsing between a sphere, a cube, and a plane — a visual joke about PCA.",
    tags: ["Geometry", "Lerp", "Points"],
  },
]

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Lab", href: "/lab" },
  { label: "Contact", href: "/contact" },
]
