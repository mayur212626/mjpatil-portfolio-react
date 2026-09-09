import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { personalInfo } from '../data/portfolioData';

// ── Crazy 3D opening: neural brain point-cloud with firing synapses.
// Camera orbits, then dives into the brain and dissolves into the site.
function BrainScene({ onDone }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05060a, 0.02);
    const W = () => mount.clientWidth || window.innerWidth;
    const H = () => mount.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(60, W() / H(), 0.1, 400);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(W(), H());
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // glowing round sprite
    const s = 64, cvs = document.createElement('canvas'); cvs.width = cvs.height = s;
    const cx = cvs.getContext('2d');
    const rg = cx.createRadialGradient(s/2, s/2, 0, s/2, s/2, s/2);
    rg.addColorStop(0, 'rgba(255,255,255,1)'); rg.addColorStop(0.3, 'rgba(255,255,255,0.85)'); rg.addColorStop(1, 'rgba(255,255,255,0)');
    cx.fillStyle = rg; cx.fillRect(0, 0, s, s);
    const sprite = new THREE.CanvasTexture(cvs); sprite.colorSpace = THREE.SRGBColorSpace;

    // ── build brain-ish point cloud ──
    const PAL = [[1,0.16,0.16],[1,0.16,0.16],[0.23,0.51,0.96],[0.96,0.62,0.10],[1,1,1],[1,1,1]];
    const N = 2600;
    const nodes = [];
    const pos = new Float32Array(N*3), col = new Float32Array(N*3), sz = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      // random point on sphere
      const u = Math.random(), v = Math.random();
      const th = 2*Math.PI*u, ph = Math.acos(2*v-1);
      let x = Math.sin(ph)*Math.cos(th), y = Math.sin(ph)*Math.sin(th), z = Math.cos(ph);
      // lumpy cortex via layered sines
      let r = 16 + 2.6*Math.sin(x*6)*Math.sin(y*6)*Math.sin(z*6) + 1.4*Math.sin(x*13+y*9);
      x *= r*1.28; y *= r*0.9; z *= r*1.05;   // ellipsoid (front-back longer)
      // longitudinal fissure: push apart near mid-plane on top
      if (Math.abs(x) < 2.4 && y > 0) x += (x >= 0 ? 1 : -1) * (2.4 - Math.abs(x)) * 1.6;
      nodes.push(new THREE.Vector3(x, y, z));
      pos.set([x, y, z], i*3);
      const c = PAL[(Math.random()*PAL.length)|0]; col.set(c, i*3);
      sz[i] = Math.random()*1.8 + 0.9;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    pGeo.setAttribute('psize', new THREE.BufferAttribute(sz, 1));
    const pMat = new THREE.ShaderMaterial({
      uniforms: { uMap: { value: sprite }, uScale: { value: H() } },
      vertexShader: `attribute float psize; attribute vec3 color; varying vec3 vColor; uniform float uScale;
        void main(){ vColor=color; vec4 mv=modelViewMatrix*vec4(position,1.0);
        gl_PointSize=psize*(uScale/-mv.z)*0.9; gl_Position=projectionMatrix*mv; }`,
      fragmentShader: `uniform sampler2D uMap; varying vec3 vColor;
        void main(){ vec4 t=texture2D(uMap,gl_PointCoord); if(t.a<0.02) discard; gl_FragColor=vec4(vColor,t.a); }`,
      transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const points = new THREE.Points(pGeo, pMat);

    // ── synapse lines (sampled near pairs) ──
    const linePos = [], lineCol = [], edges = [];
    const MAXD = 7.5;
    for (let k = 0; k < 9000; k++) {
      const i = (Math.random()*N)|0, j = (Math.random()*N)|0;
      if (i === j) continue;
      const d = nodes[i].distanceTo(nodes[j]);
      if (d < MAXD) {
        const a = (1 - d/MAXD) * 0.4;
        linePos.push(nodes[i].x,nodes[i].y,nodes[i].z, nodes[j].x,nodes[j].y,nodes[j].z);
        lineCol.push(a,a,a, a,a,a);
        if (edges.length < 60) edges.push([i, j]);
      }
      if (linePos.length > 4200*6) break;
    }
    const lGeo = new THREE.BufferGeometry();
    lGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePos, 3));
    lGeo.setAttribute('color', new THREE.Float32BufferAttribute(lineCol, 3));
    const lines = new THREE.LineSegments(lGeo, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false }));

    // ── firing signal pulses (travel along edges) ──
    const P = edges.length;
    const sigPos = new Float32Array(P*3), sigT = new Float32Array(P);
    for (let i = 0; i < P; i++) sigT[i] = Math.random();
    const sGeo = new THREE.BufferGeometry();
    sGeo.setAttribute('position', new THREE.BufferAttribute(sigPos, 3));
    const sMat = new THREE.PointsMaterial({ size: 1.6, map: sprite, color: 0xffffff, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true });
    const signals = new THREE.Points(sGeo, sMat);

    const group = new THREE.Group();
    group.add(points); group.add(lines); group.add(signals);
    scene.add(group);

    const onResize = () => { camera.aspect = W()/H(); camera.updateProjectionMatrix(); renderer.setSize(W(), H()); pMat.uniforms.uScale.value = H(); };
    window.addEventListener('resize', onResize);

    let raf, start = performance.now(), finished = false;
    const DUR = 3400;          // total ms
    const DIVE_AT = 2200;      // start diving in
    const clock = new THREE.Clock();

    const animate = () => {
      const now = performance.now();
      const el = now - start;
      const dt = clock.getDelta();

      group.rotation.y += dt * 0.35;
      group.rotation.x = Math.sin(el*0.0004) * 0.12;

      // update signal pulses along their edges
      for (let i = 0; i < P; i++) {
        sigT[i] += dt * 0.6; if (sigT[i] > 1) sigT[i] -= 1;
        const [a, b] = edges[i];
        const t = sigT[i];
        sigPos[i*3]   = nodes[a].x + (nodes[b].x - nodes[a].x) * t;
        sigPos[i*3+1] = nodes[a].y + (nodes[b].y - nodes[a].y) * t;
        sigPos[i*3+2] = nodes[a].z + (nodes[b].z - nodes[a].z) * t;
      }
      sGeo.attributes.position.needsUpdate = true;

      // camera: orbit, then dive in
      const orbR = 60;
      if (el < DIVE_AT) {
        const ang = el * 0.00035;
        camera.position.set(Math.sin(ang)*orbR, 6, Math.cos(ang)*orbR);
        camera.lookAt(0, 0, 0);
      } else {
        const p = Math.min((el - DIVE_AT) / (DUR - DIVE_AT), 1);
        const eased = p * p;
        const rad = orbR * (1 - eased) + 2 * eased;   // rush toward center
        const ang = DIVE_AT * 0.00035 + p * 0.4;
        camera.position.set(Math.sin(ang)*rad, 6*(1-eased), Math.cos(ang)*rad);
        camera.lookAt(0, 0, 0);
        if (p >= 1 && !finished) { finished = true; onDone && onDone(); }
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      renderer.dispose(); pGeo.dispose(); lGeo.dispose(); sGeo.dispose(); pMat.dispose(); sprite.dispose();
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
    // hard cap failsafe + skip on interaction
    const cap = setTimeout(() => setIsLoading(false), 4200);
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
          exit={{ opacity: 0, scale: 1.08 }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 w-full h-screen z-[100000] overflow-hidden bg-[#05060a] flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#0e0f18_0%,#05060a_70%)]" />
          <BrainScene onDone={() => setIsLoading(false)} />

          {/* caption */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative z-10 text-center pointer-events-none"
          >
            <div className="text-white/90 font-black text-2xl md:text-4xl tracking-tight">
              {personalInfo.brandName}<span className="text-[#ff2a2a]">.</span>
            </div>
            <div className="mt-3 font-mono text-[11px] md:text-xs text-[#ff2a2a] tracking-[0.3em] uppercase animate-pulse">
              initializing neural net
            </div>
          </motion.div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/25 text-[10px] font-mono tracking-widest uppercase">
            click to skip
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
