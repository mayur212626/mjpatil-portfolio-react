const studies = [
  { id: 'anomaly-detection', number: '01', title: 'Find the unusual.', category: 'Log anomaly detection', evidence: 'Inspect a captured API response', symbol: '◌' },
  { id: 'clinical-lab-predictor', number: '02', title: 'Question the prediction.', category: 'Clinical ML research', evidence: 'Explore a reproduced evaluation', symbol: '⊕' },
  { id: 'signal-ai', number: '03', title: 'Connect the conversation.', category: 'Multi-agent language models', evidence: 'Follow the five-agent workflow', symbol: '✳' },
  { id: 'fifa-wc2026-predictor', number: '04', title: 'Forecast the field.', category: 'Sports forecasting', evidence: 'Compare historical backtests', symbol: '⊗' },
];
export default function SignalTransition() {
  return <section className="signal-transition observatory-index" aria-label="Selected work index">
    <div className="index-heading"><span>From curiosity to evidence</span><span>Selected studies / 01 to 04</span></div>
    <div className="index-studies">{studies.map(study => <a key={study.id} href={`#project-${study.id}`} className="index-study" onClick={event=>{if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;event.preventDefault();window.dispatchEvent(new CustomEvent('portfolio:project',{detail:`project-${study.id}`}));}}><span className="index-number">/{study.number}</span><span className="index-symbol" aria-hidden="true">{study.symbol}</span><span className="index-category">{study.category}</span><h2>{study.title}</h2><span className="index-evidence">{study.evidence}<span aria-hidden="true">↗</span></span></a>)}</div>
  </section>;
}
