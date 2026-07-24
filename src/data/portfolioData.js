// ============================================================
// portfolioData.js — Centralized configuration for Mayur Patil's Portfolio
// All external links, personal info, and content in one place.
// Built from Mayur's resume + GitHub (github.com/mayur212626).
// ============================================================

export const personalInfo = {
  name: "Mayur Patil",
  firstName: "Mayur",
  brandName: "Mayur Patil",
  title: "Data Scientist & ML Engineer",
  location: "Falls Church, VA",
  phone: "+1 (571) 251-6813",
  emails: {
    primary: "mayurpatil4001@gmail.com",
    secondary: "mayurpatil4001@gmail.com",
  },
  summary:
    "M.S. Data Science student at GWU building large-scale ML and data systems — from 500K-record PySpark pipelines to clinical ML models with full governance and live API deployment. Published researcher, open to a Summer 2026 Data Science internship.",
  resumeUrl: "/Mayur_Patil_Resume.pdf", // drop resume PDF into /public with this name
};

export const socialLinks = {
  github: "https://github.com/mayur212626",
  linkedin: "https://linkedin.com/in/mayurpatil26",
  instagram: "https://instagram.com/data.mind.hq",
};

export const heroContent = {
  greeting: "Hi, I'm Mayur Patil",
  titleHighlight: "Data Scientist & ML Engineer",
  subtitle:
    "I build end-to-end ML systems — big-data pipelines, deep learning models, and governed, production-ready deployments.",
  ctaPrimary: { text: "View My Work", href: "#projects" },
  ctaSecondary: {
    text: "Contact Me",
    href: "mailto:mayurpatil4001@gmail.com?subject=Opportunity – Portfolio&body=Hi Mayur,%0D%0A%0D%0AI came across your portfolio and would like to connect.%0D%0A%0D%0ABest regards,",
  },
  ctaResume: { text: "Download Resume", href: "/Mayur_Patil_Resume.pdf" },
};

export const aboutContent = {
  heading: "Hello!",
  bio: `Hi, my name is <span class="text-black text-xl font-black mx-1 tracking-wide uppercase">Mayur Patil</span>, a Data Scientist and ML Engineer pursuing an M.S. in Data Science at the George Washington University. I build large-scale ML and data systems end to end — from PySpark pipelines and deep learning models to governed, production-ready APIs.`,
  techStack: ["Python", "PyTorch", "PySpark"],
};

export const skillsContent = {
  badge: "My Process",
  heading: "How I turn data into deployed intelligence",
  description:
    "A rigorous, end-to-end approach — from raw data to governed, production-ready ML systems.",
  cards: [
    {
      number: "01",
      title: "Frame",
      text: "Defining the problem, success metrics, and governance requirements before a single line of code.",
    },
    {
      number: "02",
      title: "Engineer",
      text: "Building scalable data pipelines with PySpark and Pandas — feature engineering, curation, and validation at scale.",
    },
    {
      number: "03",
      title: "Model",
      text: "Training and tuning ML/DL models (PyTorch, Scikit-learn, XGBoost) with rigorous experimentation and A/B testing.",
    },
    {
      number: "04",
      title: "Deploy",
      text: "Shipping governed, monitored services — FastAPI, Docker, MLflow, SHAP, and CI/CD for reproducible, audit-ready ML.",
    },
  ],
  endText: "Shipped & monitored!",
};

// Technical Skills — from resume
export const technicalSkills = {
  categories: [
    {
      title: "Languages",
      skills: [
        { name: "Python", level: 95 },
        { name: "SQL", level: 90 },
        { name: "R", level: 78 },
        { name: "C++", level: 72 },
        { name: "Bash", level: 75 },
      ],
    },
    {
      title: "ML & Deep Learning",
      skills: [
        { name: "PyTorch", level: 90 },
        { name: "TensorFlow", level: 80 },
        { name: "Scikit-learn", level: 92 },
        { name: "XGBoost", level: 85 },
        { name: "LSTM / CNN", level: 85 },
      ],
    },
    {
      title: "Data Engineering",
      skills: [
        { name: "PySpark / Spark", level: 88 },
        { name: "Pandas", level: 95 },
        { name: "NumPy", level: 92 },
        { name: "Hadoop", level: 72 },
        { name: "Docker", level: 82 },
      ],
    },
    {
      title: "Cloud & MLOps",
      skills: [
        { name: "AWS SageMaker", level: 82 },
        { name: "AWS EC2 / S3", level: 82 },
        { name: "GCP Vertex AI", level: 72 },
        { name: "MLflow", level: 85 },
        { name: "Git", level: 90 },
      ],
    },
    {
      title: "Techniques",
      skills: [
        { name: "Feature Engineering", level: 92 },
        { name: "Model Governance", level: 85 },
        { name: "Bias & Fairness", level: 85 },
        { name: "A/B Testing", level: 84 },
        { name: "SHAP / Explainability", level: 86 },
      ],
    },
    {
      title: "Foundations",
      skills: [
        { name: "Statistics", level: 90 },
        { name: "Hypothesis Testing", level: 88 },
        { name: "NLP", level: 84 },
        { name: "Experimental Design", level: 85 },
        { name: "CI/CD & Reproducibility", level: 82 },
      ],
    },
  ],
};

// Repurposed "Content Creation" section → CORE STRENGTHS (4 pillars)
export const contentCreation = {
  badge: "What I Bring",
  heading: "Core Strengths",
  description:
    "The pillars behind my work — scalable data systems, rigorous modeling, and production-grade, governed ML.",
  categories: [
    {
      title: "End-to-End ML Systems",
      description:
        "From data to deployed API — training deep learning and ensemble models, then shipping them as live, monitored services.",
      stats: "AUC-ROC 0.96 · Live APIs",
      icon: "🧠",
    },
    {
      title: "Big Data Engineering",
      description:
        "PySpark and Spark pipelines with behavioral feature engineering, windowing, and partitioned Parquet output at scale.",
      stats: "500K+ records processed",
      icon: "⚙️",
    },
    {
      title: "MLOps & Governance",
      description:
        "MLflow tracking, SHAP explainability, drift detection, bias audits, and CI/CD for reproducible, audit-ready ML.",
      stats: "Governed & reproducible",
      icon: "🛡️",
    },
    {
      title: "Applied Research",
      description:
        "Multi-agent LLM systems, NLP, and Bayesian modeling — plus two published research papers.",
      stats: "2 Publications",
      icon: "🔬",
    },
  ],
};

// Repurposed "Leadership" section → PUBLICATIONS (timeline layout)
export const leadershipList = [
  {
    title: "Data Security Management",
    description:
      "Published in the International Journal of Innovative Research in Engineering and Multidisciplinary Physical Sciences (IJIRMPS).",
    role: "IJIRMPS · Sep 2024",
    badge: "Publication",
  },
  {
    title: "Gesture Recognition Using Virtual Mouse",
    description:
      "Published in the International Journal of Innovative Research in Engineering and Multidisciplinary Physical Sciences (IJIRMPS).",
    role: "IJIRMPS · Aug 2024",
    badge: "Publication",
  },
];

// Work Experience — from resume
export const internshipsList = [
  {
    organization: "Academor",
    role: "Cybersecurity Engineer Intern",
    duration: "Nov 2023 – Dec 2023 · Bengaluru, India",
    skills: ["Python Automation", "Observability", "Data Integrity", "Compliance"],
    tech: ["Python", "Monitoring Dashboards", "Alerting", "SQL"],
  },
];

// Soft Skills
export const softSkillsList = [
  { name: "Problem Solving", icon: "🧩", desc: "Breaking large-scale data problems into clean, logical, modular pipelines." },
  { name: "Rigor", icon: "📐", desc: "Governance, reproducibility, and audit-ready documentation baked into every project." },
  { name: "Communication", icon: "💬", desc: "Translating complex ML results into clear, actionable insight for stakeholders." },
  { name: "Research Mindset", icon: "🔬", desc: "Published researcher — hypothesis-driven, evidence-first, always validating." },
  { name: "Ownership", icon: "🚀", desc: "Driving projects end to end, from raw data to a deployed, monitored service." },
  { name: "Adaptability", icon: "🌟", desc: "Quick to pick up new frameworks, cloud stacks, and problem domains." },
  { name: "Collaboration", icon: "🤝", desc: "Working across engineering teams to prioritize and ship remediation." },
  { name: "Time Management", icon: "⏰", desc: "Balancing graduate coursework, research, and multiple ML projects." },
];

export const projects = [
  {
    id: "anomaly-detection",
    number: "01",
    badge: "🚀 Flagship Project",
    title: "Large-Scale Log Anomaly Detection",
    description:
      "A telemetry monitoring pipeline processing 500K+ HTTP server logs with PySpark — 20 behavioral features per IP, and an ensemble of Isolation Forest, Local Outlier Factor, and a rule engine (2-of-3 majority vote) achieving 540x critical-error lift and Precision@100 of 0.78. SHAP explainability, MLflow tracking, KS/PSI drift detection, and FastAPI delivery with full model governance.",
    techTags: ["PySpark", "Scikit-learn", "Isolation Forest", "MLflow", "FastAPI", "SHAP"],
    links: {
      github: "https://github.com/mayur212626/anomaly-detection",
      demo: null,
    },
    isFlagship: true,
  },
  {
    id: "clinical-lab-predictor",
    number: "02",
    badge: null,
    title: "Clinical Lab Abnormality Predictor",
    description:
      "An end-to-end clinical ML system predicting diabetes risk from lab values — group-median imputation, SMOTE balancing, Random Forest + PyTorch NN, and bias audits across age groups. AUC-ROC 0.9618, 89% accuracy, 92% sensitivity, zero fairness disparity. Deployed live on Render with SHAP, MLflow, Streamlit, Docker, and GitHub Actions CI/CD.",
    techTags: ["PyTorch", "Scikit-learn", "FastAPI", "Docker", "Streamlit", "CI/CD"],
    links: {
      github: "https://github.com/mayur212626/clinical-lab-predictor",
      demo: "https://clinical-lab-predictor.onrender.com",
    },
    isFlagship: false,
  },
  {
    id: "signal-ai",
    number: "03",
    badge: null,
    title: "SIGNAL — Sales Intelligence Layer",
    description:
      "A 5-agent LLM pipeline automating qualitative thematic analysis, sentiment tracking, and cross-document synthesis across B2B sales transcripts. 91.2% thematic recall (kappa=0.81), buyer-engagement scoring at r=0.87 with human raters, and a strategic advisory agent producing prioritized P1/P2/P3 recommendations — shipped as a Streamlit dashboard with automated PDF reports.",
    techTags: ["Python", "Multi-Agent LLM", "NLP", "Streamlit"],
    links: {
      github: "https://github.com/mayur212626/signal-ai",
      demo: null,
    },
    isFlagship: false,
  },
  {
    id: "stock-lstm",
    number: "04",
    badge: null,
    title: "Multi-Modal Stock Price Prediction (LSTM)",
    description:
      "An LSTM stock-prediction pipeline on AWS SageMaker achieving MAPE of 7.19% — 44 features combining 39 technical indicators with NLP sentiment from 6,700+ financial news articles. Controlled A/B experiments delivered a 7.1% accuracy gain over baseline, with automated retraining on S3 and audit-ready experiment tracking.",
    techTags: ["PyTorch", "AWS SageMaker", "NLP", "PySpark", "LSTM"],
    links: {
      github: "https://github.com/mayur212626",
      demo: null,
    },
    isFlagship: false,
  },
  {
    id: "fifa-wc2026-predictor",
    number: "05",
    badge: null,
    title: "FIFA World Cup 2026 Predictor",
    description:
      "A Bayesian forecasting engine for the 2026 World Cup using Dixon-Coles modeling and Monte Carlo simulation to project match outcomes and tournament progression.",
    techTags: ["Python", "Bayesian Modeling", "Monte Carlo", "Dixon-Coles"],
    links: {
      github: "https://github.com/mayur212626/fifa-wc2026-predictor",
      demo: null,
    },
    isFlagship: false,
  },
  {
    id: "ais-ship-prediction",
    number: "06",
    badge: null,
    title: "Ship Type & Course Prediction (AIS)",
    description:
      "A PySpark pipeline predicting vessel type and course-over-ground from 358K+ maritime AIS records — large-scale feature engineering and classification on distributed data.",
    techTags: ["PySpark", "Machine Learning", "Big Data", "Classification"],
    links: {
      github: "https://github.com/mayur212626/PREDICTION-OF-SHIP-TYPE-AND-COG-FROM-AIS-DATA-SET",
      demo: null,
    },
    isFlagship: false,
  },
];

// Repurposed "Certifications" section → KEY ACHIEVEMENTS (metric highlights)
export const certificates = {
  featured: [
    { name: "540x Critical-Error Lift", issuer: "Log Anomaly Detection", icon: "📈" },
    { name: "AUC-ROC 0.9618 · Zero Bias", issuer: "Clinical ML Model", icon: "🏥" },
    { name: "91.2% Thematic Recall", issuer: "SIGNAL — Multi-Agent LLM", icon: "🤖" },
    { name: "MAPE 7.19%", issuer: "Stock LSTM on AWS SageMaker", icon: "📊" },
    { name: "500K+ Records", issuer: "PySpark Data Pipeline", icon: "⚙️" },
    { name: "2 Published Papers", issuer: "IJIRMPS · 2024", icon: "🔬" },
  ],
  viewAllUrl: "https://github.com/mayur212626",
};

// Education — from resume
export const education = {
  degree: "M.S. in Data Science",
  institution: "The George Washington University · Washington, DC",
  cgpa: "Expected Dec 2026",
  graduation: "2026",
  twelfth: "B.Tech Computer Science — D.Y. Patil University, Pune",
  tenth: "Graduated Jul 2024",
};

export const footerContent = {
  taglines: [
    "Data Science & ML Engineering",
    "Python · PyTorch · PySpark · AWS",
    "M.S. Data Science @ GWU",
  ],
  credential: "M.S. Data Science · GWU · 2026",
  copyright: `© ${new Date().getFullYear()} Mayur Patil | Built with React`,
};

// EmailJS Configuration — for the working contact form.
// Sign up free at emailjs.com, then put your keys in a .env file (see .env.example).
export const emailjsConfig = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || "YOUR_EMAILJS_SERVICE_ID",
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "YOUR_EMAILJS_TEMPLATE_ID",
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "YOUR_EMAILJS_PUBLIC_KEY",
};
