import { useEffect, useRef } from 'react';

export default function SignalTransition() {
  const ref=useRef(null);
  useEffect(()=>{
    const node=ref.current;
    let pending=false,frame=0;
    const update=()=>{
      pending=false;
      const r=node.getBoundingClientRect(),p=Math.max(0,Math.min(1,(innerHeight-r.top)/(innerHeight+r.height)));
      node.style.setProperty('--transit',p);
    };
    const scroll=()=>{if(!pending){pending=true;frame=requestAnimationFrame(update);}};
    window.addEventListener('scroll',scroll,{passive:true});window.addEventListener('resize',scroll);update();
    return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',scroll);window.removeEventListener('resize',scroll);};
  },[]);
  return <section ref={ref} className="signal-transition" aria-label="From exploration to evidence">
    <div className="transition-stripe" aria-hidden="true"><span>DATA / MODELS / SYSTEMS / CURIOSITY / </span><span>DATA / MODELS / SYSTEMS / CURIOSITY / </span></div>
    <div className="transition-statement"><span className="transition-index">[ FROM EXPLORATION ]</span><p>Less noise.<br/><em>More meaning.</em></p><span className="transition-end">[ TO EVIDENCE ] ↘</span></div>
  </section>;
}
