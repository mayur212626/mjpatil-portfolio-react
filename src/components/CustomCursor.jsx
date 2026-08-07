import React, { useEffect, useRef, useState } from 'react';

// Glowing dot + lagging ring. Ring springs behind the dot and grows on
// hovering links/buttons. Hidden on touch devices (no cursor there).
const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [enabled, setEnabled] = useState(false);

  // 1) Decide whether to enable (mouse devices only) — mounts the cursor divs.
  useEffect(() => {
    if (window.matchMedia('(pointer: fine)').matches) setEnabled(true);
  }, []);

  // 2) Once enabled (divs rendered, refs valid), run the animation.
  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;
    let raf;

    const onMove = (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    };

    const loop = () => {
      // ring eases toward the dot (spring lag)
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    loop();

    const grow = () => ring.classList.add('cursor-grow');
    const shrink = () => ring.classList.remove('cursor-grow');
    const press = () => ring.classList.add('cursor-press');
    const release = () => ring.classList.remove('cursor-press');

    const bindHover = () => {
      document.querySelectorAll('a, button, [role="button"], input[type="range"], .cursor-target').forEach((el) => {
        el.addEventListener('mouseenter', grow);
        el.addEventListener('mouseleave', shrink);
      });
    };
    bindHover();
    // rebind after a moment for late-mounted nodes
    const rebind = setTimeout(bindHover, 1500);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', press);
    window.addEventListener('mouseup', release);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(rebind);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', press);
      window.removeEventListener('mouseup', release);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
};

export default CustomCursor;
