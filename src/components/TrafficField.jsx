import { useEffect, useRef } from 'react';

// A deterministic illustration of feature space, not individually scored requests.
const groups = ['Normal traffic', 'DoS flood', 'Admin recon'];
const seeds = [[-.8, -.45, -.25], [.95, .8, -.3], [.15, .55, .85]];
const fraction = n => { const value = Math.sin(n * 127.1 + 311.7) * 43758.5453; return value - Math.floor(value); };

export default function TrafficField({ scenario, result, status }) {
  const canvasRef = useRef(null);
  const state = useRef({ scenario, result, status });
  useEffect(() => { state.current = { scenario, result, status }; }, [scenario, result, status]);
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let width = 0, height = 0, frame = 0, phase = 0, last = 0, visible = false;
    const pointer = {x:0,y:0};
    const stopped = () => media.matches || document.documentElement.dataset.motion === 'paused';
    const project = (x,y,z) => {
      const angle = -.3 + pointer.x * .16 + (stopped() ? 0 : Math.sin(phase * .12) * .09);
      const a = x * Math.cos(angle) - z * Math.sin(angle);
      const b = x * Math.sin(angle) + z * Math.cos(angle);
      const scale = Math.min(width / 4.2, height / 3.5) * (4 / (4 + b));
      return {x:width * .5 + a * scale, y:height * .53 - (y + pointer.y * .06) * scale + b * scale * .25, scale};
    };
    const line = (a,b,color) => {
      const p = project(...a), q = project(...b);
      context.beginPath(); context.moveTo(p.x,p.y); context.lineTo(q.x,q.y); context.strokeStyle=color; context.stroke();
    };
    function draw() {
      context.clearRect(0,0,width,height);
      const active = groups.indexOf(state.current.scenario);
      context.lineWidth = 1;
      for(let i=-2;i<=2;i++) {
        line([i*.6,-.85,-1.2],[i*.6,-.85,1.2],'#69518618');
        line([-1.2,-.85,i*.6],[1.2,-.85,i*.6],'#69518618');
      }
      line([-1.35,-.85,1.2],[1.5,-.85,1.2],'#69518670');
      line([-1.35,-.85,1.2],[-1.35,1.25,1.2],'#69518670');
      const count = width < 500 ? 180 : 390;
      const points = Array.from({length:count},(_,i)=>{
        const group=i%3, seed=seeds[group];
        const x=seed[0]+(fraction(i+1)-.5)*.88;
        const y=seed[1]+(fraction(i+402)-.5)*.7;
        const z=seed[2]+(fraction(i+807)-.5)*.85;
        return {...project(x,y,z),group,index:i};
      }).sort((a,b)=>a.scale-b.scale);
      points.forEach(point=>{
        const selected = point.group===active;
        const pulsing = !stopped() && ['loading','waking'].includes(state.current.status);
        const radius = selected ? 2.2 + (pulsing ? Math.sin(phase*3+point.index*.1)*.6 : 0) : 1.3;
        context.beginPath(); context.arc(point.x,point.y,Math.max(.8,radius*point.scale/110),0,Math.PI*2);
        context.fillStyle = selected ? (state.current.result?.anomaly ? '#80602d' : '#695186') : '#8e839b45';
        context.fill();
      });
      const anchor=project(...seeds[active]);
      context.beginPath(); context.arc(anchor.x,anchor.y,23,0,Math.PI*2); context.strokeStyle='#695186';context.stroke();
      context.beginPath();context.arc(anchor.x,anchor.y,29,0,Math.PI*2);context.strokeStyle='#69518630';context.stroke();
      context.fillStyle='#51445f';context.font='10px ui-monospace,monospace';
      context.fillText('REQUEST VOLUME →',Math.max(18,width-170),height-25);
      context.save();context.translate(22,height*.6);context.rotate(-Math.PI/2);context.fillText('ERROR RATE →',0,0);context.restore();
    }
    function tick(now) {
      if (now-last>32) { phase+=Math.min((now-last)/1000,.05);last=now;draw(); }
      frame=requestAnimationFrame(tick);
    }
    function sync() {
      cancelAnimationFrame(frame);last=0;draw();
      if(visible && !document.hidden && !stopped()) frame=requestAnimationFrame(tick);
    }
    const resize = new ResizeObserver(([entry])=>{
      width=entry.contentRect.width;height=entry.contentRect.height;
      const dpr=Math.min(window.devicePixelRatio||1,1.5);
      canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);context.setTransform(dpr,0,0,dpr,0,0);sync();
    });
    const observer = new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();});
    const move = event=>{if(stopped())return;const r=canvas.getBoundingClientRect();pointer.x=(event.clientX-r.left)/r.width-.5;pointer.y=(event.clientY-r.top)/r.height-.5;if(stopped())draw();};
    const reset = ()=>{pointer.x=0;pointer.y=0;draw();};
    resize.observe(canvas);observer.observe(canvas);
    canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerleave',reset);
    media.addEventListener('change',sync);window.addEventListener('portfolio-motion-change',sync);document.addEventListener('visibilitychange',sync);
    const update=()=>draw();window.addEventListener('portfolio:traffic-update',update);
    return ()=>{cancelAnimationFrame(frame);resize.disconnect();observer.disconnect();canvas.removeEventListener('pointermove',move);canvas.removeEventListener('pointerleave',reset);media.removeEventListener('change',sync);window.removeEventListener('portfolio-motion-change',sync);document.removeEventListener('visibilitychange',sync);window.removeEventListener('portfolio:traffic-update',update);};
  }, []);
  useEffect(()=>{window.dispatchEvent(new Event('portfolio:traffic-update'));},[scenario,result,status]);
  return <figure className="traffic-field" aria-label="Illustrative synthetic traffic feature space">
    <div className="traffic-field-heading"><span>FEATURE FIELD / 01</span><span>Illustrative synthetic points</span></div>
    <canvas ref={canvasRef} role="img" aria-label={`Illustrative traffic clusters. Selected preset: ${scenario}. Dots are generated illustrations, not individually scored requests.`}/>
    <figcaption><span className="traffic-selection"><i aria-hidden="true"/>{scenario}</span><span>{status==='done' && result ? 'API verdict received' : status==='error' ? 'API unavailable' : ['loading','waking'].includes(status) ? 'Waiting for API verdict' : 'Choose a preset, then score it'}</span></figcaption>
    <p className="traffic-disclosure">Each API call scores one preset feature record. Dots illustrate traffic patterns; they are not live logs or per-request predictions. Depth separates illustrative clusters.</p>
  </figure>;
}
