import { createServer } from 'vite';
import react from '@vitejs/plugin-react';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const origin = 'https://mjpatil.com';
const fifaStory = {
  challenge: 'Express uncertainty in international football results and simulate tournament progression.',
  decisions: 'Use Elo as a reference, Dixon-Coles match probabilities, Monte Carlo tournament simulation, and a separate Bayesian uncertainty experiment. Backtests use training cutoffs before the 2018 and 2022 tournaments.',
  limits: 'The June 12, 2026 forecast came after opening day on June 11. It is an opening-tournament forecast. Models omit injuries and lineups and simplify shootouts. The Bayesian comparison uses a different training window.',
};
const evidence = {
  'anomaly-detection': '500K synthetic HTTP log records. The deployed Isolation Forest API returned a Critical verdict and a -0.1861 anomaly score for the synthetic DoS preset captured October 14, 2026. This is a serving demonstration, not an accuracy benchmark.',
  'clinical-lab-predictor': 'Independent Random Forest baseline: ROC AUC 0.822 and accuracy 75.3% on 154 held-out records. Stratified 80/20 split and training-only preprocessing. This baseline is separate from the deployed model; research only.',
  'signal-ai': 'Five specialized agents and six sample transcripts documented in the repository. A human-reviewed quality benchmark has not been published.',
  'fifa-wc2026-predictor': 'Repository-reported Brier scores: 0.566 for the 2018 World Cup and 0.614 for 2022, with 64 matches per tournament. Lower is better. These saved reports have not been independently rerun for this portfolio.',
};
const reportLinks = {
  'anomaly-detection': '/evidence/verification-notes.md',
  'clinical-lab-predictor': '/evidence/clinical-evaluation.json',
  'signal-ai': 'https://github.com/mayur212626/signal-ai/blob/c42789dfd0ed25f948dafc1185790af13cda9248/pipeline/agents.py',
  'fifa-wc2026-predictor': 'https://github.com/mayur212626/fifa-wc2026-predictor/blob/46df68dba0166ac4078666249a3f0ac8e1e6860a/reports/backtest_summary.csv',
};

export default function searchPages() {
  let root, outDir;
  return {
    name: 'portfolio-search-pages',
    apply: 'build',
    configResolved(config) { root = config.root; outDir = resolve(root, config.build.outDir); },
    async closeBundle() {
      const server = await createServer({root, configFile: false, mode: 'production', plugins: [react()], server: {middlewareMode: true}, appType: 'custom'});
      try {
        const [{default: App}, {projects}, {projectStories}] = await Promise.all([
          server.ssrLoadModule('/src/App.jsx'), server.ssrLoadModule('/src/data/portfolioData.js'), server.ssrLoadModule('/src/data/projectStories.js'),
        ]);
        const htmlPath = resolve(outDir, 'index.html');
        let html = await readFile(htmlPath, 'utf8');
        let rendered = renderToString(createElement(App));
        // The lazy WebGL scene mounts in the browser; do not publish React's SSR diagnostic template.
        rendered = rendered.replace(/<template[\s\S]*?<\/template>/g, '');
        await mkdir(resolve(outDir, 'images'), {recursive:true});
        await copyFile(resolve(root, 'src/assets/about/avatar.png'), resolve(outDir, 'images/mayur-patil.png'));
        if (!rendered.includes('id="projects"') || !rendered.includes('Mayur')) throw new Error('Homepage prerender failed');
        html = html.replace('<div id="root"></div>', `<div id="root">${rendered}</div>`);
        await writeFile(htmlPath, html);
        const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
        const person = schema['@graph'].find(item => item['@type'] === 'Person');
        const featured = projects.slice(0, 4);
        for (const project of featured) {
          const story = projectStories[project.id] || fifaStory;
          const url = `${origin}/projects/${project.id}/`;
          const description = `${project.title} by Mayur Patil. ${project.description}`;
          const structured = {'@context':'https://schema.org','@graph':[person, {'@type':'WebPage','@id':url, url, name:`${project.title} | Mayur Patil`, description, mainEntity:{'@id':`${url}#project`}}, {'@type':'CreativeWork','@id':`${url}#project`, name:project.title, description:project.description, url, author:{'@id':person['@id']}, sameAs:project.links.github}]};
          const sections = [['The problem',story.challenge],['How it works',story.decisions],['Evidence and evaluation',evidence[project.id]],['Limitations',story.limits]];
          const page = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escape(project.title)} | Mayur Patil</title><meta name="description" content="${escape(description)}"><link rel="canonical" href="${url}"><meta name="robots" content="index,follow,max-image-preview:large"><link rel="icon" href="/favicon.svg"><meta property="og:title" content="${escape(project.title)} | Mayur Patil"><meta property="og:description" content="${escape(description)}"><meta property="og:url" content="${url}"><meta property="og:type" content="article"><meta property="og:image" content="${origin}/og.png"><script type="application/ld+json">${JSON.stringify(structured).replaceAll('<','\\u003c')}</script><style>
          *{box-sizing:border-box}body{margin:0;background:#eeede8;color:#25242a;font-family:system-ui,sans-serif;line-height:1.75}a{color:#695186;text-underline-offset:5px}a:focus-visible{outline:2px solid #695186;outline-offset:5px}header,main,footer{max-width:960px;margin:auto;padding:28px}header{display:flex;justify-content:space-between;border-bottom:1px solid #25242a25;gap:20px}header a:first-child{font-weight:700;color:#25242a}main{padding-top:65px}h1{font-size:clamp(36px,6vw,64px);line-height:1.1;letter-spacing:-.045em;font-weight:550;margin:20px 0 28px}h2{font-size:25px;font-weight:550}.eyebrow{font:12px ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#695186}.intro{font-size:20px;max-width:760px}.tags{display:flex;flex-wrap:wrap;gap:10px;list-style:none;padding:0;margin:28px 0 45px}.tags li{border:1px solid #69518630;border-radius:20px;padding:5px 15px;font-size:13px}section{padding:22px 0;border-top:1px solid #25242a20}.actions{display:flex;flex-wrap:wrap;gap:22px;margin:35px 0}footer{border-top:1px solid #25242a20;color:#625d69;font-size:14px}footer nav{display:flex;flex-wrap:wrap;gap:20px}@media(max-width:500px){header,main,footer{padding:22px}main{padding-top:35px}.intro{font-size:17px}}
          </style></head><body><header><a href="/">Mayur Patil.</a><a href="/#projects">All featured work ↗</a></header><main><p class="eyebrow">Project / ${escape(project.number)} / Mayur Patil</p><h1>${escape(project.title)}</h1><p class="intro">${escape(project.description)}</p><ul class="tags" aria-label="Technologies">${project.techTags.map(tag=>`<li>${escape(tag)}</li>`).join('')}</ul>${sections.map(([heading,text])=>`<section><h2>${escape(heading)}</h2><p>${escape(text)}</p></section>`).join('')}<div class="actions"><a href="${escape(project.links.github)}">View source repository ↗</a><a href="${reportLinks[project.id]}">Inspect evidence ↗</a><a href="/${project.links.demo?.startsWith('#') ? project.links.demo : `#project-${project.id}`}">Explore interactive portfolio ↗</a>${project.links.demo?.startsWith('https://') ? `<a href="${escape(project.links.demo)}">Open live dashboard ↗</a>` : ''}</div><section><h2>About the author</h2><p>Mayur Patil is a data scientist and ML engineer pursuing an M.S. in Data Science at The George Washington University, based in Falls Church, Virginia. His work spans data engineering, applied ML, language models, and sports forecasting.</p><a href="/#about">More about Mayur Patil ↗</a></section></main><footer><nav aria-label="Other case studies">${featured.filter(other=>other.id!==project.id).map(other=>`<a href="/projects/${other.id}/">${escape(other.title)}</a>`).join('')}</nav><p><a href="/">Mayur Patil portfolio</a> · Data science and ML engineering</p></footer></body></html>`;
          const directory = resolve(outDir, 'projects', project.id);
          await mkdir(directory,{recursive:true});
          await writeFile(resolve(directory,'index.html'),page);
        }
        await writeFile(resolve(outDir, '404.html'), '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>Page not found | Mayur Patil</title></head><body><h1>Page not found</h1><p>This page does not exist.</p><a href="/">Return to Mayur Patil portfolio</a></body></html>');
        const urls = [origin+'/', ...featured.map(project=>`${origin}/projects/${project.id}/`), origin+'/Mayur_Patil_Resume.pdf'];
        await writeFile(resolve(outDir,'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${urls.map(url=>`<url><loc>${url}</loc>${url === origin+'/' ? `<image:image><image:loc>${origin}/images/mayur-patil.png</image:loc></image:image>` : ''}</url>`).join('')}</urlset>\n`);
        console.log(`Prerendered homepage and ${featured.length} static project case studies.`);
      } finally { await server.close(); }
    },
  };
}
