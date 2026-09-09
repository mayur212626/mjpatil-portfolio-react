import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

// ── Crazy 3D opening ──────────────────────────────────────────────
// Neurons fly in from deep space, assemble into "MAYUR PATIL", morph
// into "DATA SCIENTIST", synapses firing between them, then explode
// outward and dissolve into the site.
//
// Colour spectrum (checked on dark): cyan → blue → violet → pink → coral.
const GRAD = [
  [0.00, [0, 229, 255]],   // cyan
  [0.28, [79, 140, 255]],  // blue
  [0.55, [168, 85, 247]],  // violet
  [0.80, [255, 59, 212]],  // pink
  [1.00, [255, 90, 60]],   // coral (ties to brand red)
];
const gradColor = (t) => {
  t = Math.max(0, Math.min(1, t));
  for (let i = 0; i < GRAD.length - 1; i++) {
    const [t0, c0] = GRAD[i], [t1, c1] = GRAD[i + 1];
    if (t >= t0 && t <= t1) {
      const f = (t - t0) / (t1 - t0);
      return [
        (c0[0] + (c1[0] - c0[0]) * f) / 255,
        (c0[1] + (c1[1] - c0[1]) * f) / 255,
        (c0[2] + (c1[2] - c0[2]) * f) / 255,
      ];
    }
  }
  return [1, 1, 1];
};

// Sample N target positions (world units) from rendered text pixels.
function textTargets(text, N, worldW, weight = 800) {
  const cw = 1400, ch = 360;
  const cvs = document.createElement('canvas'); cvs.width = cw; cvs.height = ch;
  const ctx = cvs.getContext('2d');
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, cw, ch);
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  // shrink font until it fits
  let size = 230;
  ctx.font = `900 ${size}px Inter, Arial, sans-serif`;
  while (ctx.measureText(text).width > cw * 0.92 && size > 40) {
    size -= 10; ctx.font = `900 ${size}px Inter, Arial, sans-serif`;
  }
  ctx.fillText(text, cw / 2, ch / 2);
  const data = ctx.getImageData(0, 0, cw, ch).data;
  const filled = [];
  for (let y = 0; y < ch; y += 3) {
    for (let x = 0; x < cw; x += 3) {
      if (data[(y * cw + x) * 4] > 128) filled.push([x, y]);
    }
  }
  const out = new Float32Array(N * 3);
  const aspect = ch / cw;
  for (let i = 0; i < N; i++) {
    const p = filled.length ? filled[(Math.random() * filled.length) | 0] : [cw / 2, ch / 2];
    out[i * 3]     = (p[0] / cw - 0.5) * worldW;
    out[i * 3 + 1] = -(p[1] / ch - 0.5) * worldW * aspect;
    out[i * 3 + 2] = (Math.random() - 0.5) * 5;
  }
  return out;
}

// Nearest-neighbour edges for the synapse lines (grid-hashed).
function knnEdges(targets, N, cell = 3.2, kMax = 2) {
  const grid = new Map();
  const key = (x, y) => `${Math.floor(x / cell)},${Math.floor(y / cell)}`;
  for (let i = 0; i < N; i++) {
    const k = key(targets[i * 3], targets[i * 3 + 1]);
    (grid.get(k) || grid.set(k, []).get(k)).push(i);
  }
  const edges = [];
  for (let i = 0; i < N; i++) {
    const x = targets[i * 3], y = targets[i * 3 + 1];
    const cxi = Math.floor(x / cell), cyi = Math.floor(y / cell);
    let best = [];
    for (let gx = -1; gx <= 1; gx++) for (let gy = -1; gy <= 1; gy++) {
      const arr = grid.get(`${cxi + gx},${cyi + gy}`); if (!arr) continue;
      for (const j of arr) {
        if (j <= i) continue;
        const dx = x - targets[j * 3], dy = y - targets[j * 3 + 1];
        best.push([dx * dx + dy * dy, j]);
      }
    }
    best.sort((a, b) => a[0] - b[0]);
    for (let k = 0; k < Math.min(kMax, best.length); k++) edges.push(i, best[k][1]);
  }
  return edges;
}

function NeuronScene({ onDone }) {
  const mountRef = useRef(null);
  useEffect(() => {
    const mount = mountRef.current;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05060a, 0.015);
    const W = () => mount.clientWidth || window.innerWidth;
    const H = () => mount.clientHeight || window.innerHeight;
    const camera = new THREE.PerspectiveCamera(60, W() / H(), 0.1, 400);
    camera.position.set(0, 0, 52);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(W(), H());
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // sprite
    const s = 64, sc = document.createElement('canvas'); sc.width = sc.height = s;
    const sx = sc.getContext('2d');
    const rg = sx.createRadialGradient(s/2,s/2,0,s/2,s/2,s/2);
    rg.addColorStop(0,'rgba(255,255,255,1)'); rg.addColorStop(0.3,'rgba(255,255,255,0.85)'); rg.addColorStop(1,'rgba(255,255,255,0)');
    sx.fillStyle = rg; sx.fillRect(0,0,s,s);
    const sprite = new THREE.CanvasTexture(sc); sprite.colorSpace = THREE.SRGBColorSpace;

    const N = 3600;
    const worldW = Math.min(66, (W() / 900) * 66 + 34);

    // targets for the two words + edge graphs
    const T0 = textTargets('MAYUR PATIL', N, worldW);
    const T1 = textTargets('DATA SCIENTIST', N, worldW);
    const E0 = knnEdges(T0, N);
    const E1 = knnEdges(T1, N);

    // particle state — start scattered in a big sphere
    const cur = new Float32Array(N * 3);
    const vel = new Float32Array(N * 3);
    const col = new Float32Array(N * 3);
    const sz  = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      const r = 90 + Math.random() * 70, th = Math.random() * 6.283, ph = Math.acos(2*Math.random()-1);
      cur[i*3]   = r*Math.sin(ph)*Math.cos(th);
      cur[i*3+1] = r*Math.sin(ph)*Math.sin(th);
      cur[i*3+2] = r*Math.cos(ph) - 60;
      const c = gradColor(i / N); col.set(c, i*3);
      sz[i] = Math.random()*1.6 + 1.1;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(cur, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    pGeo.setAttribute('psize', new THREE.BufferAttribute(sz, 1));
    const pMat = new THREE.ShaderMaterial({
      uniforms: { uMap: { value: sprite }, uScale: { value: H() }, uOpacity: { value: 1 } },
      vertexShader: `attribute float psize; attribute vec3 color; varying vec3 vColor; uniform float uScale;
        void main(){ vColor=color; vec4 mv=modelViewMatrix*vec4(position,1.0);
        gl_PointSize=psize*(uScale/-mv.z)*0.9; gl_Position=projectionMatrix*mv; }`,
      fragmentShader: `uniform sampler2D uMap; uniform float uOpacity; varying vec3 vColor;
        void main(){ vec4 t=texture2D(uMap,gl_PointCoord); if(t.a<0.02) discard; gl_FragColor=vec4(vColor, t.a*uOpacity); }`,
      transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const points = new THREE.Points(pGeo, pMat);

    // synapse lines
    let edges = E0;
    const lPos = new Float32Array(Math.max(E0.length, E1.length) * 3);
    const lGeo = new THREE.BufferGeometry();
    lGeo.setAttribute('position', new THREE.BufferAttribute(lPos, 3));
    const lMat = new THREE.LineBasicMaterial({ color: 0x66aaff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
    const lines = new THREE.LineSegments(lGeo, lMat);
    lGeo.setDrawRange(0, edges.length);

    const group = new THREE.Group();
    group.add(lines); group.add(points);
    scene.add(group);

    const onResize = () => { camera.aspect = W()/H(); camera.updateProjectionMatrix(); renderer.setSize(W(), H()); pMat.uniforms.uScale.value = H(); };
    window.addEventListener('resize', onResize);

    // timeline (ms)
    const T = { formA: 1500, holdA: 2700, morph: 4100, holdB: 4900, boom: 5600 };
    let raf, start = performance.now(), finished = false, exploded = false;
    const clock = new THREE.Clock();

    const setEdges = (E) => {
      edges = E; lGeo.setDrawRange(0, edges.length);
    };

    const animate = () => {
      const el = performance.now() - start;
      const dt = Math.min(clock.getDelta(), 0.05);

      // choose target + line visibility per phase
      let target = T0, lineOp = 0, k = 0.09;
      if (el < T.formA) { target = T0; lineOp = 0; k = 0.06 + (el/T.formA)*0.05; }
      else if (el < T.holdA) { target = T0; lineOp = 0.5; }
      else if (el < T.morph) { target = T1; lineOp = 0.15; if (edges !== E1 && el > (T.holdA+T.morph)/2) setEdges(E1); }
      else if (el < T.holdB) { target = T1; lineOp = 0.5; setEdges(E1); }
      else { target = T1; lineOp = 0.5; }

      if (el < T.boom) {
        // ease particles toward target
        for (let i = 0; i < N*3; i++) cur[i] += (target[i] - cur[i]) * k;
      } else {
        // EXPLODE
        if (!exploded) {
          exploded = true;
          for (let i = 0; i < N; i++) {
            const x=cur[i*3], y=cur[i*3+1], z=cur[i*3+2];
            const l = Math.hypot(x,y,z) || 1;
            vel[i*3] = x/l*(1.2+Math.random()*1.8); vel[i*3+1]=y/l*(1.2+Math.random()*1.8); vel[i*3+2]=z/l*(1.2+Math.random()*1.8)+0.4;
          }
        }
        for (let i = 0; i < N*3; i++) cur[i] += vel[i];
        pMat.uniforms.uOpacity.value = Math.max(0, pMat.uniforms.uOpacity.value - dt * 1.6);
        lineOp = 0;
        if (pMat.uniforms.uOpacity.value <= 0.02 && !finished) { finished = true; onDone && onDone(); }
      }
      pGeo.attributes.position.needsUpdate = true;

      // update synapse line vertices from live particle positions
      if (lineOp > 0) {
        for (let e = 0; e < edges.length; e++) {
          const idx = edges[e];
          lPos[e*3] = cur[idx*3]; lPos[e*3+1] = cur[idx*3+1]; lPos[e*3+2] = cur[idx*3+2];
        }
        lGeo.attributes.position.needsUpdate = true;
      }
      lMat.opacity += (lineOp - lMat.opacity) * 0.1;

      group.rotation.y = Math.sin(el * 0.00018) * 0.18;
      group.rotation.x = Math.sin(el * 0.00026) * 0.06;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      renderer.dispose(); pGeo.dispose(); lGeo.dispose(); pMat.dispose(); lMat.dispose(); sprite.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, [onDone]);

  return <div ref={mountRef} className="absolute inset-0 w-full h-full" />;
}

const Preloader = () => {
  const [isLoading, setIsLoading] = useState(true);
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (reduce) { setIsLoading(false); return; }
    const cap = setTimeout(() => setIsLoading(false), 7000); // failsafe
    const skip = () => setIsLoading(false);
    window.addEventListener('keydown', skip);
    window.addEventListener('click', skip);
    return () => { clearTimeout(cap); window.removeEventListener('keydown', skip); window.removeEventListener('click', skip); };
  }, [reduce]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 w-full h-screen z-[100000] overflow-hidden bg-[#05060a] flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#0c0d16_0%,#05060a_72%)]" />
          <NeuronScene onDone={() => setIsLoading(false)} />
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/25 text-[10px] font-mono tracking-[0.3em] uppercase">
            click to skip
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
