import React, { useState } from 'react';

const API = 'https://clinical-lab-predictor.onrender.com';

// Field config: [key, label, min, max, step, default]
const FIELDS = [
  ['glucose', 'Glucose (mg/dL)', 44, 400, 1, 117],
  ['bmi', 'BMI (kg/m²)', 10, 70, 0.1, 32.0],
  ['age', 'Age (years)', 18, 120, 1, 29],
  ['blood_pressure', 'Diastolic BP (mm Hg)', 20, 200, 1, 72],
  ['insulin', 'Insulin (μU/mL)', 0, 900, 1, 80],
  ['skin_thickness', 'Skin fold (mm)', 0, 100, 1, 23],
  ['diabetes_pedigree', 'Pedigree function', 0, 3, 0.01, 0.47],
  ['pregnancies', 'Pregnancies', 0, 20, 1, 2],
];

const PRESETS = {
  'Healthy adult': { glucose: 95, bmi: 22.5, age: 27, blood_pressure: 68, insulin: 60, skin_thickness: 18, diabetes_pedigree: 0.2, pregnancies: 0 },
  'Borderline': { glucose: 140, bmi: 31, age: 45, blood_pressure: 82, insulin: 130, skin_thickness: 28, diabetes_pedigree: 0.6, pregnancies: 3 },
  'High risk': { glucose: 196, bmi: 39.5, age: 58, blood_pressure: 92, insulin: 280, skin_thickness: 38, diabetes_pedigree: 1.4, pregnancies: 7 },
};

const riskColor = (level) =>
  level === 'HIGH' ? '#6366f1' : level === 'MEDIUM' ? '#f59e0b' : '#22c55e';

const LiveDemo = () => {
  const [values, setValues] = useState(
    Object.fromEntries(FIELDS.map(([k, , , , , d]) => [k, d]))
  );
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | waking | loading | done | error

  const setField = (k, v) => setValues((p) => ({ ...p, [k]: v }));
  const applyPreset = (p) => { setValues(PRESETS[p]); setResult(null); setStatus('idle'); };

  const predict = async () => {
    setStatus('loading');
    setResult(null);
    const body = JSON.stringify(
      Object.fromEntries(Object.entries(values).map(([k, v]) => [k, Number(v)]))
    );
    // Render free tier sleeps — first call may take ~50s. Warn user if slow.
    const slowTimer = setTimeout(() => setStatus('waking'), 4000);
    try {
      const res = await fetch(`${API}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
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

  const pct = result ? Math.round(result.probability * 100) : 0;

  return (
    <section id="demo" className="bg-[#0a0a0a] py-24 px-6 md:px-12 w-full relative overflow-hidden font-sans bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:80px_80px]">
      <div className="max-w-6xl mx-auto relative z-20">
        {/* Header */}
        <div data-aos="fade-up" className="mb-14 text-center">
          <div className="inline-block border border-white/20 rounded-full px-5 py-1.5 text-sm text-white/60 font-bold mb-6 bg-white/5 backdrop-blur-sm">
            Live ML Demo
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4 uppercase">
            Try My Deployed Model
          </h2>
          <p className="text-white/50 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            This calls my real diabetes-risk model — Random Forest + PyTorch, AUC-ROC 0.96 — live on its FastAPI service. Move the sliders, hit predict.
          </p>
          <p className="text-white/30 text-xs mt-2">Research prototype · not medical advice</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Inputs */}
          <div data-aos="fade-right" className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
            {/* Presets */}
            <div className="flex flex-wrap gap-2 mb-6">
              {Object.keys(PRESETS).map((p) => (
                <button
                  key={p}
                  onClick={() => applyPreset(p)}
                  className="px-4 py-1.5 rounded-full text-xs font-bold border border-white/20 text-white/70 hover:border-[#6366f1] hover:text-white transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
              {FIELDS.map(([k, label, min, max, step]) => (
                <div key={k}>
                  <div className="flex justify-between mb-1">
                    <label className="text-white/60 text-xs font-bold uppercase tracking-wider">{label}</label>
                    <span className="text-white text-xs font-mono">{values[k]}</span>
                  </div>
                  <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={values[k]}
                    onChange={(e) => setField(k, e.target.value)}
                    className="w-full accent-[#6366f1] cursor-pointer"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={predict}
              disabled={status === 'loading' || status === 'waking'}
              className="mt-8 w-full py-3.5 rounded-full bg-[#6366f1] text-white font-black tracking-wide uppercase text-sm hover:bg-[#4f46e5] hover:scale-[1.02] transition-all disabled:opacity-60 disabled:hover:scale-100"
            >
              {status === 'loading' ? 'Predicting…' : status === 'waking' ? 'Waking model up (free tier)…' : 'Predict Risk'}
            </button>
          </div>

          {/* Result */}
          <div data-aos="fade-left" className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 min-h-[320px] flex flex-col items-center justify-center text-center">
            {status === 'error' && (
              <p className="text-white/60 text-sm">API unreachable — the free-tier host may be cold. Try again in ~30s.</p>
            )}
            {(status === 'idle' || status === 'loading' || status === 'waking') && !result && (
              <div className="text-white/40 text-sm leading-relaxed">
                {status === 'idle' ? (
                  <>Prediction appears here.<br />Powered by <span className="text-white/70 font-mono">clinical-lab-predictor</span> · FastAPI · Docker · Render</>
                ) : (
                  <span className="animate-pulse">Calling live model…{status === 'waking' && <><br /><span className="text-xs">cold start can take ~1 min</span></>}</span>
                )}
              </div>
            )}
            {result && (
              <>
                {/* Gauge */}
                <div className="relative w-44 h-44 mb-6">
                  <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                    <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
                    <circle
                      cx="60" cy="60" r="52" fill="none"
                      stroke={riskColor(result.risk_level)}
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={`${(pct / 100) * 326.7} 326.7`}
                      style={{ transition: 'stroke-dasharray 0.8s ease' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-white text-4xl font-black">{pct}%</span>
                    <span className="text-white/50 text-[10px] uppercase tracking-widest">risk probability</span>
                  </div>
                </div>
                <span
                  className="px-5 py-1.5 rounded-full text-sm font-black tracking-widest uppercase"
                  style={{ color: riskColor(result.risk_level), border: `1px solid ${riskColor(result.risk_level)}55`, background: `${riskColor(result.risk_level)}15` }}
                >
                  {result.risk_level} RISK
                </span>
                <p className="text-white/30 text-xs mt-4 font-mono">
                  model v{result.model_version} · live response · {new Date(result.timestamp).toLocaleTimeString()}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveDemo;
