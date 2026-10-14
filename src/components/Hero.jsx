import { lazy, Suspense, useState } from 'react';
import { heroContent } from '../data/portfolioData';
const HeroBackground = lazy(() => import('./HeroBackground'));
const formations = [
  { name: 'Iris', caption: 'Many perspectives. One connected system.', word: '01 / Signal iris' },
  { name: 'Orbit', caption: 'Look closer. Change your perspective.', word: '02 / Orbital assembly' },
  { name: 'Network', caption: 'Every connection changes the whole.', word: '03 / Neural constellation' },
];
export default function Hero() {
  const [formation, setFormation] = useState(0);
  const [energy, setEnergy] = useState(.4);
  const [burst, setBurst] = useState(0);
  return <section id="home" className="signal-hero observatory-hero">
    <div className="signal-grid" aria-hidden="true"/>
    <div className="signal-masthead"><span><i/>A portfolio by Mayur Patil</span><span>Data science / ML engineering</span><span>Washington, DC</span></div>
    <div className="signal-composition">
      <div className="signal-editorial">
        <p className="signal-kicker">Curiosity, made tangible.</p>
        <h1><span>Mayur</span><br/><em>Patil</em><span className="signal-period">.</span></h1>
        <div className="signal-intro"><span className="editorial-cross" aria-hidden="true">↳</span><div><p>I find the signal.<br/>Then build what comes next.</p><span>Data scientist & ML engineer<br/>M.S. Data Science / George Washington University</span></div></div>
        <div className="signal-actions"><a href="#projects" className="signal-cta">Explore selected work <span>↗</span></a><a href={heroContent.ctaResume.href} download>Résumé <span>↓</span></a></div>
      </div>
      <div className="signal-artwork">
        <div className="artwork-coordinate"><span>THE SIGNAL OBSERVATORY</span><span>INTERACTIVE STUDY / 2026</span></div>
        <div className="signal-render"><div className="field-fallback" aria-hidden="true"><i/><i/><i/><span>✳</span></div><Suspense fallback={null}><HeroBackground formation={formation} energy={energy} burst={burst}/></Suspense><span className="observatory-axis axis-north" aria-hidden="true">N / 00</span><span className="observatory-axis axis-south" aria-hidden="true">S / 180</span></div>
        <div className="artwork-caption"><span className="field-marker" aria-hidden="true">◉</span><span>{formations[formation].word}</span><span className="artwork-hint">Drag to orbit</span></div>
      </div>
    </div>
    <div className="field-console">
      <div className="console-label"><span className="console-beacon"/>Change the perspective<small>Three studies of connection</small></div>
      <div className="formation-controls" role="group" aria-label="Choose sculpture formation">{formations.map((item,i)=><button key={item.name} type="button" aria-label={item.name} aria-pressed={formation===i} onClick={()=>setFormation(i)}><span>0{i+1}</span>{item.name}</button>)}</div>
      <label className="energy-control">Motion <input aria-label="Energy" type="range" min="0" max="1" step=".05" value={energy} onChange={event=>setEnergy(Number(event.target.value))}/><output>{Math.round(energy*100)}%</output></label>
      <button className="disturb-button" type="button" onClick={()=>setBurst(burst+1)}>Expand the system <span aria-hidden="true">↗</span></button>
    </div>
    <div className="signal-footnote"><p aria-live="polite">{formations[formation].caption}</p><span>Original generative sculpture / conceptual artwork</span><a href="#projects">Discover the work ↓</a></div>
  </section>;
}
