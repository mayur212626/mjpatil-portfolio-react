import { useEffect, useRef, useState } from 'react';
import { personalInfo, socialLinks } from '../data/portfolioData';
const entries = [
  { title:'Home', detail:'Interactive architecture explorer', href:'#home' },
  { title:'Selected projects', detail:'Log anomalies, clinical ML, and SIGNAL case studies', href:'#projects' },
  { title:'About Mayur', detail:'Background and education', href:'#about' },
  { title:'Technical toolkit', detail:'Languages, frameworks, and methods', href:'#skills' },
  { title:'Clinical model demo', detail:'Explore diabetes-risk research', href:'#demo' },
  { title:'Anomaly detection demo', detail:'Score synthetic HTTP traffic', href:'#anomaly' },
  { title:'Experience', detail:'Cybersecurity internship at Academor', href:'#experience' },
  { title:'Research', detail:'Data security and gesture recognition papers', href:'#research' },
  { title:'Contact', detail:'Email and collaboration inquiries', href:'#contact' },
  { title:'Download résumé', detail:'PDF', href:personalInfo.resumeUrl, download:true },
  { title:'GitHub', detail:'Explore all repositories', href:socialLinks.github, external:true },
];
export default function CommandPalette() {
  const dialog = useRef(null);
  const input = useRef(null);
  const [query, setQuery] = useState('');
  const filtered = entries.filter(item => `${item.title} ${item.detail}`.toLowerCase().includes(query.toLowerCase()));
  useEffect(() => {
    function open() { if (!dialog.current.open) { setQuery(''); dialog.current.showModal(); input.current.focus(); } }
    function shortcut(event) { if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); if (dialog.current.open) dialog.current.close(); else open(); } }
    window.addEventListener('portfolio:search', open); window.addEventListener('keydown', shortcut);
    return () => { window.removeEventListener('portfolio:search', open); window.removeEventListener('keydown', shortcut); };
  }, []);
  return <dialog ref={dialog} className="quick-search" aria-labelledby="search-title" onClick={event => { if (event.target === dialog.current) { const box = dialog.current.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.current.close(); } }}>
    <div className="search-heading"><h2 id="search-title">Jump to anything</h2><button type="button" onClick={() => dialog.current.close()} aria-label="Close quick navigation">Esc ×</button></div><label className="sr-only" htmlFor="site-search">Search sections and projects</label><input ref={input} id="site-search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Try ‘anomaly’, ‘résumé’, or ‘contact’…" autoComplete="off" />
    <div className="search-results">{filtered.map(item => <a key={item.title} href={item.href} download={item.download || undefined} target={item.external ? '_blank' : undefined} rel={item.external ? 'noopener noreferrer' : undefined} onClick={() => dialog.current.close()}><span><strong>{item.title}</strong><small>{item.detail}</small></span><span aria-hidden="true">↗</span></a>)}{!filtered.length && <p className="search-empty" role="status">No matches. Try a project topic or section name.</p>}</div><p className="search-tip">Tab to browse · Enter to open · Esc to close</p>
  </dialog>;
}
