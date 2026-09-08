import React, { useEffect, useRef } from 'react';

// Colorful particle-network hero background with depth-of-field bokeh.
// Multi-color nodes (red / blue / orange / white), big soft foreground
// bokeh + small sharp background dots, connecting lines, mouse parallax.
// Pauses when hidden; respects reduced-motion.
const PALETTE = ['#ff2a2a', '#ff2a2a', '#ff3b3b', '#3b82f6', '#f59e0b', '#ffffff', '#ffffff'];

const HeroBackground = () => {
  const ref = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf, W, H, nodes = [], bokeh = [];
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

    const rand = (a, b) => a + Math.random() * (b - a);
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

    const build = () => {
      W = canvas.clientWidth || window.innerWidth;
      H = canvas.clientHeight || window.innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      mouse.x = mouse.tx = W / 2; mouse.y = mouse.ty = H / 2;

      // sharp connecting nodes
      const nCount = Math.min(80, Math.floor((W * H) / 17000));
      nodes = Array.from({ length: nCount }, () => {
        const z = rand(0.2, 1);           // depth: bigger/faster when near
        return {
          x: Math.random() * W, y: Math.random() * H,
          vx: rand(-0.35, 0.35), vy: rand(-0.35, 0.35),
          z, r: 0.8 + z * 2.2, color: pick(PALETTE),
        };
      });

      // soft out-of-focus bokeh (foreground blur)
      const bCount = Math.min(16, Math.floor((W * H) / 90000));
      bokeh = Array.from({ length: bCount }, () => {
        const z = rand(0.7, 1);
        return {
          x: Math.random() * W, y: Math.random() * H,
          vx: rand(-0.15, 0.15), vy: rand(-0.15, 0.15),
          z, r: rand(10, 30), color: pick(PALETTE), alpha: rand(0.12, 0.32),
        };
      });
    };
    build();
    window.addEventListener('resize', build);

    const onMove = (e) => { mouse.tx = e.clientX; mouse.ty = e.clientY; };
    window.addEventListener('mousemove', onMove);

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      // ease mouse for parallax
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      const px = (mouse.x - W / 2) / W;   // -0.5..0.5
      const py = (mouse.y - H / 2) / H;

      // ── bokeh layer (soft, behind) ──
      for (const b of bokeh) {
        b.x += b.vx; b.y += b.vy;
        if (b.x < -40) b.x = W + 40; if (b.x > W + 40) b.x = -40;
        if (b.y < -40) b.y = H + 40; if (b.y > H + 40) b.y = -40;
        const ox = px * b.z * 60, oy = py * b.z * 60; // parallax
        const g = ctx.createRadialGradient(b.x + ox, b.y + oy, 0, b.x + ox, b.y + oy, b.r);
        g.addColorStop(0, b.color + Math.round(b.alpha * 255).toString(16).padStart(2, '0'));
        g.addColorStop(1, b.color + '00');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(b.x + ox, b.y + oy, b.r, 0, 6.283);
        ctx.fill();
      }

      // ── connections ──
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], c = nodes[j];
          const dx = a.x - c.x, dy = a.y - c.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 16000) {
            const alpha = (1 - d2 / 16000) * 0.16;
            ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(a.x + px * a.z * 40, a.y + py * a.z * 40);
            ctx.lineTo(c.x + px * c.z * 40, c.y + py * c.z * 40);
            ctx.stroke();
          }
        }
      }

      // ── sharp nodes (colored, glowing) ──
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0) n.x = W; if (n.x > W) n.x = 0;
        if (n.y < 0) n.y = H; if (n.y > H) n.y = 0;
        const ox = px * n.z * 40, oy = py * n.z * 40;
        ctx.beginPath();
        ctx.arc(n.x + ox, n.y + oy, n.r, 0, 6.283);
        ctx.fillStyle = n.color;
        ctx.shadowColor = n.color;
        ctx.shadowBlur = 6 + n.z * 8;
        ctx.fill();
      }
      ctx.shadowBlur = 0;
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
      window.removeEventListener('resize', build);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-[#07080b]">
      {/* deep radial vignette so nodes pop */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_45%,#12131a_0%,#07080b_70%)]" />
      <canvas ref={ref} className="absolute inset-0 w-full h-full" />
      {/* keep text side readable */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#07080b]/85 via-[#07080b]/30 to-transparent" />
    </div>
  );
};

export default HeroBackground;
