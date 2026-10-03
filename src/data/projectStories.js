export const projectStories = {
  'anomaly-detection': {
    short: 'Logs', filter: 'Data systems', accent: '#ff8787',
    question: 'Which traffic deserves attention?',
    summary: 'A path from raw server activity to explainable anomaly signals.',
    stages: [
      { name: 'Prepare', tool: 'PySpark', text: 'Generate synthetic HTTP traffic and aggregate per-IP behavior, error rates, request volume, and endpoint access patterns.' },
      { name: 'Detect', tool: 'Ensemble', text: 'The offline pipeline combines Isolation Forest, local outliers, rules, and an LSTM autoencoder. SHAP helps explain the signals.' },
      { name: 'Serve', tool: 'FastAPI', text: 'The smaller serving deployment runs Isolation Forest and a scaler. The project also documents monitoring and drift analysis.' },
    ],
    challenge: 'A high volume of server events makes manual inspection impractical. The project explores how to surface unusual behavior and give each alert useful context.',
    decisions: 'Separate feature engineering, offline ensemble analysis, and a smaller scoring service. Track experiments with MLflow and inspect feature drift with KS tests and PSI.',
    limits: 'The 500K-row dataset is synthetic. Offline ensemble results and the deployed Isolation Forest service are different evaluation targets; they should not be presented as one benchmark.',
  },
  'clinical-lab-predictor': {
    short: 'Clinical', filter: 'Applied ML', accent: '#89d8c4',
    question: 'What makes a prediction inspectable?',
    summary: 'A research workflow that treats evaluation and delivery as part of the model.',
    stages: [
      { name: 'Curate', tool: 'Pandas', text: 'Prepare the Pima Indians Diabetes dataset with curation, imputation, feature engineering, and class balancing.' },
      { name: 'Evaluate', tool: 'RF / PyTorch', text: 'Compare Random Forest and neural-network models, inspect performance, and audit differences across age groups.' },
      { name: 'Explain', tool: 'SHAP / API', text: 'Expose predictions through FastAPI, inspect feature contributions with SHAP, and track experiments and model versions.' },
    ],
    challenge: 'A score alone tells little about how a model behaves. This project builds the surrounding workflow: data checks, evaluation, explanations, and repeatable deployment.',
    decisions: 'Use a small, well-understood dataset to focus on ML engineering. Keep training, evaluation, governance, and serving as separate parts of the system.',
    limits: 'Research only. The displayed evaluation is a separate eight-feature Random Forest baseline with training-only median imputation. It does not reproduce the deployed model or the README scores. A single split from a specific population cannot establish clinical validity or fairness.',
  },
  'signal-ai': {
    short: 'SIGNAL', filter: 'GenAI', accent: '#b5a4fa',
    question: 'What connects the conversations?',
    summary: 'A multi-agent workflow for finding patterns across sales-call transcripts.',
    stages: [
      { name: 'Structure', tool: 'Agent 01', text: 'Turn transcripts into structured call context, buyer roles, and pivotal moments for downstream analysis.' },
      { name: 'Synthesize', tool: 'Agents 02 to 04', text: 'Analyze themes and sentiment, then connect recurring pain points, buying signals, and objections across calls.' },
      { name: 'Advise', tool: 'Agent 05', text: 'Organize findings into prioritized recommendations, a Streamlit dashboard, and an exportable PDF report.' },
    ],
    challenge: 'Qualitative insights are scattered across long conversations. SIGNAL explores how a sequence of focused agents can structure and synthesize those observations.',
    decisions: 'Give each of five agents a distinct responsibility, from ingestion to strategic advice. Surface findings in a dashboard with report export.',
    limits: 'Work in progress. The repository documents six sample transcripts; quantitative performance claims need a defined evaluation dataset and human-review methodology.',
  },
};
