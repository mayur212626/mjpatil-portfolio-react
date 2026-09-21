import { useEffect, useRef } from 'react';

/**
 * Pre-warms a sleeping Render free-tier service before the user interacts.
 *
 * Render free instances spin down after ~15 min idle; the next request pays a
 * ~45s cold-start boot. We can't keep them warm with a 24/7 cron (750 shared
 * instance-hours/month would be blown by two always-on services), so instead we
 * fire one fire-and-forget request the moment the demo section approaches the
 * viewport. The container boots while the visitor is still reading and choosing
 * inputs, so their eventual Predict/Score click hits a warm service.
 *
 * @param {string} apiBase  Origin of the API, e.g. https://foo.onrender.com
 * @returns {import('react').RefObject} ref to attach to the demo section
 */
export default function useApiWarmup(apiBase) {
  const ref = useRef(null);
  const firedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || firedRef.current) return;

    const warm = () => {
      if (firedRef.current) return;
      firedRef.current = true;
      // Any request boots the dyno — route/status don't matter. Opaque + keepalive
      // so it survives navigation and never blocks or errors the page.
      fetch(`${apiBase}/`, { mode: 'no-cors', cache: 'no-store', keepalive: true }).catch(() => {});
    };

    // No IntersectionObserver (old browser) → just warm on mount.
    if (typeof IntersectionObserver === 'undefined') {
      warm();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          warm();
          io.disconnect();
        }
      },
      // Start warming ~1.5 viewports early so the boot overlaps the scroll.
      { rootMargin: '1500px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [apiBase]);

  return ref;
}
