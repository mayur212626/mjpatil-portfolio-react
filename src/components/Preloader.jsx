import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { personalInfo } from '../data/portfolioData';

// Boot lines — typed out one by one. [text, status?]
const BOOT_LINES = [
  { t: `$ boot ${personalInfo.name.toLowerCase().replace(' ', '.')} --role "Data Scientist"`, c: 'cmd' },
  { t: '› initializing neural runtime .......... ok', c: 'dim' },
  { t: '› loading models ..................... ok', c: 'dim' },
  { t: '› anomaly-detection    540× lift', c: 'ok' },
  { t: '› clinical-predictor   AUC-ROC 0.9618', c: 'ok' },
  { t: '› signal-ai            recall 91.2%', c: 'ok' },
  { t: '› status: READY', c: 'ready' },
];

const COLORS = { cmd: '#e8eaf0', dim: '#6b7180', ok: '#4ade80', ready: '#ff2a2a' };

// ── Neural-network canvas background ────────────────────────────────
function NeuralCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    let raf, t = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    // layered nodes
    const W = () => window.innerWidth, H = () => window.innerHeight;
    const layers = [4, 6, 6, 4];
    const nodes = [];
    const build = () => {
      nodes.length = 0;
      const gapX = W() / (layers.length + 1);
      layers.forEach((count, li) => {
        const gapY = H() / (count + 1);
        for (let i = 0; i < count; i++) {
          nodes.push({ x: gapX * (li + 1), y: gapY * (i + 1), layer: li, i });
        }
      });
    };
    build();
    window.addEventListener('resize', build);

    const draw = () => {
      t += 1;
      ctx.clearRect(0, 0, W(), H());
      // connections
      for (const a of nodes) {
        for (const b of nodes) {
          if (b.layer === a.layer + 1) {
            const phase = (t * 0.02 + a.i * 0.4 + a.layer) % 6.283;
            const pulse = (Math.sin(phase) + 1) / 2;
            ctx.strokeStyle = `rgba(255, 42, 42, ${0.04 + pulse * 0.10})`;
            ctx.lineWidth = 0.6 + pulse * 0.8;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      // nodes
      for (const n of nodes) {
        const glow = (Math.sin(t * 0.05 + n.x * 0.01 + n.y * 0.01) + 1) / 2;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 2.5 + glow * 2, 0, 6.283);
        ctx.fillStyle = `rgba(255, ${80 + glow * 120}, ${80 + glow * 60}, ${0.5 + glow * 0.5})`;
        ctx.shadowColor = 'rgba(255,42,42,0.8)';
        ctx.shadowBlur = 8 + glow * 12;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); window.removeEventListener('resize', build); };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full opacity-60" />;
}

const Preloader = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [shown, setShown] = useState(0);
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (reduce) { setIsLoading(false); return; }
    // reveal lines one by one
    const perLine = 320;
    const timers = BOOT_LINES.map((_, i) =>
      setTimeout(() => setShown(i + 1), 350 + i * perLine)
    );
    const done = setTimeout(() => setIsLoading(false), 350 + BOOT_LINES.length * perLine + 700);
    // Skip on any interaction — never trap a visitor
    const skip = () => setIsLoading(false);
    window.addEventListener('keydown', skip);
    window.addEventListener('click', skip);
    return () => {
      timers.forEach(clearTimeout); clearTimeout(done);
      window.removeEventListener('keydown', skip);
      window.removeEventListener('click', skip);
    };
  }, [reduce]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="preloader"
          initial={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 1.0, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 w-full h-screen bg-[#07080b] z-[100000] flex items-center justify-center overflow-hidden"
        >
          <NeuralCanvas />
          {/* vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#07080b_85%)]" />

          {/* Terminal card */}
          <motion.div
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.35 }}
            className="relative z-10 w-[90%] max-w-lg font-mono text-[13px] md:text-sm"
          >
            {/* Boot bot mascot */}
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: 'backOut' }}
              className="flex justify-center mb-5"
            >
              <svg viewBox="0 0 120 128" className="boot-bot w-24 h-24 md:w-28 md:h-28" aria-hidden="true">
                {/* antenna */}
                <line x1="60" y1="22" x2="60" y2="8" stroke="#ff2a2a" strokeWidth="3" strokeLinecap="round" />
                <circle cx="60" cy="6" r="5" fill="#ff2a2a" className="bot-antenna" />
                {/* ears */}
                <rect x="16" y="42" width="9" height="20" rx="4.5" fill="#2a2d38" />
                <rect x="95" y="42" width="9" height="20" rx="4.5" fill="#2a2d38" />
                {/* head */}
                <rect x="24" y="22" width="72" height="60" rx="18" fill="#e8eaf0" stroke="#ff2a2a" strokeWidth="2" />
                {/* face screen */}
                <rect x="33" y="31" width="54" height="42" rx="12" fill="#0a0b0f" />
                {/* eyes */}
                <circle cx="49" cy="50" r="6.5" fill="#ff2a2a" className="bot-eye" />
                <circle cx="71" cy="50" r="6.5" fill="#ff2a2a" className="bot-eye" />
                {/* smile */}
                <path d="M49 62 Q60 69 71 62" stroke="#ff2a2a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                {/* neck + body hint */}
                <rect x="52" y="82" width="16" height="8" fill="#2a2d38" />
                <rect x="34" y="90" width="52" height="26" rx="12" fill="#e8eaf0" stroke="#ff2a2a" strokeWidth="2" />
                <circle cx="60" cy="103" r="5" fill="#ff2a2a" className="bot-antenna" />
              </svg>
            </motion.div>
            <div className="flex items-center gap-2 mb-4 opacity-70">
              <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <span className="w-3 h-3 rounded-full bg-[#28c840]" />
              <span className="text-white/40 text-xs ml-2">mayur@mjpatil ~ %</span>
            </div>
            <div className="leading-relaxed">
              {BOOT_LINES.slice(0, shown).map((l, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ color: COLORS[l.c] }}
                  className={l.c === 'ready' ? 'font-black mt-2 tracking-wide' : ''}
                >
                  {l.t}
                  {l.c === 'ok' && <span className="text-emerald-400"> ✓</span>}
                </motion.div>
              ))}
              {/* blinking cursor */}
              {shown < BOOT_LINES.length && (
                <span className="inline-block w-2 h-4 bg-[#ff2a2a] align-middle animate-pulse ml-0.5" />
              )}
            </div>
            {/* name reveal under terminal once READY */}
            {shown >= BOOT_LINES.length && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-6 text-white font-black text-2xl md:text-3xl tracking-tight"
                style={{ fontFamily: 'inherit' }}
              >
                {personalInfo.brandName}<span className="text-[#ff2a2a]">.</span>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
