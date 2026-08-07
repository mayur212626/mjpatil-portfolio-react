import React, { useEffect, useState } from 'react';

// Thin gradient progress bar pinned to the very top of the viewport.
const ScrollProgress = () => {
  const [p, setP] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setP(max > 0 ? (h.scrollTop / max) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-[3px] z-[90] pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#d946ef]"
        style={{ width: `${p}%`, transition: 'width 80ms linear' }}
      />
    </div>
  );
};

export default ScrollProgress;
