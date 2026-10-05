import { useEffect, useState } from 'react';

const chapters = [
  { name: 'Prepare', title: 'Give the data a foundation.', color: '#ff9a8c', label: 'Events become features', detail: 'Validate inputs, handle missing values, and shape raw observations into features. Fit preprocessing on training data to keep evaluation honest.', tags: ['Validation', 'Feature engineering', 'Train / test split'] },
  { name: 'Learn', title: 'Find structure in the noise.', color: '#b5a4fa', label: 'Features become a model', detail: 'Establish a baseline, compare approaches, and inspect failure cases. Model complexity should earn its place through held-out evidence.', tags: ['Baseline', 'Model comparison', 'Error analysis'] },
  { name: 'Evaluate', title: 'Make the uncertainty visible.', color: '#89d8c4', label: 'Predictions meet evidence', detail: 'Inspect thresholds, class-level errors, and uncertainty together. A single headline score cannot describe every tradeoff or population.', tags: ['ROC curve', 'Confusion matrix', 'Uncertainty'] },
  { name: 'Deliver', title: 'Build beyond the notebook.', color: '#8dbfff', label: 'A model becomes a system', detail: 'Package the model with its preprocessing, expose a usable interface, and record what version produced each prediction. Monitor what changes after release.', tags: ['API contract', 'Versioning', 'Monitoring'] },
];

export function MotionControl() {
  const [paused, setPaused] = useState(() => {
    try { return localStorage.getItem('portfolio-motion') === 'paused'; } catch { return false; }
  });
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.motion = paused || reduced ? 'paused' : 'running';
    window.dispatchEvent(new Event('portfolio-motion-change'));
    try { localStorage.setItem('portfolio-motion', paused ? 'paused' : 'running'); } catch { /* Storage is optional. */ }
  }, [paused, reduced]);
  useEffect(() => {
    const targets = document.querySelectorAll('.system-explorer, .visual-studio, .project-visual');
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      entry.target.classList.toggle('visual-in-view', entry.isIntersecting);
    }), { rootMargin: '40px' });
    targets.forEach(target => observer.observe(target));
    return () => observer.disconnect();
  }, []);
  return <button className="motion-control" type="button" aria-pressed={paused || reduced} disabled={reduced} onClick={() => setPaused(!paused)} aria-label={reduced ? 'Motion reduced by device preference' : paused ? 'Resume animation' : 'Pause animation'}><span aria-hidden="true">{paused || reduced ? '▷' : 'Ⅱ'}</span>{reduced ? 'Reduced motion' : paused ? 'Resume motion' : 'Pause motion'}</button>;
}

export default function VisualExperience() {
  const [chapter, setChapter] = useState(0);
  const current = chapters[chapter];
  return <section className="visual-studio" aria-labelledby="studio-title" style={{ '--studio-accent': current.color }}>
    <div className="section-shell">
      <div className="studio-header"><p className="eyebrow">The thinking behind the work</p><span>Interactive field notes / 01 to 04</span></div>
      <h2 id="studio-title">A model is only<br/><span>part of the story.</span></h2>
      <div className="studio-layout">
        <div className="studio-scene" aria-hidden="true">
          <div className="studio-halo"/>
          <svg className={`studio-svg chapter-${chapter}`} viewBox="0 0 620 490">
            <defs>
              <linearGradient id="plane-fill" x1="0" y1="0" x2="1" y2="1"><stop stopColor="currentColor" stopOpacity=".2"/><stop offset="1" stopColor="#101725" stopOpacity=".8"/></linearGradient>
              <radialGradient id="studio-core"><stop stopColor="currentColor" stopOpacity=".55"/><stop offset="1" stopColor="currentColor" stopOpacity="0"/></radialGradient>
            </defs>
            <ellipse cx="310" cy="400" rx="250" ry="65" fill="url(#studio-core)" opacity=".3"/>
            <g className="studio-floor"><path d="M40 350L310 195L580 350L310 465Z" fill="none" stroke="currentColor" strokeOpacity=".13"/>{[0,1,2,3,4,5].map(i => <path key={i} d={`M${85+i*45} ${376+i*15}L${355+i*45} ${221+i*26} M${85+i*45} ${324-i*26}L${355+i*45} ${439-i*26}`} stroke="currentColor" strokeOpacity=".08"/>)}</g>
            {[2,1,0].map(layer => <g key={layer} className={`studio-plane plane-${layer}`} style={{ '--plane': layer }}>
              <path d={`M90 ${180+layer*80}L310 ${65+layer*80}L530 ${180+layer*80}L310 ${295+layer*80}Z`} fill="url(#plane-fill)" stroke="currentColor" strokeOpacity=".4"/>
              <path d={`M90 ${180+layer*80}V${192+layer*80}L310 ${307+layer*80}L530 ${192+layer*80}V${180+layer*80}L310 ${295+layer*80}Z`} fill="#0b1320" stroke="currentColor" strokeOpacity=".2"/>
              {Array.from({length: 16}, (_, i) => {
                const row = Math.floor(i/4), col = i%4, x = 178 + col*44 + row*44, y = 176 + layer*80 + row*23-col*23;
                return <g key={i}><circle className="studio-point" cx={x} cy={y} r={chapter === 1 && layer === 1 ? 6 : 3} fill="currentColor" style={{ '--point': i }}/>{chapter === 0 && layer === 2 && <path d={`M${x-7} ${y-6}v-12l14-7v12z`} fill="currentColor" opacity=".22"/>}</g>;
              })}
              {layer === 0 && <><path className="studio-orbit" d="M205 180Q310 70 415 180Q310 290 205 180Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 8"/><circle cx="310" cy="180" r="57" fill="url(#studio-core)"/><path d={chapter === 3 ? 'M291 180l13 13 27-29' : chapter === 2 ? 'M287 190v-20m15 30v-42m16 28v-26m15 39v-48' : 'M286 180l24-24 24 24-24 24Z'} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></>}
            </g>)}
            <path className="studio-transfer" d="M310 390V285M310 240V180" stroke="currentColor" strokeWidth="2" strokeDasharray="5 12"/>
          </svg>
          <div className="scene-caption"><span className="scene-cross">+</span><span>{current.label}</span><span>0{chapter + 1}</span></div>
        </div>
        <div className="studio-narrative">
          <div className="chapter-tabs" role="group" aria-label="Explore the ML lifecycle">{chapters.map((item,i) => <button type="button" key={item.name} aria-pressed={i === chapter} onClick={() => setChapter(i)}><span>0{i+1}</span>{item.name}</button>)}</div>
          <div className="chapter-copy" key={chapter} aria-live="polite"><p className="eyebrow">0{chapter+1} / {current.name}</p><h3>{current.title}</h3><p>{current.detail}</p><ul>{current.tags.map(tag => <li key={tag}>{tag}</li>)}</ul></div>
          <div className="studio-bottom"><p>Conceptual illustration.<br/>Measured results are in the projects above.</p><button type="button" onClick={() => setChapter((chapter+1)%chapters.length)} aria-label="Explore next lifecycle stage">Next chapter <span aria-hidden="true">↗</span></button></div>
        </div>
      </div>
    </div>
  </section>;
}
