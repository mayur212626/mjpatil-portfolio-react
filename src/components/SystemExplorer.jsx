import { useState } from 'react';
import { projectStories } from '../data/projectStories';
const systems = Object.entries(projectStories);
export default function SystemExplorer() {
  const [systemId, setSystemId] = useState(systems[0][0]);
  const [stage, setStage] = useState(0);
  const system = projectStories[systemId];
  return <aside className="system-explorer" aria-label="Interactive project architecture" style={{ '--system-accent': system.accent }}>
    <div className="explorer-bar"><span className="explorer-dot" /><span>Architecture explorer</span><span className="explorer-version">{String(stage + 1).padStart(2, '0')} / 03</span></div>
    <div className="system-switch" role="group" aria-label="Choose a project architecture">{systems.map(([id, item]) => <button key={id} type="button" aria-pressed={id === systemId} onClick={() => { setSystemId(id); setStage(0); }}>{item.short}</button>)}</div>
    <div className="system-map">
      <svg viewBox="0 0 400 220" aria-hidden="true" className="constellation">
        <defs><radialGradient id="core-glow"><stop offset="0%" stopColor="currentColor" stopOpacity=".16"/><stop offset="100%" stopColor="currentColor" stopOpacity="0"/></radialGradient></defs>
        <circle cx="200" cy="110" r="108" fill="url(#core-glow)" />
        <ellipse cx="200" cy="110" rx="152" ry="78" fill="none" stroke="currentColor" strokeOpacity=".16" />
        <ellipse cx="200" cy="110" rx="108" ry="104" fill="none" stroke="currentColor" strokeOpacity=".1" transform="rotate(35 200 110)" />
        <path className="data-path" d="M62 134 Q102 60 200 56 T338 144" fill="none" stroke="currentColor" strokeWidth="1.3" />
        <path d="M62 134 Q180 224 338 144 M200 56 L200 174 M100 50 L200 174 L304 46 M100 50 L304 46" fill="none" stroke="currentColor" strokeOpacity=".16" />
        {[[100,50],[200,174],[304,46],[128,174],[272,178],[60,88],[346,92]].map(([x,y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="3" fill="currentColor" opacity=".45" />)}
      </svg>
      {system.stages.map((item, i) => <button key={item.name} className={`system-node node-${i} ${i === stage ? 'is-active' : ''}`} aria-pressed={i === stage} aria-label={`Inspect ${item.name} stage`} onClick={() => setStage(i)}><span className="node-symbol" aria-hidden="true">{['◈', '✳', '↗'][i]}</span><span>{item.name}</span></button>)}
    </div>
    <div className="stage-readout" aria-live="polite"><p className="eyebrow">{String(stage + 1).padStart(2, '0')} / {system.stages[stage].tool}</p><h2>{system.question}</h2><p>{system.stages[stage].text}</p></div>
    <div className="explorer-footer"><span>Select a node to explore</span><button type="button" onClick={() => setStage((stage + 1) % system.stages.length)} aria-label="Inspect next architecture stage">Next stage →</button></div>
  </aside>;
}
