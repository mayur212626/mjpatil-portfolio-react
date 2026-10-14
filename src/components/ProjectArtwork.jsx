const titles = { 'anomaly-detection': ['Traffic.', 'Under scrutiny.'], 'clinical-lab-predictor': ['Predictions.', 'In perspective.'], 'signal-ai': ['Conversations.', 'Connected.'] };
function Artwork({ id }) {
  const suffix = id.replaceAll('-', ''), metal = `url(#metal-${suffix})`, edge = `url(#edge-${suffix})`, shadow = `url(#shadow-${suffix})`;
  return <svg viewBox="0 0 600 360" role="img" aria-label={id === 'anomaly-detection' ? 'Original layered sculpture representing a traffic inspection system' : id === 'clinical-lab-predictor' ? 'Original orbital sculpture representing layers of model evaluation' : 'Original five-part sculpture representing a connected agent workflow'}>
    <defs>
      <linearGradient id={`metal-${suffix}`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#faf9f7"/><stop offset=".28" stopColor="#a49baa"/><stop offset=".49" stopColor="#f3f0f6"/><stop offset=".61" stopColor="#696071"/><stop offset="1" stopColor="#b3a7bf"/></linearGradient>
      <linearGradient id={`edge-${suffix}`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#b4a7bd"/><stop offset="1" stopColor="#322b3c"/></linearGradient>
      <radialGradient id={`shadow-${suffix}`}><stop stopColor="#34293f" stopOpacity=".22"/><stop offset="1" stopColor="#34293f" stopOpacity="0"/></radialGradient>
    </defs>
    <ellipse cx="305" cy="302" rx="215" ry="32" fill={shadow}/>
    <g opacity=".15" fill="none" stroke="currentColor"><path d="M50 300H555M305 30V325" strokeDasharray="3 8"/><ellipse cx="305" cy="270" rx="245" ry="50"/></g>
    {id === 'anomaly-detection' ? <>
      {[2,1,0].map(layer => <g key={layer} className="art-data-plane" style={{'--layer':layer}} transform={`translate(0 ${layer*34})`}>
        <path d="M135 110L310 40L483 110V133L310 203L135 133Z" fill={edge}/><path d="M135 110L310 40L483 110L310 180Z" fill={metal} stroke="#eee9f2" strokeWidth=".7"/>
        <path d="M172 111L310 57L445 111L310 164Z" fill="none" stroke="#594966" strokeOpacity=".5"/>
        <path d="M198 110L310 66L419 110L310 153Z" fill="#332b3b"/><path d="M225 110L310 78L392 110L310 141Z" fill="#c2a8df"/>
        <path d="M310 91L349 107L310 124L272 107Z" fill="#f0e7f8"/>
      </g>)}
      {[0,1,2,3,4].map(i=><path key={i} className="art-traffic-line" style={{'--line':i}} d={`M30 ${142+i*17}L115 ${172+i*12}L225 ${137+i*12} M395 ${145+i*12}L487 ${185+i*12}L575 ${149+i*17}`} fill="none" stroke="#6b507e" strokeWidth="1.5" opacity=".55"/>)}
      <circle className="art-alert" cx="548" cy="150" r="6" fill="#6b507e"/>
    </> : id === 'clinical-lab-predictor' ? <>
      <g className="art-clinical-orbits" fill="none">{[0,1,2,3].map(i=><ellipse key={i} cx="305" cy="164" rx={145+i*11} ry={65+i*8} transform={`rotate(${i*43} 305 164)`} stroke={i===1?'#80639d':metal} strokeWidth={i===1?7:11}/>)} </g>
      <g className="art-clinical-core"><path d="M305 95L368 134V208L305 247L242 208V134Z" fill={edge}/><path d="M305 95L368 134L305 172L242 134Z" fill={metal}/><path d="M305 172L368 134V208L305 247Z" fill="#7f6b94"/><path d="M305 172L242 134V208L305 247Z" fill="#42354f"/><path d="M258 162v30l32 18" fill="none" stroke="#d6c3e7" strokeWidth="2"/></g>
      <circle cx="467" cy="188" r="9" fill={metal}/><circle cx="152" cy="110" r="7" fill="#80639d"/>
    </> : <>
      <g className="art-signal-links">{[0,1,2,3,4].map(i=>{const a=i*Math.PI*2/5-.8,x=305+158*Math.cos(a),y=171+97*Math.sin(a);return <g key={i}>
        <path d={`M305 171L${x} ${y}`} fill="none" stroke="#7d6694" strokeWidth="2" strokeDasharray="4 7"/>
        <g transform={`translate(${x-32} ${y-20})`}><path d="M0 8L32-8L65 8V45L32 61L0 45Z" fill={edge}/><path d="M0 8L32-8L65 8L32 25Z" fill={metal}/><path d="M32 25L65 8V45L32 61Z" fill="#8d789f"/><text x="16" y="37" fill="#f0e7f8" fontSize="9">0{i+1}</text></g>
      </g>;})}</g>
      <g className="art-signal-center"><path d="M263 150L305 130L347 150V195L305 218L263 195Z" fill={edge}/><path d="M263 150L305 130L347 150L305 173Z" fill={metal}/><path d="M305 173V218L347 195V150Z" fill="#ad91c6"/></g>
    </>}
  </svg>;
}
export default function ProjectArtwork({ project }) {
  const words = titles[project.id];
  const move = event => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.dataset.motion === 'paused' || event.pointerType === 'touch') return;
    const r = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--art-x', `${((event.clientX-r.left)/r.width-.5)*9}deg`);
    event.currentTarget.style.setProperty('--art-y', `${((event.clientY-r.top)/r.height-.5)*-9}deg`);
  };
  return <header className={`project-art-cover cover-${project.id}`} onPointerMove={move} onPointerLeave={event=>{event.currentTarget.style.setProperty('--art-x','0deg');event.currentTarget.style.setProperty('--art-y','0deg');}}>
    <div className="cover-editorial"><span className="cover-number">/ {project.number}</span><p>{words[0]}<br/><em>{words[1]}</em></p><h3 id={`${project.id}-title`}>{project.title}</h3></div>
    <div className="cover-art"><Artwork id={project.id}/></div>
    <div className="cover-bottom"><span>{project.id === 'anomaly-detection' ? 'Data engineering / Anomaly detection' : project.id === 'clinical-lab-predictor' ? 'Applied ML / Research prototype' : 'Language models / In development'}</span><span>Original conceptual artwork</span></div>
  </header>;
}
