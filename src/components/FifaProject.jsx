import { useRef, useState } from 'react';

const revision = '46df68dba0166ac4078666249a3f0ac8e1e6860a';
const repository = 'https://github.com/mayur212626/fifa-wc2026-predictor';
const report = `${repository}/blob/${revision}/reports/backtest_summary.csv`;
const dashboardImage = `${repository}/blob/${revision}/reports/dashboard_final.png?raw=true`;
const backtests = [
  { year: '2018', model: .5659814039, climate: .6493404606, uniform: .6666666667 },
  { year: '2022', model: .6144817184, climate: .6467721046, uniform: .6666666667 },
];

function FootballArtwork() {
  return <svg viewBox="0 0 600 360" role="img" aria-label="Original chrome and violet football sculpture above a probability field">
    <defs>
      <radialGradient id="fifa-chrome" cx="32%" cy="25%" r="80%"><stop stopColor="#fffefb"/><stop offset=".3" stopColor="#d8d3dd"/><stop offset=".64" stopColor="#7b708a"/><stop offset=".82" stopColor="#e8e1ee"/><stop offset="1" stopColor="#504558"/></radialGradient>
      <radialGradient id="fifa-shadow"><stop stopColor="#34293f" stopOpacity=".25"/><stop offset="1" stopColor="#34293f" stopOpacity="0"/></radialGradient>
      <linearGradient id="fifa-panel" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#bba5d3"/><stop offset=".6" stopColor="#79608e"/><stop offset="1" stopColor="#45364f"/></linearGradient>
      <clipPath id="fifa-ball"><circle cx="307" cy="156" r="108"/></clipPath>
    </defs>
    <ellipse cx="307" cy="304" rx="181" ry="30" fill="url(#fifa-shadow)"/>
    <g fill="none" stroke="currentColor" strokeOpacity=".18"><path d="M94 298L307 230L521 298L307 347Z M307 230V347 M94 298H521"/><ellipse cx="307" cy="298" rx="203" ry="42"/><path d="M148 281L361 335M200 264L414 318M251 247L466 301"/></g>
    <g className="fifa-ball-sculpture">
      <circle cx="307" cy="156" r="108" fill="url(#fifa-chrome)"/>
      <g clipPath="url(#fifa-ball)" stroke="#e5dbe9" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M296 119L339 131L347 174L309 194L277 165Z" fill="url(#fifa-panel)"/>
        <path d="M221 97L251 69L276 81L271 113L240 126Z M349 61L380 73L395 108L369 128L342 98Z M204 169L228 147L249 171L241 207L213 216Z M373 198L400 167L421 181L416 219L389 237Z M270 236L311 226L340 248L328 275L283 270Z" fill="url(#fifa-panel)"/>
        <path d="M296 119L271 113 M339 131L369 128 M347 174L373 198 M309 194L311 226 M277 165L249 171 M251 69L262 42 M349 61L339 42 M395 108L429 113 M400 167L424 141 M389 237L369 269 M270 236L241 207 M221 97L192 126 M204 169L186 157" fill="none" stroke="#63516e" strokeOpacity=".7"/>
        <ellipse cx="275" cy="98" rx="63" ry="25" fill="#fff" stroke="none" opacity=".16" transform="rotate(-25 275 98)"/>
      </g>
    </g>
    <g className="fifa-orbit" fill="none" stroke="#89729d" strokeOpacity=".4"><ellipse cx="307" cy="158" rx="167" ry="49" transform="rotate(-24 307 158)" strokeDasharray="3 8"/><circle cx="449" cy="96" r="5" fill="#89729d"/></g>
    <text x="452" y="327" fill="currentColor" fontSize="9">MODEL / SIMULATE / EVALUATE</text>
  </svg>;
}

function ForecastEvidence() {
  const [view, setView] = useState('Backtests');
  const dialog = useRef(null);
  return <div className="project-visual fifa-evidence">
    <div className="visual-topline"><span className="visual-window-dots" aria-hidden="true"><i/><i/><i/></span><span>WORLD CUP / MODEL LAB</span><span className="visual-index">04</span></div>
    <div className="evidence-tabs" role="group" aria-label="FIFA project evidence">{['Backtests', 'Dashboard'].map(label=><button type="button" key={label} aria-pressed={view===label} onClick={()=>setView(label)}>{label}</button>)}</div>
    {view === 'Backtests' ? <div className="fifa-backtests">
      <div className="graphic-heading"><span>REPOSITORY BACKTESTS</span><span>Brier score / lower is better</span></div>
      <div className="fifa-backtest-grid">{backtests.map(test=><div key={test.year} className="fifa-backtest"><h4>{test.year}<span>64 matches</span></h4><dl>{[['Dixon-Coles', test.model, true], ['Historical baseline', test.climate, false], ['Uniform baseline', test.uniform, false]].map(([label,value,model])=><div className="fifa-score-row" key={label}><dt>{label}</dt><dd>{value.toFixed(3)}</dd><div className={`fifa-bar-rail ${model ? 'fifa-model-bar' : ''}`} aria-hidden="true"><i style={{width:`${value/.75*100}%`}}/></div></div>)}</dl></div>)}</div>
      <p className="visual-footnote">Training uses matches before each tournament. Values come from the saved repository report.</p><a className="fifa-report-link" href={report} target="_blank" rel="noopener noreferrer">Inspect the backtest report ↗</a>
    </div> : <figure className="project-capture"><button type="button" className="capture-button" onClick={()=>dialog.current.showModal()} aria-label="Enlarge World Cup dashboard screenshot"><img src={dashboardImage} width="1896" height="874" loading="lazy" decoding="async" alt="Saved World Cup Title Race dashboard screenshot from the project repository"/><span className="capture-enlarge">View full screenshot ↗</span></button><figcaption>Saved dashboard screenshot from the project repository. Final-state odds reflect observed outcomes.</figcaption></figure>}
    <dialog ref={dialog} className="screenshot-dialog" aria-label="World Cup dashboard screenshot" onClick={event=>{if(event.target===event.currentTarget)dialog.current.close();}}><div><h4>World Cup Forecasting & Simulation</h4><button type="button" onClick={()=>dialog.current.close()} autoFocus aria-label="Close FIFA screenshot">Close ✕</button></div><img src={dashboardImage} width="1896" height="874" loading="lazy" alt="Saved World Cup Title Race dashboard screenshot"/><p>Repository dashboard capture. Final-state odds reflect observed outcomes.</p></dialog>
  </div>;
}

export default function FifaProject({ project }) {
  const move = event => {
    if (event.pointerType === 'touch' || window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.dataset.motion === 'paused') return;
    const r = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--art-x',`${((event.clientX-r.left)/r.width-.5)*9}deg`);
    event.currentTarget.style.setProperty('--art-y',`${((event.clientY-r.top)/r.height-.5)*-9}deg`);
  };
  return <article id="project-fifa-wc2026-predictor" className="project-panel fifa-project" style={{'--project-accent':'#b2a4ff'}} aria-labelledby="fifa-project-title">
    <header className="project-art-cover cover-fifa" onPointerMove={move} onPointerLeave={event=>{event.currentTarget.style.setProperty('--art-x','0deg');event.currentTarget.style.setProperty('--art-y','0deg');}}><div className="cover-editorial"><span className="cover-number">/ 04</span><p>The field.<br/><em>In probability.</em></p><h3 id="fifa-project-title">{project.title}</h3></div><div className="cover-art"><FootballArtwork/></div><div className="cover-bottom"><span>Sports forecasting / Statistical modeling</span><span>Original conceptual artwork</span></div></header>
    <div className="project-overview"><p className="eyebrow"><span>04</span> / Behind the forecast</p><p className="project-summary">{project.description}</p><ul className="tech-tags" aria-label="Technologies">{project.techTags.map(tag=><li key={tag}>{tag}</li>)}</ul>
      <div className="evidence-summary"><p className="verification-label"><span/>Repository backtests</p><dl className="evidence-metrics"><div><dt>2018 Brier score</dt><dd>0.566</dd></div><div><dt>2022 Brier score</dt><dd>0.614</dd></div></dl><p>64 matches in each report. Lower is better; compare against historical and uniform baselines in the Model Lab.</p><a href={report} target="_blank" rel="noopener noreferrer">View source results ↗</a></div>
      <p className="fifa-cutoff">Forecast frozen June 12, 2026, after opening day.</p><div className="project-links"><a href={project.links.github} target="_blank" rel="noopener noreferrer">View code ↗</a><a className="demo-link" href={project.links.demo} target="_blank" rel="noopener noreferrer">Open dashboard ↗</a></div>
    </div>
    <ForecastEvidence/>
    <details className="case-study"><summary><span>Inside the project</span><span className="case-hint">Problem / decisions / limitations</span><span className="case-plus" aria-hidden="true">+</span></summary><div className="case-body">
      <div><h4>01 / The problem</h4><p>Football outcomes are uncertain. Build a forecast that expresses that uncertainty, simulates the tournament bracket, and can be evaluated against real match results.</p></div>
      <div><h4>02 / Design decisions</h4><p>Use Elo as a reference, a Dixon-Coles goal model for match probabilities, and Monte Carlo simulation for tournament progression. Explore posterior uncertainty with a separate Bayesian model. Evaluate earlier tournaments with chronological training cutoffs.</p></div>
      <div><h4>03 / What to know</h4><p>The June 12 snapshot came after the June 11 opening day. It is an opening-tournament forecast, not a pre-tournament prediction. The models omit injuries and lineups, simplify shootouts, and have reported calibration weaknesses. The Bayesian comparison also uses a different training window.</p></div>
    </div></details>
  </article>;
}
