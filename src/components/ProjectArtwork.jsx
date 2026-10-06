const titles = { 'anomaly-detection': ['Traffic.', 'Under scrutiny.'], 'clinical-lab-predictor': ['Predictions.', 'In perspective.'], 'signal-ai': ['Conversations.', 'Connected.'] };

function Artwork({ id }) {
  if(id === 'anomaly-detection') return <svg viewBox="0 0 600 360" role="img" aria-label="Abstract artwork of traffic moving through an anomaly detector">
    <g className="art-traffic-grid">{Array.from({length:13},(_,i)=><path key={i} d={`M${80+i*32} 55L${20+i*32} 305 M60 ${55+i*20}H520`} fill="none" stroke="currentColor" strokeOpacity=".1"/>)}</g>
    {Array.from({length:10},(_,i)=><path key={i} className="art-traffic-line" style={{'--line':i}} d={`M30 ${100+i*16}C155 ${100+i*16},165 ${280-i*15},290 180S420 ${70+i*21},580 ${90+i*19}`} fill="none" stroke="currentColor" strokeWidth={i===4?'3':'1'} opacity={i===4?'.9':'.25'}/>)}
    <g className="art-detector"><path d="M230 104L350 88L386 225L266 241Z" fill="#0a172c"/><path d="M245 116L339 104L368 213L274 225Z" fill="none" stroke="#a6d6ff" strokeOpacity=".5"/><circle cx="308" cy="164" r="24" fill="none" stroke="#a6d6ff"/><path d="M298 164h20m-10-10v20" stroke="#a6d6ff"/></g>
    <circle className="art-alert" cx="474" cy="128" r="10" fill="currentColor"/><path d="M474 145v35h55" fill="none" stroke="currentColor" strokeOpacity=".5"/><text x="496" y="184">INSPECT</text>
  </svg>;
  if(id === 'clinical-lab-predictor') return <svg viewBox="0 0 600 360" role="img" aria-label="Abstract artwork of a model with multiple layers of evaluation">
    <g className="art-clinical-orbits">{[0,1,2,3,4].map(i=><ellipse key={i} cx="305" cy="180" rx={85+i*28} ry={25+i*16} transform={`rotate(${i*32} 305 180)`} fill="none" stroke="currentColor" strokeOpacity={i===2?'.7':'.22'}/>)}</g>
    <g className="art-clinical-core"><path d="M305 87L386 133V225L305 272L224 225V133Z" fill="#081c28"/><path d="M305 110L365 145V213L305 248L245 213V145Z M245 145L305 180L365 145 M305 180V248" fill="none" stroke="#9ce6ef" strokeOpacity=".6"/><path d="M272 180h23l11-27 15 51 9-24h17" fill="none" stroke="#9ce6ef" strokeWidth="3"/></g>
    {[ [100,180],[473,122],[420,276] ].map(([x,y],i)=><g key={i}><circle cx={x} cy={y} r="5" fill="currentColor"/><path d={`M${x} ${y}L305 180`} fill="none" stroke="currentColor" strokeOpacity=".2"/></g>)}
    <text x="440" y="302">EVALUATE</text>
  </svg>;
  return <svg viewBox="0 0 600 360" role="img" aria-label="Abstract artwork connecting five specialized transcript-analysis agents">
    <path d="M85 182Q305-40 515 182Q305 400 85 182Z" fill="none" stroke="currentColor" strokeOpacity=".3"/>
    <g className="art-signal-links">{[0,1,2,3,4].map(i=>{const a=i*Math.PI*2/5-.3,x=305+150*Math.cos(a),y=180+115*Math.sin(a);return <g key={i}><path d={`M305 180L${x} ${y}`} stroke="currentColor" strokeOpacity=".4"/><circle cx={x} cy={y} r="24" fill="#100e29"/><text x={x} y={y+5} textAnchor="middle" fill="#d6ccff">0{i+1}</text></g>;})}</g>
    <g className="art-signal-center"><rect x="269" y="130" width="72" height="100" rx="8" fill="#100e29"/><path d="M284 150h42m-42 16h42m-42 16h42m-42 16h30m-30 16h35" stroke="#d6ccff" strokeOpacity=".7"/></g>
    <text x="420" y="325">SYNTHESIZE</text>
  </svg>;
}

export default function ProjectArtwork({ project }) {
  const words=titles[project.id];
  const move=event=>{
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.dataset.motion==='paused' || event.pointerType==='touch') return;
    const r=event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--art-x',`${((event.clientX-r.left)/r.width-.5)*9}deg`);
    event.currentTarget.style.setProperty('--art-y',`${((event.clientY-r.top)/r.height-.5)*-9}deg`);
  };
  return <header className={`project-art-cover cover-${project.id}`} onPointerMove={move} onPointerLeave={event=>{event.currentTarget.style.setProperty('--art-x','0deg');event.currentTarget.style.setProperty('--art-y','0deg');}}>
    <div className="cover-editorial"><span className="cover-number">/{project.number}</span><p>{words[0]}<br/><em>{words[1]}</em></p><h3 id={`${project.id}-title`}>{project.title}</h3></div>
    <div className="cover-art"><Artwork id={project.id}/></div>
    <div className="cover-bottom"><span>{project.category}</span><span>Original conceptual artwork</span><span aria-hidden="true">↗</span></div>
  </header>;
}
