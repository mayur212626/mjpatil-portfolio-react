import { useState } from 'react';

// Live call to the deployed Log Anomaly Detection API (project 01).
// Isolation Forest ensemble scores a single IP-behavior record → anomaly
// flag + severity. Endpoint: POST /score (see api/main.py, LogEntry schema).
const API = 'https://anomaly-detection-z5fp.onrender.com';

// Three realistic scenarios, each a full LogEntry the /score model expects.
const SCENARIOS = {
  'Normal traffic': {
    blurb: 'A logged-in user hitting a 200 endpoint at a human request rate.',
    entry: {
      ip: '10.0.4.21', hour: 14, status: 200, bytes: 8400,
      is_error: 0, is_critical: 0, is_4xx: 0, is_5xx: 0,
      is_admin: 0, is_empty: 0, is_large: 0, is_heavy: 0,
      ip_n_requests: 42, ip_error_rate: 0.02, ip_crit_rate: 0.0,
      ip_avg_bytes: 7600, ip_admin_hits: 0, ip_empty_rate: 0.01,
      hour_avg_rps: 120, bytes_z: 0.3, dos_signal: 0, admin_recon: 0,
    },
  },
  'DoS flood': {
    blurb: '15K requests from one IP, 5xx errors, empty bodies, traffic spike.',
    entry: {
      ip: '203.0.113.66', hour: 3, status: 503, bytes: 0,
      is_error: 1, is_critical: 1, is_4xx: 0, is_5xx: 1,
      is_admin: 0, is_empty: 1, is_large: 0, is_heavy: 1,
      ip_n_requests: 15000, ip_error_rate: 0.61, ip_crit_rate: 0.28,
      ip_avg_bytes: 90, ip_admin_hits: 0, ip_empty_rate: 0.44,
      hour_avg_rps: 6200, bytes_z: 4.1, dos_signal: 1, admin_recon: 0,
    },
  },
  'Admin recon': {
    blurb: 'Repeated /admin probes plus 4xx scanning: credential-hunting pattern.',
    entry: {
      ip: '198.51.100.9', hour: 2, status: 403, bytes: 512,
      is_error: 1, is_critical: 0, is_4xx: 1, is_5xx: 0,
      is_admin: 1, is_empty: 0, is_large: 0, is_heavy: 0,
      ip_n_requests: 6800, ip_error_rate: 0.72, ip_crit_rate: 0.05,
      ip_avg_bytes: 480, ip_admin_hits: 240, ip_empty_rate: 0.02,
      hour_avg_rps: 900, bytes_z: 1.2, dos_signal: 0, admin_recon: 1,
    },
  },
};

const SEV_COLOR = {
  CRITICAL: '#ff2a2a', HIGH: '#f59e0b', MEDIUM: '#eab308', NORMAL: '#22c55e',
};

const AnomalyLiveDemo = () => {
  const [scenario, setScenario] = useState('DoS flood');
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | loading | waking | done | error

  const score = async () => {
    setStatus('loading');
    setResult(null);
    // Render free tier sleeps — first call may take ~50s. Warn if slow.
    const slowTimer = setTimeout(() => setStatus('waking'), 4000);
    try {
      const res = await fetch(`${API}/score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(SCENARIOS[scenario].entry),
      });
      clearTimeout(slowTimer);
      if (!res.ok) throw new Error(`API ${res.status}`);
      setResult(await res.json());
      setStatus('done');
    } catch {
      clearTimeout(slowTimer);
      setStatus('error');
    }
  };

  const active = SCENARIOS[scenario];
  const sev = result?.severity;
  const sevColor = sev ? SEV_COLOR[sev] || '#888' : '#888';

  return (
    <section
      id="anomaly"
      className="bg-[#0a0a0a] py-24 px-6 md:px-12 w-full relative overflow-hidden font-sans bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:80px_80px]"
    >
      <div className="max-w-6xl mx-auto relative z-20">
        {/* Header */}
        <div data-aos="fade-up" className="mb-14 text-center">
          <div className="inline-block border border-white/20 rounded-full px-5 py-1.5 text-sm text-white/60 font-bold mb-6 bg-white/5 backdrop-blur-sm">
            Live ML Demo · Flagship Project
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4 uppercase">
            Score a Log for Anomalies
          </h2>
          <p className="text-white/50 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            This calls my real Log Anomaly Detection API, an Isolation Forest
            ensemble trained on 500K HTTP logs, 20 behavioral features per IP.
            Pick an attack scenario, hit score, see the live verdict.
          </p>
          <p className="text-white/30 text-xs mt-2">Research prototype · synthetic traffic</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Scenario picker */}
          <div data-aos="fade-right" className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
            <div className="flex flex-wrap gap-2 mb-6">
              {Object.keys(SCENARIOS).map((s) => (
                <button
                  key={s}
                  onClick={() => { setScenario(s); setResult(null); setStatus('idle'); }}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                    scenario === s
                      ? 'border-[#ff2a2a] text-white bg-[#ff2a2a]/10'
                      : 'border-white/20 text-white/70 hover:border-white/50 hover:text-white'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <p className="text-white/60 text-sm leading-relaxed mb-5">{active.blurb}</p>

            {/* Key features of the selected scenario */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-8">
              {[
                ['IP requests', active.entry.ip_n_requests.toLocaleString()],
                ['Error rate', `${Math.round(active.entry.ip_error_rate * 100)}%`],
                ['Status', active.entry.status],
                ['Req/s (hour)', active.entry.hour_avg_rps.toLocaleString()],
                ['Admin hits', active.entry.ip_admin_hits],
                ['DoS signal', active.entry.dos_signal ? 'yes' : 'no'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-white/40 text-xs uppercase tracking-wider">{k}</span>
                  <span className="text-white text-xs font-mono">{v}</span>
                </div>
              ))}
            </div>

            <button
              onClick={score}
              disabled={status === 'loading' || status === 'waking'}
              className="w-full py-3.5 rounded-full bg-[#ff2a2a] text-white font-black tracking-wide uppercase text-sm hover:bg-[#e02020] hover:scale-[1.02] transition-all disabled:opacity-60 disabled:hover:scale-100"
            >
              {status === 'loading' ? 'Scoring…' : status === 'waking' ? 'Waking model up (free tier)…' : 'Score This Traffic'}
            </button>
          </div>

          {/* Result */}
          <div data-aos="fade-left" className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 min-h-[340px] flex flex-col items-center justify-center text-center">
            {status === 'error' && (
              <p className="text-white/60 text-sm">API unreachable. The free-tier host may be cold; try again in ~30s.</p>
            )}
            {(status === 'idle' || status === 'loading' || status === 'waking') && !result && (
              <div className="text-white/40 text-sm leading-relaxed">
                {status === 'idle' ? (
                  <>Verdict appears here.<br />Powered by <span className="text-white/70 font-mono">anomaly-detection</span> · Isolation Forest · FastAPI · Render</>
                ) : (
                  <span className="animate-pulse">Calling live model…{status === 'waking' && <><br /><span className="text-xs">cold start can take ~1 min</span></>}</span>
                )}
              </div>
            )}
            {result && (
              <>
                <span
                  className="px-6 py-2 rounded-full text-base font-black tracking-widest uppercase mb-6"
                  style={{ color: sevColor, border: `1px solid ${sevColor}55`, background: `${sevColor}15` }}
                >
                  {sev} {result.anomaly ? '· ANOMALY' : ''}
                </span>

                <div className="flex items-center gap-3 mb-6">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ background: result.anomaly ? '#ff2a2a' : '#22c55e' }}
                  />
                  <span className="text-white text-lg font-bold">
                    {result.anomaly ? 'Flagged as anomalous' : 'Looks normal'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
                  {[
                    ['Anomaly score', result.score],
                    ['Verdict', result.anomaly ? '−1' : '+1'],
                  ].map(([label, val]) => (
                    <div key={label} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                      <div className="text-white text-xl font-black font-mono">{val}</div>
                      <div className="text-white/40 text-[10px] uppercase tracking-widest mt-1">{label}</div>
                    </div>
                  ))}
                </div>

                <p className="text-white/30 text-xs mt-6 font-mono">
                  live response · {result.ts ? new Date(result.ts).toLocaleTimeString() : ''}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnomalyLiveDemo;
