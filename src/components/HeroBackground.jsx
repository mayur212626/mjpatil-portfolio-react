import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const vertex = `
  attribute vec3 flow; attribute vec3 network; attribute float seed;
  uniform float uTime, uMorph, uEnergy, uBurst, uSize;
  varying float vSeed, vDepth;
  void main() {
    vec3 p = uMorph < 1.0 ? mix(flow, position, uMorph) : mix(position, network, uMorph - 1.0);
    float ripple = sin(p.y * 3.5 + p.x * 2.0 + uTime * .7 + seed * 3.0);
    p += normalize(p + .001) * ripple * uEnergy * .10;
    p += normalize(p + .001) * uBurst * (.6 + seed) * 1.15;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = clamp(uSize * (1.0 + seed * .8) / -mv.z, 1.0, 5.5);
    vSeed = seed; vDepth = clamp((mv.z + 12.0) / 7.0, .12, 1.0);
  }
`;
const fragment = `
  uniform float uTime; varying float vSeed, vDepth;
  void main() {
    float d = length(gl_PointCoord - .5);
    if(d > .5) discard;
    vec3 copper = vec3(1.0, .24, .06);
    vec3 cream = vec3(1.0, .87, .67);
    vec3 color = mix(copper, cream, smoothstep(.30, .83, vSeed));
    float alpha = smoothstep(.5, .05, d) * vDepth * (.6 + .4 * sin(vSeed*20.0 + uTime*.3));
    gl_FragColor = vec4(color, alpha);
  }
`;

export default function HeroBackground({ formation = 1, energy = .5, burst = 0 }) {
  const mountRef = useRef(null);
  const api = useRef(null);
  const controls = useRef({ formation, energy, burst });
  useEffect(() => { controls.current = { formation, energy, burst }; api.current?.update(); }, [formation, energy, burst]);
  useEffect(() => {
    const mount = mountRef.current;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const paused = () => media.matches || document.documentElement.dataset.motion === 'paused';
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' }); } catch { return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    renderer.setClearColor(0x000000, 0); mount.appendChild(renderer.domElement); mount.dataset.ready = 'true';
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, .1, 40); camera.position.set(0,.15,9.7);
    const group = new THREE.Group(); group.rotation.set(.22,0,-.22); scene.add(group);
    const mobile = window.innerWidth < 700;
    const knot = new THREE.TorusKnotGeometry(1.65,.49,mobile ? 190 : 320,mobile ? 14 : 22,2,3);
    const source = knot.attributes.position, count = source.count;
    const flow = new Float32Array(count*3), network = new Float32Array(count*3), seeds = new Float32Array(count);
    for(let i=0;i<count;i++) {
      const t=i/count, a=t*Math.PI*18, s=Math.sin(i*127.1)*43758.5453, seed=s-Math.floor(s); seeds[i]=seed;
      const radius=1.7+.35*Math.sin(a*1.5);
      flow.set([Math.cos(a)*radius,(t-.5)*4.8,Math.sin(a)*radius],i*3);
      const y=1-2*t,r=Math.sqrt(1-y*y),phi=i*2.399963;
      network.set([Math.cos(phi)*r*2.4,y*2.4,Math.sin(phi)*r*2.4],i*3);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position',source.clone()); geometry.setAttribute('flow',new THREE.BufferAttribute(flow,3)); geometry.setAttribute('network',new THREE.BufferAttribute(network,3)); geometry.setAttribute('seed',new THREE.BufferAttribute(seeds,1));
    const uniforms={uTime:{value:0},uMorph:{value:controls.current.formation},uEnergy:{value:controls.current.energy},uBurst:{value:0},uSize:{value:29}};
    const material = new THREE.ShaderMaterial({uniforms,vertexShader:vertex,fragmentShader:fragment,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending});
    group.add(new THREE.Points(geometry,material));
    const surfaceMaterial = new THREE.MeshStandardMaterial({color:0x793417,metalness:.75,roughness:.3,transparent:true,opacity:.58});
    const surface = new THREE.Mesh(knot,surfaceMaterial); group.add(surface);
    scene.add(new THREE.HemisphereLight(0xffe6cb,0x130809,2));
    const light = new THREE.DirectionalLight(0xff9f60,7); light.position.set(3,4,5); scene.add(light);
    const rim = new THREE.DirectionalLight(0xa9dcff,5); rim.position.set(-4,1,-2); scene.add(rim);
    const networkGroup = new THREE.Group(), arcGeometries=[];
    const arcMaterial = new THREE.LineBasicMaterial({color:0xffba8e,transparent:true,opacity:.23,blending:THREE.AdditiveBlending});
    for(let j=0;j<9;j++) {
      const points=Array.from({length:129},(_,i)=>{const a=i/128*Math.PI*2;return new THREE.Vector3(Math.cos(a)*2.42,Math.sin(a)*2.42,0);});
      const geo=new THREE.BufferGeometry().setFromPoints(points);arcGeometries.push(geo);
      const line=new THREE.LineLoop(geo,arcMaterial);line.rotation.y=j*Math.PI/9;networkGroup.add(line);
    }
    group.add(networkGroup);
    const orbitGeometry = new THREE.BufferGeometry().setFromPoints(Array.from({length:161},(_,i)=>{const a=i/160*Math.PI*2;return new THREE.Vector3(Math.cos(a)*3.15,Math.sin(a)*3.15,0);}));
    const orbitMaterial=new THREE.LineBasicMaterial({color:0xffad80,transparent:true,opacity:.25});
    const orbit=new THREE.LineLoop(orbitGeometry,orbitMaterial);orbit.rotation.set(1.15,.25,.3);group.add(orbit);
    let raf=0,inView=true,lost=false,last=0,time=0,burstValue=0,lastBurst=controls.current.burst;
    let yaw=0,dragX=null,targetX=0,targetY=0;
    const canvas=renderer.domElement;
    const draw=(dt=0)=>{
      const state=controls.current,k=paused() ? 1 : 1-Math.exp(-dt*4);
      uniforms.uMorph.value+=(state.formation-uniforms.uMorph.value)*k; uniforms.uEnergy.value=state.energy;uniforms.uTime.value=time;uniforms.uBurst.value=paused() ? 0 : burstValue;
      surface.visible=Math.abs(uniforms.uMorph.value-1)<.95;surfaceMaterial.opacity=Math.max(0,1-Math.abs(uniforms.uMorph.value-1))*.58;
      networkGroup.visible=uniforms.uMorph.value>1.1;arcMaterial.opacity=Math.max(0,uniforms.uMorph.value-1)*.23;
      if(!paused()) {group.rotation.y+=(targetX+yaw+time*(.025+state.energy*.05)-group.rotation.y)*Math.min(1,dt*3);group.rotation.x+=(.22+targetY-group.rotation.x)*Math.min(1,dt*3);group.rotation.z=-.22+Math.sin(time*.14)*.07;}
      renderer.render(scene,camera);
    };
    const tick=now=>{const dt=Math.min((now-last)/1000||.016,.05);last=now;time+=dt;burstValue*=Math.exp(-dt*2.1);draw(dt);raf=requestAnimationFrame(tick);};
    const sync=()=>{cancelAnimationFrame(raf);if(!lost) draw();if(!paused()&&inView&&!document.hidden&&!lost) {last=performance.now();raf=requestAnimationFrame(tick);}};
    api.current={update:()=>{if(controls.current.burst!==lastBurst) {lastBurst=controls.current.burst;burstValue=1;}if(paused()) draw();}};
    const resize=()=>{const width=mount.clientWidth||600,height=mount.clientHeight||600;camera.aspect=width/height;camera.position.z=width<420?10.7:9.7;camera.updateProjectionMatrix();renderer.setSize(width,height);uniforms.uSize.value=mobile?22:29;draw();};
    const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(mount);
    const observer=new IntersectionObserver(([entry])=>{inView=entry.isIntersecting;sync();});observer.observe(mount);
    const move=event=>{if(paused()||event.pointerType==='touch')return;const r=canvas.getBoundingClientRect();targetX=((event.clientX-r.left)/r.width-.5)*.7;targetY=((event.clientY-r.top)/r.height-.5)*.35;if(dragX!==null){yaw+=(event.clientX-dragX)*.008;dragX=event.clientX;}};
    const down=event=>{if(event.pointerType==='touch'||paused())return;dragX=event.clientX;canvas.setPointerCapture(event.pointerId);};
    const up=()=>{dragX=null;},leave=()=>{targetX=0;targetY=0;};
    const contextLost=event=>{event.preventDefault();lost=true;mount.dataset.ready='false';cancelAnimationFrame(raf);};
    const contextRestored=()=>{lost=false;mount.dataset.ready='true';sync();};
    canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerdown',down);canvas.addEventListener('pointerup',up);canvas.addEventListener('pointercancel',up);canvas.addEventListener('pointerleave',leave);canvas.addEventListener('webglcontextlost',contextLost);canvas.addEventListener('webglcontextrestored',contextRestored);
    window.addEventListener('portfolio-motion-change',sync);media.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);resize();sync();
    return ()=>{api.current=null;cancelAnimationFrame(raf);resizeObserver.disconnect();observer.disconnect();window.removeEventListener('portfolio-motion-change',sync);media.removeEventListener('change',sync);document.removeEventListener('visibilitychange',sync);canvas.removeEventListener('pointermove',move);canvas.removeEventListener('pointerdown',down);canvas.removeEventListener('pointerup',up);canvas.removeEventListener('pointercancel',up);canvas.removeEventListener('pointerleave',leave);canvas.removeEventListener('webglcontextlost',contextLost);canvas.removeEventListener('webglcontextrestored',contextRestored);geometry.dispose();knot.dispose();material.dispose();surfaceMaterial.dispose();arcGeometries.forEach(g=>g.dispose());arcMaterial.dispose();orbitGeometry.dispose();orbitMaterial.dispose();renderer.dispose();canvas.remove();};
  }, []);
  return <div className="field-webgl" ref={mountRef} aria-hidden="true"/>;
}
