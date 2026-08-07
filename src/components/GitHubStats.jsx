import React, { useEffect, useState } from 'react';
import { socialLinks } from '../data/portfolioData';

// Live GitHub stats — fetched client-side from the public API (60 req/hr unauth is plenty).
const GitHubStats = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const user = socialLinks.github.split('/').pop();
    Promise.all([
      fetch(`https://api.github.com/users/${user}`).then((r) => (r.ok ? r.json() : null)),
      fetch(`https://api.github.com/users/${user}/repos?per_page=100`).then((r) => (r.ok ? r.json() : null)),
    ])
      .then(([u, repos]) => {
        if (!u || !Array.isArray(repos)) return;
        const stars = repos.reduce((s, r) => s + (r.stargazers_count || 0), 0);
        const langs = {};
        repos.forEach((r) => { if (r.language) langs[r.language] = (langs[r.language] || 0) + 1; });
        const topLang = Object.entries(langs).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';
        setStats({ repos: u.public_repos, followers: u.followers, stars, topLang });
      })
      .catch(() => {});
  }, []);

  if (!stats) return null; // silent if rate-limited/offline

  const items = [
    { n: stats.repos, l: 'Public Repos' },
    { n: stats.stars, l: 'GitHub Stars' },
    { n: stats.followers, l: 'Followers' },
    { n: stats.topLang, l: 'Top Language' },
  ];

  return (
    <div className="bg-[#0a0a0a] border-y border-white/5 py-8 px-6">
      <a
        href={socialLinks.github}
        target="_blank"
        rel="noopener noreferrer"
        className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-x-12 gap-y-4 group"
        title="Live from the GitHub API"
      >
        <svg className="w-6 h-6 text-white/40 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
        {items.map((it) => (
          <div key={it.l} className="text-center">
            <div className="text-white text-2xl font-black">{it.n}</div>
            <div className="text-white/40 text-[10px] uppercase tracking-widest font-bold">{it.l}</div>
          </div>
        ))}
        <span className="text-white/25 text-[10px] uppercase tracking-widest font-bold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
          live
        </span>
      </a>
    </div>
  );
};

export default GitHubStats;
