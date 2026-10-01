import { useState } from 'react';
import { projects, socialLinks } from '../data/portfolioData';
import { projectStories } from '../data/projectStories';
const filters = ['All work', 'Data systems', 'Applied ML', 'GenAI'];
function ProjectLinks({ project }) {
  return <div className="project-links">{project.links.github && <a href={project.links.github} target="_blank" rel="noopener noreferrer">View code ↗</a>}{project.links.demo && <a className="demo-link" href={project.links.demo} target={project.links.demo.startsWith('#') ? undefined : '_blank'} rel={project.links.demo.startsWith('#') ? undefined : 'noopener noreferrer'}>Try demo ↗</a>}</div>;
}
function ProjectCard({ project }) {
  const story = projectStories[project.id];
  return <article id={`project-${project.id}`} className="project-panel" style={{ '--project-accent': story.accent }} aria-labelledby={`${project.id}-title`}>
    <div className="project-overview"><p className="eyebrow"><span>{project.number}</span> / {project.category}</p><h3 id={`${project.id}-title`}>{project.title}</h3><p className="project-summary">{project.description}</p><ul className="tech-tags" aria-label="Technologies">{project.techTags.slice(0, 4).map(tag => <li key={tag}>{tag}</li>)}</ul><ProjectLinks project={project} /></div>
    <div className="project-proof"><p className="eyebrow">{project.proofLabel}</p><p className="project-result">{project.result}</p><p className="proof-note">{project.resultContext}</p><ol className="pipeline" aria-label="Project pipeline">{project.pipeline.map((stage, i) => <li key={stage}><span className="pipeline-dot" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>{stage}</li>)}</ol><a className="evidence-link" href={`${project.links.github}#readme`} target="_blank" rel="noopener noreferrer">Read project documentation ↗</a></div>
    <details className="case-study"><summary><span>Inside the project</span><span className="case-hint">Problem / decisions / limitations</span><span className="case-plus" aria-hidden="true">+</span></summary><div className="case-body">{[['01 / The problem',story.challenge],['02 / Design decisions',story.decisions],['03 / What to know',story.limits]].map(([title,text]) => <div key={title}><h4>{title}</h4><p>{text}</p></div>)}</div></details>
  </article>;
}
export default function Projects() {
  const [filter, setFilter] = useState('All work');
  const selected = projects.slice(0, 3);
  // Cards remain mounted so direct project links and expanded case studies survive filtering.
  return <section id="projects" className="selected-work"><div className="section-shell">
    <div className="section-heading"><div><p className="eyebrow">01 / Selected work</p><h2>Built to explore.<br /><span>Engineered to explain.</span></h2></div><p>Go beyond the headline. Explore the architecture, the engineering decisions, and the limits of each project.</p></div>
    <div className="project-toolbar"><div className="work-filters" role="group" aria-label="Filter featured projects">{filters.map(item => <button type="button" key={item} aria-pressed={filter === item} onClick={() => setFilter(item)}>{item}</button>)}</div><span className="result-count" aria-live="polite">{filter === 'All work' ? '03' : '01'} featured {filter === 'All work' ? 'projects' : 'project'}</span></div>
    <div className="featured-projects">{selected.map(project => <div key={project.id} hidden={filter !== 'All work' && projectStories[project.id].filter !== filter}><ProjectCard project={project} /></div>)}</div>
    {filter !== 'All work' && <button className="reset-filter" type="button" onClick={() => setFilter('All work')}>Show all featured projects →</button>}
    <details className="more-projects"><summary>More explorations <span>Forecasting & distributed data</span></summary><div className="additional-projects">{projects.slice(3).map(project => <article key={project.id}><h3>{project.title}</h3><p>{project.description}</p><ProjectLinks project={project} />{!project.links.github && <p className="proof-note">Repository link coming soon.</p>}</article>)}</div></details>
    <a className="all-repos" href={socialLinks.github} target="_blank" rel="noopener noreferrer">Explore all repositories ↗</a>
  </div></section>;
}
