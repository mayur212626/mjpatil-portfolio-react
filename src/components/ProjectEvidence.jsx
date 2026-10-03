import { useRef, useState } from 'react';
import evaluation from '../data/clinicalEvaluation.json';

const formatPercent = value => `${(value * 100).toFixed(1)}%`;
const agents = [
  ['Structure', 'Turn each transcript into participants, context, and key exchanges.'],
  ['Themes', 'Extract pain points, buying triggers, objections, and severity.'],
  ['Sentiment', 'Trace momentum, trust signals, and seller effectiveness.'],
  ['Patterns', 'Connect themes and competitive signals across calls.'],
  ['Strategy', 'Organize findings into priorities and recommendations.'],
];

function RocChart() {
  const [view, setView] = useState('ROC curve');
  const { metrics, dataset } = evaluation;
  const line = evaluation.roc.map((p, i) => `${i ? 'L' : 'M'}${56 + p.fpr * 408},${254 - p.tpr * 208}`).join(' ');
  return <div className="evaluation-graphic">
    <div className="graphic-heading"><span>INDEPENDENT RF BASELINE</span><span>{dataset.test_rows} test records</span></div>
    <div className="graphic-switch" role="group" aria-label="Clinical evaluation view">{['ROC curve', 'Confusion matrix'].map(label => <button key={label} type="button" aria-pressed={view === label} onClick={() => setView(label)}>{label}</button>)}</div>
    {view === 'ROC curve' ? <svg viewBox="0 0 520 300" role="img" aria-label={`Held-out ROC curve. AUC ${metrics.roc_auc.toFixed(3)}. False positive rate on the horizontal axis and true positive rate on the vertical axis.`}>
      <defs><linearGradient id="roc-fill" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#89d8c4" stopOpacity=".22"/><stop offset="1" stopColor="#89d8c4" stopOpacity="0"/></linearGradient></defs>
      {[0, .25, .5, .75, 1].map(t => <g key={t}><path d={`M56 ${254-t*208}H464 M${56+t*408} 46V254`} stroke="#ffffff10"/><text x="43" y={258-t*208} textAnchor="end">{t}</text><text x={56+t*408} y="274" textAnchor="middle">{t}</text></g>)}
      <path d={`${line} L464 254 L56 254 Z`} fill="url(#roc-fill)"/>
      <path d="M56 254L464 46" stroke="#677486" strokeDasharray="5 6"/>
      <path d={line} fill="none" stroke="#89d8c4" strokeWidth="3" strokeLinejoin="round"/>
      <text x="58" y="25" className="axis-caption">TRUE POSITIVE RATE</text><text x="260" y="297" textAnchor="middle" className="axis-caption">FALSE POSITIVE RATE</text>
      <text x="315" y="197" className="auc-value">{metrics.roc_auc.toFixed(3)}</text><text x="319" y="216" className="axis-caption">AREA UNDER CURVE</text>
    </svg> : <div className="matrix-view"><p>Predicted class →</p><div className="matrix-grid">{metrics.confusion_matrix.flat().map((count, i) => <div key={i} className={i === 0 || i === 3 ? 'matrix-correct' : ''}><strong>{count}</strong><span>{['True negatives', 'False positives', 'False negatives', 'True positives'][i]}</span></div>)}</div><p>Actual class: negative on top, positive below. Threshold 0.5.</p></div>}
    <div className="chart-legend"><span><i/>Random Forest</span><span>95% AUC interval: {metrics.roc_auc_ci95.map(n => n.toFixed(3)).join(' to ')}</span></div>
  </div>;
}

function SignalGraphic() {
  const [active, setActive] = useState(0);
  return <div className="signal-graphic">
    <div className="graphic-heading"><span>FROM CONVERSATION TO CONTEXT</span><span>Source architecture</span></div>
    <svg viewBox="0 0 520 230" aria-hidden="true">
      <defs><radialGradient id="signal-glow"><stop stopColor="#b5a4fa" stopOpacity=".2"/><stop offset="1" stopColor="#b5a4fa" stopOpacity="0"/></radialGradient></defs>
      <ellipse cx="260" cy="125" rx="250" ry="120" fill="url(#signal-glow)"/>
      {[0, 1, 2, 3, 4, 5].map(i => <g key={i} transform={`translate(${137+i*42},25)`}><rect width="29" height="38" rx="5" fill="#1c2236" stroke="#b5a4fa44"/><path d="M7 11H22 M7 18H22 M7 25H16" stroke="#b5a4fa88"/></g>)}
      <path d="M150 65Q150 91 52 106 M365 65Q365 90 260 102 M52 128H468" fill="none" stroke="#b5a4fa55"/>
      <path className="signal-flow" d="M52 128H468" stroke="#b5a4fa" strokeDasharray="3 15"/>
      {agents.map(([name], i) => <g key={name}><circle cx={52+i*104} cy="128" r={active === i ? 31 : 25} fill="#141a2b" stroke={active === i ? '#c5b8ff' : '#b5a4fa55'} strokeWidth={active === i ? 2 : 1}/><text x={52+i*104} y="134" textAnchor="middle" className="agent-number">0{i+1}</text><text x={52+i*104} y="181" textAnchor="middle" className="agent-name">{name}</text></g>)}
      <text x="260" y="222" textAnchor="middle" className="axis-caption">6 SAMPLE TRANSCRIPTS · 5 SPECIALIZED AGENTS</text>
    </svg>
    <div className="agent-controls" role="group" aria-label="Explore SIGNAL agents">{agents.map(([name], i) => <button key={name} type="button" aria-label={`Inspect ${name} agent`} aria-pressed={active === i} onClick={() => setActive(i)}>0{i+1}</button>)}</div>
    <p className="agent-description" aria-live="polite"><strong>{agents[active][0]}.</strong> {agents[active][1]}</p>
  </div>;
}

export function EvidenceSummary({ projectId }) {
  if (projectId === 'clinical-lab-predictor') return <div className="evidence-summary">
    <p className="verification-label"><span/>Reproduced baseline</p>
    <dl className="evidence-metrics"><div><dt>ROC AUC</dt><dd>{evaluation.metrics.roc_auc.toFixed(3)}</dd></div><div><dt>Accuracy</dt><dd>{formatPercent(evaluation.metrics.accuracy)}</dd></div><div><dt>Test records</dt><dd>{evaluation.dataset.test_rows}</dd></div></dl>
    <p>Independent Random Forest baseline on Pima. Stratified 80/20 split; preprocessing fitted on training data only. Separate from the deployed model.</p>
    <a href="/evidence/clinical-evaluation.json" target="_blank" rel="noopener noreferrer">Read evaluation report ↗</a><a href="/evidence/reproduce-clinical.py" download>Reproduce the run ↓</a>
  </div>;
  if (projectId === 'anomaly-detection') return <div className="evidence-summary">
    <p className="verification-label"><span/>Captured API response</p>
    <dl className="evidence-metrics"><div><dt>DoS example</dt><dd className="metric-word">Critical</dd></div><div><dt>Anomaly score</dt><dd>-0.1861</dd></div></dl>
    <p>A real response to the synthetic DoS preset, captured Oct 3, 2026. This is a serving demonstration, not a detection-accuracy benchmark.</p>
    <a href="/evidence/verification-notes.md" target="_blank" rel="noopener noreferrer">View evidence notes ↗</a>
  </div>;
  return <div className="evidence-summary">
    <p className="verification-label"><span/>Verified in source</p>
    <dl className="evidence-metrics"><div><dt>Specialized agents</dt><dd>05</dd></div><div><dt>Sample transcripts</dt><dd>06</dd></div></dl>
    <p>Explore the implemented workflow. Work in progress; a human-reviewed quality benchmark has not been published.</p>
    <a href="https://github.com/mayur212626/signal-ai/blob/c42789dfd0ed25f948dafc1185790af13cda9248/pipeline/agents.py" target="_blank" rel="noopener noreferrer">Inspect the agent pipeline ↗</a>
  </div>;
}

export default function ProjectEvidence({ projectId, title }) {
  const clinical = projectId === 'clinical-lab-predictor';
  const signal = projectId === 'signal-ai';
  const [view, setView] = useState(clinical ? 'Evaluation' : 'Screenshot');
  const dialog = useRef(null);
  const screenshot = `/evidence/${clinical ? 'clinical' : 'anomaly'}-demo.jpg`;
  const caption = clinical ? 'Actual deployed model response to a synthetic preset. Separate from the baseline evaluation.' : 'Actual scoring interface with the synthetic DoS preset and its returned verdict.';
  return <div className="project-visual">
    <div className="visual-topline"><span className="visual-window-dots" aria-hidden="true"><i/><i/><i/></span><span>{signal ? 'SIGNAL / WORKFLOW' : clinical ? 'CLINICAL / MODEL LAB' : 'ANOMALY / SCORING CONSOLE'}</span><span className="visual-index">{signal ? '03' : clinical ? '02' : '01'}</span></div>
    {clinical && <div className="evidence-tabs" role="group" aria-label="Clinical project evidence">{['Evaluation', 'Screenshot'].map(label => <button key={label} type="button" aria-pressed={view === label} onClick={() => setView(label)}>{label}</button>)}</div>}
    {signal ? <SignalGraphic/> : clinical && view === 'Evaluation' ? <RocChart/> : <figure className="project-capture"><button type="button" className="capture-button" onClick={() => dialog.current.showModal()} aria-label={`Enlarge ${title} screenshot`}><img src={screenshot} width="1265" height={clinical ? '886' : '821'} loading="lazy" decoding="async" alt={`${title}: ${caption}`}/><span className="capture-enlarge">View full screenshot ↗</span></button><figcaption>{caption}<span>Captured Oct 3, 2026 · mjpatil.com</span></figcaption></figure>}
    {clinical && view === 'Evaluation' && <p className="visual-footnote">One small held-out split. The interval reflects test-sample uncertainty for this fitted model. Research only.</p>}
    {signal && <p className="visual-footnote">Interactive architecture illustration based on the repository. No generated results are represented.</p>}
    {!signal && <dialog ref={dialog} className="screenshot-dialog" aria-label={`${title} screenshot`} onClick={event => { if (event.target === event.currentTarget) dialog.current.close(); }}><div><h4>{title}</h4><button type="button" onClick={() => dialog.current.close()} autoFocus aria-label="Close screenshot">Close ✕</button></div><img src={screenshot} alt={caption} loading="lazy"/><p>{caption} Captured Oct 3, 2026.</p></dialog>}
  </div>;
}
