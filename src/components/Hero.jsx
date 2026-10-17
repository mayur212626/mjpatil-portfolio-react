import { lazy, Suspense, useState } from 'react';
import { heroContent } from '../data/portfolioData';
const HeroBackground = lazy(() => import('./HeroBackground'));
const formations = [
  { name: 'Iris', caption: 'Many perspectives. One connected system.', word: '01 / Signal iris' },
  { name: 'Orbit', caption: 'Look closer. Change your perspective.', word: '02 / Orbital assembly' },
  { name: 'Network', caption: 'Every connection changes the whole.', word: '03 / Neural constellation' },
];
function HeroPoster({ formation, energy }) {
  return <svg style={{ '--poster-duration': `${14 - energy * 10}s` }} className="hero-poster" viewBox="0 0 600 500" role="img" aria-label={`${formations[formation].name} sculpture illustration. Interactive 3D is optional.`}>
    <defs><linearGradient id="poster-metal" x1="0" y1="0" x2="1" y2=".6"><stop stopColor="#fff"/><stop offset=".3" stopColor="#dddce3"/><stop offset=".55" stopColor="#66616f"/><stop offset=".75" stopColor="#fff"/><stop offset="1" stopColor="#a6a0b1"/></linearGradient><linearGradient id="poster-violet"><stop stopColor="#ded4f2"/><stop offset=".55" stopColor="#8b72b3"/><stop offset="1" stopColor="#51445f"/></linearGradient><radialGradient id="poster-core"><stop stopColor="#67606f"/><stop offset="1" stopColor="#25212d"/></radialGradient></defs>
    <g fill="none" stroke="#695186" strokeOpacity=".2"><ellipse cx="300" cy="437" rx="196" ry="30"/><ellipse cx="300" cy="437" rx="209" ry="35"/></g>
    <g transform="translate(0 -12)"><g className="poster-sculpture">
      <circle cx="300" cy="240" r="93" fill="url(#poster-core)"/>
      {formation===0 && Array.from({length:24},(_,i)=><path key={i} d="M300 92C436 113 469 257 373 382C412 248 361 153 300 92Z" transform={`rotate(${i*15} 300 240)`} fill={i%6===0?'url(#poster-violet)':'url(#poster-metal)'} stroke="#eeede8" strokeWidth=".5"/>)}
      {formation===1 && Array.from({length:5},(_,i)=><ellipse key={i} cx="300" cy="240" rx="159" ry="64" transform={`rotate(${i*37} 300 240)`} fill="none" stroke={i===2?'url(#poster-violet)':'url(#poster-metal)'} strokeWidth="13"/>)}
      {formation===2 && <g>{Array.from({length:24},(_,i)=>{const angle=i*Math.PI*2/24,x=300+Math.cos(angle)*151,y=240+Math.sin(angle)*151;return <g key={i}><path d={`M${x} ${y}L300 240L${300+Math.cos(angle+Math.PI/3)*151} ${240+Math.sin(angle+Math.PI/3)*151}`} fill="none" stroke="#89729d" strokeOpacity=".45"/><circle cx={x} cy={y} r="7" fill={i%6===0?'url(#poster-violet)':'url(#poster-metal)'}/></g>})}</g>}
    </g></g>
  </svg>;
}
export default function Hero() {
  const [interactive, setInteractive] = useState(false);
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
        <div className="signal-render"><HeroPoster formation={formation} energy={energy}/>{interactive && <Suspense fallback={null}><HeroBackground formation={formation} energy={energy} burst={burst}/></Suspense>}<span className="observatory-axis axis-north" aria-hidden="true">N / 00</span><span className="observatory-axis axis-south" aria-hidden="true">S / 180</span></div>
        <div className="artwork-caption"><span className="field-marker" aria-hidden="true">◉</span><span>{formations[formation].word}</span><button className="sculpture-mode" type="button" aria-pressed={interactive} onClick={() => setInteractive(!interactive)}>{interactive ? 'Use lightweight view' : 'Enable interactive 3D'}</button></div>
      </div>
    </div>
    <div className="field-console">
      <div className="console-label"><span className="console-beacon"/>Change the perspective<small>Three studies of connection</small></div>
      <div className="formation-controls" role="group" aria-label="Choose sculpture formation">{formations.map((item,i)=><button key={item.name} type="button" aria-label={item.name} aria-pressed={formation===i} onClick={()=>setFormation(i)}><span>0{i+1}</span>{item.name}</button>)}</div>
      <label className="energy-control">Motion <input aria-label="Energy" type="range" min="0" max="1" step=".05" value={energy} onChange={event=>setEnergy(Number(event.target.value))}/><output>{Math.round(energy*100)}%</output></label>
      <button className="disturb-button" type="button" onClick={()=>{setInteractive(true);setBurst(burst+1);}}>{interactive ? 'Expand the system' : 'Explore in 3D'} <span aria-hidden="true">↗</span></button>
    </div>
    <div className="signal-footnote"><p aria-live="polite">{formations[formation].caption}</p><span>Original generative sculpture / conceptual artwork</span><a href="#projects">Discover the work ↓</a></div>
  </section>;
}
