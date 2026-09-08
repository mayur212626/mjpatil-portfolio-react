import React, { useEffect, useRef } from 'react';

// Interactive particle-network canvas for the hero background.
// Dark base, drifting nodes, lines between nearby ones, gentle mouse repulsion.
// Pauses when the tab is hidden; respects reduced-motion.
const HeroBackground = () => {
  const ref = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf, W, H, particles = [];
    const mouse = { x: -9999, y: -9999 };

    const resize = () => {
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // density scales with area, capped for perf
      const count = Math.min(90, Math.floor((W * H) / 16000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.8 + 0.8,
      }));
    };
    resize();
    window.addEventListener('resize', resize);

    const onMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseout', onLeave);

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      // update + draw nodes
      for (const p of particles) {
        // mouse repulsion
        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 14000) {
          const f = (14000 - d2) / 14000 * 0.9;
          const d = Math.sqrt(d2) || 1;
          p.vx += (dx / d) * f * 0.15;
          p.vy += (dy / d) * f * 0.15;
        }
        p.x += p.vx; p.y += p.vy;
        p.vx *= 0.99; p.vy *= 0.99;
        // wrap
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 6.283);
        ctx.fillStyle = 'rgba(255,255,255,0.55)';
        ctx.fill();
      }
      // connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 15000) {
            const alpha = (1 - d2 / 15000);
            // tint lines toward red near the cursor
            const near = Math.min(a.x, b.x) > mouse.x - 200 && Math.max(a.x, b.x) < mouse.x + 200;
            ctx.strokeStyle = near
              ? `rgba(255,42,42,${alpha * 0.35})`
              : `rgba(255,255,255,${alpha * 0.12})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    const onVis = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else { cancelAnimationFrame(raf); draw(); }
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseout', onLeave);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-[#07080b]">
      {/* radial accent glows */}
      <div className="absolute -top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-[#ff2a2a]/10 blur-[130px]" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[130px]" />
      {/* faint grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:70px_70px] [mask-image:radial-gradient(ellipse_at_center,#000_40%,transparent_85%)]" />
      <canvas ref={ref} className="absolute inset-0 w-full h-full" />
    </div>
  );
};

export default HeroBackground;
