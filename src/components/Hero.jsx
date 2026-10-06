import { lazy, Suspense, useState } from 'react';
import { heroContent } from '../data/portfolioData';
const HeroBackground = lazy(() => import('./HeroBackground'));
const formations = [
  { name: 'Flow', caption: 'A thousand possibilities. One starting point.', word: 'Explore the noise.' },
  { name: 'Structure', caption: 'Find the relationships hiding in plain sight.', word: 'Find the pattern.' },
  { name: 'Network', caption: 'Connect the pieces. Build something useful.', word: 'Make connections.' },
];
export default function Hero() {
  const [formation, setFormation] = useState(1);
  const [energy, setEnergy] = useState(.5);
  const [burst, setBurst] = useState(0);
  return <section id="home" className="signal-hero">
    <div className="signal-grid" aria-hidden="true"/>
    <div className="signal-masthead"><span><i/>Mayur Patil</span><span>Data scientist & ML engineer</span><span>Washington, DC</span></div>
    <div className="signal-composition">
      <div className="signal-editorial">
        <p className="signal-kicker"><span>Independent thinking.</span> Engineered outcomes.</p>
        <h1>Making<br/><em>sense</em><br/>of signal<span className="signal-period">.</span></h1>
        <div className="signal-intro"><span className="editorial-cross" aria-hidden="true">↳</span><div><p>I turn complex data into models, tools, and systems people can use.</p><span>M.S. Data Science / George Washington University</span></div></div>
        <div className="signal-actions"><a href="#projects" className="signal-cta">Enter the work <span>↗</span></a><a href={heroContent.ctaResume.href} download>Résumé <span>↓</span></a></div>
      </div>
      <div className="signal-artwork">
        <div className="artwork-coordinate"><span>FIG. 0{formation+1}</span><span>THE LATENT FIELD</span></div>
        <div className="signal-render"><div className="field-fallback" aria-hidden="true"><i/><i/><i/><span>+</span></div><Suspense fallback={null}><HeroBackground formation={formation} energy={energy} burst={burst}/></Suspense></div>
        <div className="artwork-caption"><span className="field-marker" aria-hidden="true">⊕</span><span>{formations[formation].word}</span><span className="artwork-hint">Move to orbit / drag to rotate</span></div>
      </div>
    </div>
    <div className="field-console">
      <div className="console-label"><span className="console-beacon"/>Interactive sculpture<small>Play with the field</small></div>
      <div className="formation-controls" role="group" aria-label="Choose sculpture formation">{formations.map((item,i)=><button key={item.name} type="button" aria-label={item.name} aria-pressed={formation===i} onClick={()=>setFormation(i)}><span>0{i+1}</span>{item.name}</button>)}</div>
      <label className="energy-control">Energy <input aria-label="Energy" type="range" min="0" max="1" step=".05" value={energy} onChange={event=>setEnergy(Number(event.target.value))}/><output>{Math.round(energy*100)}%</output></label>
      <button className="disturb-button" type="button" onClick={()=>setBurst(burst+1)}>Disturb the field <span aria-hidden="true">↗</span></button>
    </div>
    <div className="signal-footnote"><p aria-live="polite">{formations[formation].caption}</p><span>Generative artwork / an abstract exploration of data</span><a href="#projects">Scroll to discover ↓</a></div>
  </section>;
}
