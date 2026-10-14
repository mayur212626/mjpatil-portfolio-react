import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

// A curved metal blade, generated parametrically rather than loaded as a model.
function irisBlade() {
  const positions = [], uv = [], indices = [], rows = 42, columns = 6;
  for (let i = 0; i <= rows; i++) {
    const u = i / rows, latitude = -.98 + u * 1.96;
    for (let j = 0; j <= columns; j++) {
      const v = j / columns - .5, angle = u * 1.45 + v * (.06 + Math.sin(u * Math.PI) * .27);
      const radius = 1.95 + Math.sin(u * Math.PI) * .12 + Math.cos(v * Math.PI) * .075;
      positions.push(Math.cos(latitude) * Math.cos(angle) * radius, Math.sin(latitude) * radius, Math.cos(latitude) * Math.sin(angle) * radius);
      uv.push(u, j / columns);
      if (i < rows && j < columns) { const a = i * (columns + 1) + j, b = a + columns + 1; indices.push(a, b, a + 1, b, b + 1, a + 1); }
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geometry.setIndex(indices); geometry.computeVertexNormals(); return geometry;
}
export default function HeroBackground({ formation = 0, energy = .4, burst = 0 }) {
  const mountRef = useRef(null), api = useRef(null), controls = useRef({ formation, energy, burst });
  useEffect(() => { controls.current = { formation, energy, burst }; api.current?.update(); }, [formation, energy, burst]);
  useEffect(() => {
    const mount = mountRef.current, media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const paused = () => media.matches || document.documentElement.dataset.motion === 'paused';
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' }); } catch { return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setClearColor(0x000000, 0); renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.1;
    mount.appendChild(renderer.domElement); mount.dataset.ready = 'true';
    const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(35, 1, .1, 50);
    camera.position.set(0, .5, 10); camera.lookAt(0, 0, 0);
    const pmrem = new THREE.PMREMGenerator(renderer), room = new RoomEnvironment();
    const environment = pmrem.fromScene(room, .04); scene.environment = environment.texture; room.dispose(); pmrem.dispose();
    scene.add(new THREE.HemisphereLight(0xffffff, 0x79717e, 2));
    const key = new THREE.DirectionalLight(0xffffff, 5); key.position.set(-4, 5, 4); scene.add(key);
    const rim = new THREE.DirectionalLight(0xd4c6ff, 4); rim.position.set(4, 0, -3); scene.add(rim);
    const root = new THREE.Group(); root.rotation.set(.24, -.4, -.2); scene.add(root);
    const geometries = [], materials = [], makeGeometry = g => { geometries.push(g); return g; };
    const makeMaterial = opts => { const m = new THREE.MeshPhysicalMaterial(opts); materials.push(m); return m; };
    const chrome = makeMaterial({ color: 0xced0d5, metalness: 1, roughness: .19, side: THREE.DoubleSide, clearcoat: .65, clearcoatRoughness: .16 });
    const dark = makeMaterial({ color: 0x262231, metalness: .85, roughness: .22, clearcoat: 1 });
    const violet = makeMaterial({ color: 0x8973c9, metalness: .7, roughness: .25, emissive: 0x251146, emissiveIntensity: .2 });
    const groups = [new THREE.Group(), new THREE.Group(), new THREE.Group()]; groups.forEach(g => root.add(g));
    const blades = [], bladeGeometry = makeGeometry(irisBlade());
    for (let i = 0; i < 24; i++) { const blade = new THREE.Mesh(bladeGeometry, i % 6 === 0 ? violet : chrome); blade.rotation.y = i / 24 * Math.PI * 2; groups[0].add(blade); blades.push(blade); }
    const coreGeometry = makeGeometry(new THREE.SphereGeometry(.92, 48, 32)); groups[0].add(new THREE.Mesh(coreGeometry, dark));
    const irisRim = new THREE.Mesh(makeGeometry(new THREE.TorusGeometry(1.22, .026, 8, 128)), violet); irisRim.rotation.x = Math.PI / 2; groups[0].add(irisRim);
    const orbitGeometry = makeGeometry(new THREE.TorusGeometry(1.8, .105, 12, 128));
    for (let i = 0; i < 5; i++) { const ring = new THREE.Mesh(orbitGeometry, i === 2 ? violet : chrome); ring.rotation.set(i * .63, i * .47, i * .3); groups[1].add(ring); }
    groups[1].add(new THREE.Mesh(makeGeometry(new THREE.IcosahedronGeometry(.83, 3)), dark));
    const nodeGeometry = makeGeometry(new THREE.SphereGeometry(.105, 12, 8)), vectors = [], links = [];
    for (let i = 0; i < 42; i++) {
      const y = 1 - 2 * (i + .5) / 42, radius = Math.sqrt(1 - y * y), angle = i * 2.399963;
      const p = new THREE.Vector3(Math.cos(angle) * radius * 2.02, y * 2.02, Math.sin(angle) * radius * 2.02);
      vectors.push(p); const node = new THREE.Mesh(nodeGeometry, i % 7 === 0 ? violet : chrome); node.position.copy(p); groups[2].add(node);
    }
    vectors.forEach((a, i) => vectors.forEach((b, j) => { if (j > i && a.distanceTo(b) < 1.14) links.push(a, b); }));
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x7f738e, transparent: true, opacity: .5 }); materials.push(lineMaterial);
    groups[2].add(new THREE.LineSegments(makeGeometry(new THREE.BufferGeometry().setFromPoints(links)), lineMaterial));
    const innerNetwork = new THREE.Mesh(makeGeometry(new THREE.IcosahedronGeometry(1.16, 1)), new THREE.MeshBasicMaterial({ color: 0x9b85cd, wireframe: true, transparent: true, opacity: .18 }));
    materials.push(innerNetwork.material); groups[2].add(innerNetwork);
    const pedestal = new THREE.Group(); pedestal.position.y = -2.52; scene.add(pedestal);
    const baseMaterial = new THREE.LineBasicMaterial({ color: 0x4e4857, transparent: true, opacity: .2 }); materials.push(baseMaterial);
    for (let i = 0; i < 3; i++) {
      const points = Array.from({ length: 129 }, (_, j) => { const a = j / 128 * Math.PI * 2, r = 2.8 + i * .14; return new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r); });
      pedestal.add(new THREE.LineLoop(makeGeometry(new THREE.BufferGeometry().setFromPoints(points)), baseMaterial));
    }
    const shadowCanvas = document.createElement('canvas'); shadowCanvas.width = shadowCanvas.height = 128;
    const context = shadowCanvas.getContext('2d'), gradient = context.createRadialGradient(64, 64, 1, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(28,22,37,.28)'); gradient.addColorStop(1, 'rgba(28,22,37,0)'); context.fillStyle = gradient; context.fillRect(0, 0, 128, 128);
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas), shadowMaterial = new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false }); materials.push(shadowMaterial);
    const shadow = new THREE.Mesh(makeGeometry(new THREE.PlaneGeometry(6.5, 6.5)), shadowMaterial); shadow.rotation.x = -Math.PI / 2; shadow.position.y = -2.55; scene.add(shadow);
    let raf = 0, last = 0, time = 0, inView = true, lost = false, yaw = 0, dragX = null, targetX = 0, targetY = 0, impulse = 0, scrollDepth = 0, lastBurst = controls.current.burst;
    const canvas = renderer.domElement, weights = [0, 0, 0]; weights[controls.current.formation] = 1;
    const draw = (dt = 0) => {
      const state = controls.current, stopped = paused(), k = stopped || !dt ? 1 : 1 - Math.exp(-dt * 5);
      groups.forEach((g, i) => { weights[i] += ((i === state.formation ? 1 : 0) - weights[i]) * k; g.visible = weights[i] > .02; g.scale.setScalar(Math.max(.001, weights[i])); });
      if (!stopped) {
        root.rotation.y += (yaw + targetX + time * (.06 + state.energy * .13) - root.rotation.y) * Math.min(1, dt * 3);
        root.rotation.x += (.24 + targetY + scrollDepth * .22 - root.rotation.x) * Math.min(1, dt * 3);
        root.rotation.z = -.2 + Math.sin(time * .21) * .04; root.position.y = Math.sin(time * .6) * .08 + scrollDepth * .16;
      }
      root.scale.setScalar(1 + (stopped ? 0 : impulse * .12));
      blades.forEach((blade, i) => { const angle = i / 24 * Math.PI * 2, spread = stopped ? 0 : impulse * .65; blade.position.set(Math.cos(angle) * spread, Math.sin(time * .5 + i * .26) * state.energy * .035, Math.sin(angle) * spread); });
      groups[1].rotation.z = time * .08; groups[2].rotation.y = -time * .04; renderer.render(scene, camera);
    };
    const tick = now => { const dt = Math.min((now - last) / 1000 || .016, .05); last = now; time += dt; impulse *= Math.exp(-dt * 1.5); draw(dt); raf = requestAnimationFrame(tick); };
    const sync = () => { cancelAnimationFrame(raf); if (!lost) draw(); if (!paused() && inView && !document.hidden && !lost) { last = performance.now(); raf = requestAnimationFrame(tick); } };
    api.current = { update: () => { if (controls.current.burst !== lastBurst) { lastBurst = controls.current.burst; impulse = paused() ? 0 : 1; } if (paused()) draw(); } };
    const resize = () => { const w = mount.clientWidth || 600, h = mount.clientHeight || 600; camera.aspect = w / h; camera.position.z = w / h < .8 ? 12 : 10; camera.updateProjectionMatrix(); renderer.setSize(w, h); draw(); };
    const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(mount);
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; sync(); }); observer.observe(mount);
    const move = event => { if (paused() || event.pointerType === 'touch') return; const r = canvas.getBoundingClientRect(); targetX = ((event.clientX - r.left) / r.width - .5) * .5; targetY = ((event.clientY - r.top) / r.height - .5) * .25; if (dragX !== null) { yaw += (event.clientX - dragX) * .008; dragX = event.clientX; } };
    const down = event => { if (paused() || event.pointerType === 'touch') return; dragX = event.clientX; canvas.setPointerCapture(event.pointerId); };
    const up = () => { dragX = null; }, leave = () => { targetX = targetY = 0; };
    const contextLost = event => { event.preventDefault(); lost = true; mount.dataset.ready = 'false'; cancelAnimationFrame(raf); };
    const contextRestored = () => { lost = false; mount.dataset.ready = 'true'; sync(); };
    const scroll = () => { const hero = mount.closest('section'); scrollDepth = Math.max(0, Math.min(1, -hero.getBoundingClientRect().top / hero.clientHeight)); };
    const events = { pointermove: move, pointerdown: down, pointerup: up, pointercancel: up, pointerleave: leave, webglcontextlost: contextLost, webglcontextrestored: contextRestored };
    Object.entries(events).forEach(([name, handler]) => canvas.addEventListener(name, handler));
    window.addEventListener('scroll', scroll, { passive: true });
    window.addEventListener('portfolio-motion-change', sync); media.addEventListener('change', sync); document.addEventListener('visibilitychange', sync); resize(); sync();
    return () => {
      api.current = null; cancelAnimationFrame(raf); resizeObserver.disconnect(); observer.disconnect();
      window.removeEventListener('portfolio-motion-change', sync); media.removeEventListener('change', sync); document.removeEventListener('visibilitychange', sync);
      window.removeEventListener('scroll', scroll);
      Object.entries(events).forEach(([name, handler]) => canvas.removeEventListener(name, handler));
      geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose()); shadowTexture.dispose(); environment.dispose(); renderer.dispose(); canvas.remove();
    };
  }, []);
  return <div className="field-webgl" ref={mountRef} aria-hidden="true"/>;
}
