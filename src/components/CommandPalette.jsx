import React, { useState, useEffect, useRef, useCallback } from 'react';
import { personalInfo, socialLinks } from '../data/portfolioData';

// ⌘K / Ctrl+K command palette with a hidden terminal mode.
const NAV_COMMANDS = [
  { label: 'Go to Home', hint: '#home', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
  { label: 'Go to About', hint: '#about', href: '#about' },
  { label: 'Go to Skills', hint: '#skills', href: '#skills' },
  { label: 'Go to Projects', hint: '#projects', href: '#projects' },
  { label: 'Try Live ML Demo', hint: '#demo', href: '#demo' },
  { label: 'Go to Research', hint: '#research', href: '#research' },
  { label: 'Go to Contact', hint: '#contact', href: '#contact' },
  { label: 'Download Resume', hint: 'PDF', action: () => { const a = document.createElement('a'); a.href = personalInfo.resumeUrl; a.download = ''; a.click(); } },
  { label: 'Open GitHub', hint: '↗', action: () => window.open(socialLinks.github, '_blank') },
  { label: 'Open LinkedIn', hint: '↗', action: () => window.open(socialLinks.linkedin, '_blank') },
  { label: 'Email Me', hint: '✉', action: () => { window.location.href = `mailto:${personalInfo.emails.primary}`; } },
  { label: 'Open Terminal', hint: '>_', terminal: true },
];

const TERM_RESPONSES = {
  help: 'commands: whoami · ls projects · skills · contact · resume · clear · exit',
  whoami: `${personalInfo.name} — ${personalInfo.title}\nM.S. Data Science @ GWU · ${personalInfo.location}`,
  'ls projects': 'anomaly-detection/     540x critical-error lift\nclinical-lab-predictor/  AUC-ROC 0.9618 · live API\nsignal-ai/             5-agent LLM pipeline\nstock-lstm/            MAPE 7.19% on SageMaker\nfifa-wc2026/           Bayesian Monte Carlo\nais-ships/             358K records · PySpark',
  ls: 'projects/  research/  skills/  resume.pdf',
  skills: 'Python · SQL · PySpark · PyTorch · Scikit-learn · XGBoost · AWS · MLflow · Docker · FastAPI',
  contact: `email: ${personalInfo.emails.primary}\ngithub: ${socialLinks.github}`,
  resume: '→ downloading resume…',
  sudo: 'nice try.',
  'rm -rf /': 'absolutely not.',
};

const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState('palette'); // palette | terminal
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const [termLines, setTermLines] = useState(['type `help` to explore']);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const filtered = NAV_COMMANDS.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  const close = useCallback(() => {
    setOpen(false); setQuery(''); setSelected(0); setMode('palette');
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === 'Escape') {
        close();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 30);
  }, [open, mode]);

  const runCommand = (cmd) => {
    if (cmd.terminal) { setMode('terminal'); setQuery(''); setTermLines(['type `help` to explore']); return; }
    close();
    if (cmd.href) {
      document.querySelector(cmd.href)?.scrollIntoView({ behavior: 'smooth' });
    } else if (cmd.action) {
      cmd.action();
    }
  };

  const runTerm = (raw) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;
    if (cmd === 'exit') { close(); return; }
    if (cmd === 'clear') { setTermLines([]); setQuery(''); return; }
    const out = TERM_RESPONSES[cmd] || `command not found: ${cmd} — try \`help\``;
    setTermLines((l) => [...l, `$ ${raw}`, out]);
    if (cmd === 'resume') {
      const a = document.createElement('a'); a.href = personalInfo.resumeUrl; a.download = ''; a.click();
    }
    setQuery('');
  };

  const onInputKey = (e) => {
    if (mode === 'terminal') {
      if (e.key === 'Enter') runTerm(query);
      return;
    }
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected((s) => Math.min(s + 1, filtered.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSelected((s) => Math.max(s - 1, 0)); }
    else if (e.key === 'Enter' && filtered[selected]) runCommand(filtered[selected]);
  };

  useEffect(() => { setSelected(0); }, [query]);
  useEffect(() => {
    listRef.current?.children[selected]?.scrollIntoView({ block: 'nearest' });
  }, [selected]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[18vh] px-4" onClick={close}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-xl bg-[#111318] border border-white/15 rounded-2xl shadow-[0_25px_80px_rgba(0,0,0,0.8)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {mode === 'palette' ? (
          <>
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
              <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" /></svg>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onInputKey}
                placeholder="Type a command…"
                className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/30"
              />
              <kbd className="text-[10px] text-white/40 border border-white/15 rounded px-1.5 py-0.5">esc</kbd>
            </div>
            <ul ref={listRef} className="max-h-72 overflow-y-auto py-2">
              {filtered.length === 0 && <li className="px-5 py-3 text-white/30 text-sm">No matches</li>}
              {filtered.map((c, i) => (
                <li
                  key={c.label}
                  onMouseEnter={() => setSelected(i)}
                  onClick={() => runCommand(c)}
                  className={`flex items-center justify-between px-5 py-2.5 text-sm cursor-pointer ${i === selected ? 'bg-[#ff2a2a]/15 text-white' : 'text-white/60'}`}
                >
                  <span>{c.label}</span>
                  <span className="text-[10px] font-mono text-white/30">{c.hint}</span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="font-mono text-[13px]">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/10 bg-white/5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
              <span className="text-white/40 text-xs ml-2">mayur@mjpatil.com — zsh</span>
            </div>
            <div className="px-4 py-3 max-h-72 overflow-y-auto whitespace-pre-wrap text-emerald-300/90 leading-relaxed">
              {termLines.map((l, i) => <div key={i}>{l}</div>)}
              <div className="flex items-center gap-2 text-white">
                <span className="text-[#ff2a2a]">$</span>
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onInputKey}
                  className="flex-1 bg-transparent outline-none text-white"
                  spellCheck={false}
                  autoComplete="off"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommandPalette;
