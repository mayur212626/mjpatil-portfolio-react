import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { projects, socialLinks } from '../data/portfolioData';
import { projectStories } from '../data/projectStories';
import ProjectEvidence, { EvidenceSummary } from './ProjectEvidence';
import ProjectArtwork from './ProjectArtwork';
import FifaProject from './FifaProject';
const filters = ['All work', 'Data systems', 'Applied ML', 'GenAI', 'Sports forecasting'];
const category = project => project.id === 'fifa-wc2026-predictor' ? 'Sports forecasting' : projectStories[project.id].filter;
function ProjectLinks({ project }) {
  return <div className="project-links">{project.links.github && <a href={project.links.github} target="_blank" rel="noopener noreferrer">View code ↗</a>}{project.links.demo && <a className="demo-link" href={project.links.demo} target={project.links.demo.startsWith('#') ? undefined : '_blank'} rel={project.links.demo.startsWith('#') ? undefined : 'noopener noreferrer'}>Try demo ↗</a>}</div>;
}
function ProjectCard({ project }) {
  if (project.id === 'fifa-wc2026-predictor') return <FifaProject project={project}/>;
  const story = projectStories[project.id];
  return <article id={`project-${project.id}`} className="project-panel" style={{ '--project-accent': story.accent }} aria-labelledby={`${project.id}-title`}>
    <ProjectArtwork project={project}/>
    <div className="project-overview"><p className="eyebrow"><span>{project.number}</span> / Behind the experiment</p><p className="project-summary">{project.description}</p><ul className="tech-tags" aria-label="Technologies">{project.techTags.slice(0, 4).map(tag => <li key={tag}>{tag}</li>)}</ul><EvidenceSummary projectId={project.id}/><ProjectLinks project={project} /></div>
    <ProjectEvidence projectId={project.id} title={project.title}/>
    <details className="case-study"><summary><span>Inside the project</span><span className="case-hint">Problem / decisions / limitations</span><span className="case-plus" aria-hidden="true">+</span></summary><div className="case-body">{[['01 / The problem',story.challenge],['02 / Design decisions',story.decisions],['03 / What to know',story.limits]].map(([title,text]) => <div key={title}><h4>{title}</h4><p>{text}</p></div>)}</div></details>
  </article>;
}
export default function Projects() {
  const [filter, setFilter] = useState('All work');
  const selected = projects.slice(0, 4);
  useEffect(() => {
    const revealTarget = id => {
      if (id.startsWith('project-')) {
        flushSync(() => setFilter('All work'));
        document.getElementById(id)?.scrollIntoView({ block: 'start', behavior: 'instant' });
      }
    };
    const hashChange = () => revealTarget(window.location.hash.slice(1));
    const selectProject = event => {
      window.history.pushState(null, '', `#${event.detail}`);
      revealTarget(event.detail);
    };
    window.addEventListener('hashchange', hashChange);
    window.addEventListener('portfolio:project', selectProject);
    return () => { window.removeEventListener('hashchange', hashChange); window.removeEventListener('portfolio:project', selectProject); };
  }, []);
  // Cards remain mounted so direct project links and expanded case studies survive filtering.
  return <section id="projects" className="selected-work"><div className="section-shell">
    <div className="section-heading"><div><p className="eyebrow">01 / The work archive</p><h2>Ideas, put<br/><span>to the test.</span></h2></div><p>Four explorations at the intersection of data, models, and useful systems. Step inside the work, then inspect the evidence.</p></div>
    <div className="project-toolbar"><div className="work-filters" role="group" aria-label="Filter featured projects">{filters.map(item => <button type="button" key={item} aria-pressed={filter === item} onClick={() => setFilter(item)}>{item}</button>)}</div><span className="result-count" aria-live="polite">{String(selected.filter(project => filter === 'All work' || category(project) === filter).length).padStart(2, '0')} featured {filter === 'All work' ? 'projects' : 'project'}</span></div>
    <div className="featured-projects">{selected.map(project => <div key={project.id} hidden={filter !== 'All work' && category(project) !== filter}><ProjectCard project={project} /></div>)}</div>
    {filter !== 'All work' && <button className="reset-filter" type="button" onClick={() => setFilter('All work')}>Show all featured projects →</button>}
    <details className="more-projects"><summary>More explorations <span>Forecasting & distributed data</span></summary><div className="additional-projects">{projects.slice(4).map(project => <article key={project.id}><h3>{project.title}</h3><p>{project.description}</p><ProjectLinks project={project} />{!project.links.github && <p className="proof-note">Repository link coming soon.</p>}</article>)}</div></details>
    <a className="all-repos" href={socialLinks.github} target="_blank" rel="noopener noreferrer">Explore all repositories ↗</a>
  </div></section>;
}
