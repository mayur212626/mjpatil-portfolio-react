import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Real 3D particle network (Three.js / WebGL): colored point cloud in depth,
// connecting lines, perspective + fog, slow rotation with mouse parallax.
// Matches the layered, depthy reference look.
const COLORS = [
  [1.0, 0.16, 0.16], // red
  [1.0, 0.16, 0.16], // red (weighted)
  [1.0, 0.23, 0.23], // red-2
  [0.23, 0.51, 0.96], // blue
  [0.96, 0.62, 0.10], // orange
  [1.0, 1.0, 1.0],    // white
  [1.0, 1.0, 1.0],    // white (weighted)
];

const HeroBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x07080b, 0.014);

    const W = () => mount.clientWidth || window.innerWidth;
    const H = () => mount.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(62, W() / H(), 0.1, 300);
    camera.position.z = 62;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(W(), H());
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // ── soft round sprite for glowing points ──
    const makeSprite = () => {
      const s = 64, cvs = document.createElement('canvas');
      cvs.width = cvs.height = s;
      const c = cvs.getContext('2d');
      const g = c.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
      g.addColorStop(0, 'rgba(255,255,255,1)');
      g.addColorStop(0.25, 'rgba(255,255,255,0.9)');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      c.fillStyle = g; c.fillRect(0, 0, s, s);
      const t = new THREE.CanvasTexture(cvs);
      t.colorSpace = THREE.SRGBColorSpace;
      return t;
    };
    const sprite = makeSprite();

    // ── point cloud in a 3D box ──
    const N = 150;
    const spanX = 110, spanY = 65, spanZ = 70;
    const pos = new Float32Array(N * 3);
    const col = new Float32Array(N * 3);
    const sizes = new Float32Array(N);
    const pts = [];
    for (let i = 0; i < N; i++) {
      const x = (Math.random() - 0.5) * spanX;
      const y = (Math.random() - 0.5) * spanY;
      const z = (Math.random() - 0.5) * spanZ;
      pos.set([x, y, z], i * 3);
      const c = COLORS[(Math.random() * COLORS.length) | 0];
      col.set(c, i * 3);
      sizes[i] = Math.random() * 2.4 + 1.0;
      pts.push(new THREE.Vector3(x, y, z));
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    pGeo.setAttribute('psize', new THREE.BufferAttribute(sizes, 1));

    // shader so each point keeps its own size + color, with distance attenuation
    const pMat = new THREE.ShaderMaterial({
      uniforms: { uMap: { value: sprite }, uScale: { value: H() } },
      vertexShader: `
        attribute float psize; attribute vec3 color; varying vec3 vColor;
        uniform float uScale;
        void main(){
          vColor = color;
          vec4 mv = modelViewMatrix * vec4(position,1.0);
          gl_PointSize = psize * (uScale / -mv.z) * 0.9;
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `
        uniform sampler2D uMap; varying vec3 vColor;
        void main(){
          vec4 tex = texture2D(uMap, gl_PointCoord);
          if (tex.a < 0.02) discard;
          gl_FragColor = vec4(vColor, tex.a);
        }`,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const points = new THREE.Points(pGeo, pMat);

    // ── connecting lines between near points ──
    const linePos = [];
    const lineCol = [];
    const MAXD = 26;
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const d = pts[i].distanceTo(pts[j]);
        if (d < MAXD) {
          const a = 1 - d / MAXD;
          linePos.push(pts[i].x, pts[i].y, pts[i].z, pts[j].x, pts[j].y, pts[j].z);
          // faint white lines, alpha baked via color intensity
          const v = 0.35 * a;
          lineCol.push(v, v, v, v, v, v);
        }
      }
    }
    const lGeo = new THREE.BufferGeometry();
    lGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePos, 3));
    lGeo.setAttribute('color', new THREE.Float32BufferAttribute(lineCol, 3));
    const lMat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false });
    const lines = new THREE.LineSegments(lGeo, lMat);

    const group = new THREE.Group();
    group.add(points); group.add(lines);
    scene.add(group);

    // ── interaction + animation ──
    const mouse = { x: 0, y: 0 };
    const onMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', onMove);

    const onResize = () => {
      camera.aspect = W() / H();
      camera.updateProjectionMatrix();
      renderer.setSize(W(), H());
      pMat.uniforms.uScale.value = H();
    };
    window.addEventListener('resize', onResize);

    let raf, t = 0;
    const clock = new THREE.Clock();
    const animate = () => {
      const dt = clock.getDelta();
      t += dt;
      // slow auto-rotate
      group.rotation.y += dt * 0.06;
      group.rotation.x = Math.sin(t * 0.15) * 0.08;
      // mouse parallax on camera
      camera.position.x += (mouse.x * 14 - camera.position.x) * 0.03;
      camera.position.y += (-mouse.y * 9 - camera.position.y) * 0.03;
      camera.lookAt(scene.position);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    if (!reduce) animate(); else renderer.render(scene, camera);

    const onVis = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else if (!reduce) { cancelAnimationFrame(raf); clock.getDelta(); animate(); }
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVis);
      renderer.dispose(); pGeo.dispose(); lGeo.dispose(); pMat.dispose(); lMat.dispose(); sprite.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-[#07080b]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_62%_45%,#101119_0%,#07080b_72%)]" />
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />
      {/* left fade keeps the heading readable */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#07080b]/85 via-[#07080b]/25 to-transparent" />
    </div>
  );
};

export default HeroBackground;
