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
    vec3 copper = vec3(.20, .68, 1.0);
    vec3 cream = vec3(.72, .56, 1.0);
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
    const count = mobile ? 1800 : 3600;
    const structure = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const layer = i % 5, t = Math.floor(i / 5) / (count / 5);
      const angle = t * Math.PI * 2;
      const radius = .8 + Math.sin(t * Math.PI * 12) * .035;
      structure.set([(layer - 2) * 1.05, Math.cos(angle) * radius * 1.7, Math.sin(angle) * radius], i * 3);
    }
    const source = new THREE.BufferAttribute(structure, 3);
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
    // Five separated feature planes and sparse connections form a readable neural architecture.
    const structureGroup = new THREE.Group();
    const structureMaterial = new THREE.LineBasicMaterial({color:0x65baff,transparent:true,opacity:.35});
    const structureGeometries = [];
    const nodes = [];
    for (let layer = 0; layer < 5; layer++) {
      const layerNodes = [];
      for (let n = 0; n < 7; n++) {
        const angle = n / 7 * Math.PI * 2;
        layerNodes.push(new THREE.Vector3((layer - 2) * 1.05, Math.cos(angle) * 1.36, Math.sin(angle) * .8));
      }
      nodes.push(layerNodes);
    }
    const segments = [];
    for (let layer = 0; layer < 4; layer++) {
      nodes[layer].forEach((node, n) => {
        for (const offset of [0, 2]) segments.push(node, nodes[layer + 1][(n + offset) % 7]);
      });
    }
    const connectionGeometry = new THREE.BufferGeometry().setFromPoints(segments);
    structureGeometries.push(connectionGeometry);
    structureGroup.add(new THREE.LineSegments(connectionGeometry, structureMaterial));
    const nodeGeometry = new THREE.IcosahedronGeometry(.065, 1);
    const nodeMaterial = new THREE.MeshBasicMaterial({color:0xbce6ff,transparent:true,opacity:.9});
    nodes.flat().forEach(position => {const node = new THREE.Mesh(nodeGeometry,nodeMaterial); node.position.copy(position); structureGroup.add(node);});
    group.add(structureGroup);
    const networkGroup = new THREE.Group(), arcGeometries=[];
    const arcMaterial = new THREE.LineBasicMaterial({color:0x9aafff,transparent:true,opacity:.23,blending:THREE.AdditiveBlending});
    for(let j=0;j<9;j++) {
      const points=Array.from({length:129},(_,i)=>{const a=i/128*Math.PI*2;return new THREE.Vector3(Math.cos(a)*2.42,Math.sin(a)*2.42,0);});
      const geo=new THREE.BufferGeometry().setFromPoints(points);arcGeometries.push(geo);
      const line=new THREE.LineLoop(geo,arcMaterial);line.rotation.y=j*Math.PI/9;networkGroup.add(line);
    }
    group.add(networkGroup);
    const orbitGeometry = new THREE.BufferGeometry().setFromPoints(Array.from({length:161},(_,i)=>{const a=i/160*Math.PI*2;return new THREE.Vector3(Math.cos(a)*3.15,Math.sin(a)*3.15,0);}));
    const orbitMaterial=new THREE.LineBasicMaterial({color:0x608bdf,transparent:true,opacity:.2});
    const orbit=new THREE.LineLoop(orbitGeometry,orbitMaterial);orbit.rotation.set(1.15,.25,.3);group.add(orbit);
    let raf=0,inView=true,lost=false,last=0,time=0,burstValue=0,lastBurst=controls.current.burst;
    let yaw=0,dragX=null,targetX=0,targetY=0;
    const canvas=renderer.domElement;
    const draw=(dt=0)=>{
      const state=controls.current,k=paused() ? 1 : 1-Math.exp(-dt*4);
      uniforms.uMorph.value+=(state.formation-uniforms.uMorph.value)*k; uniforms.uEnergy.value=state.energy;uniforms.uTime.value=time;uniforms.uBurst.value=paused() ? 0 : burstValue;
      const structureOpacity = Math.max(0, 1 - Math.abs(uniforms.uMorph.value - 1));
      structureGroup.visible = structureOpacity > .03;
      structureMaterial.opacity = structureOpacity * .25;
      nodeMaterial.opacity = structureOpacity * .9;
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
    return ()=>{api.current=null;cancelAnimationFrame(raf);resizeObserver.disconnect();observer.disconnect();window.removeEventListener('portfolio-motion-change',sync);media.removeEventListener('change',sync);document.removeEventListener('visibilitychange',sync);canvas.removeEventListener('pointermove',move);canvas.removeEventListener('pointerdown',down);canvas.removeEventListener('pointerup',up);canvas.removeEventListener('pointercancel',up);canvas.removeEventListener('pointerleave',leave);canvas.removeEventListener('webglcontextlost',contextLost);canvas.removeEventListener('webglcontextrestored',contextRestored);geometry.dispose();material.dispose();structureGeometries.forEach(g=>g.dispose());structureMaterial.dispose();nodeGeometry.dispose();nodeMaterial.dispose();arcGeometries.forEach(g=>g.dispose());arcMaterial.dispose();orbitGeometry.dispose();orbitMaterial.dispose();renderer.dispose();canvas.remove();};
  }, []);
  return <div className="field-webgl" ref={mountRef} aria-hidden="true"/>;
}
