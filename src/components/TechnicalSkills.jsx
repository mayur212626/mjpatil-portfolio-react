import { technicalSkills } from '../data/portfolioData';
function SkillGroups({ categories }) {
  return <div className="toolkit-grid">{categories.map(category => <div key={category.title}><h3>{category.title}</h3><ul className="tech-tags">{category.skills.map(skill => <li key={skill.name}>{skill.name}</li>)}</ul></div>)}</div>;
}
export default function TechnicalSkills() {
  return <section id="skills" className="toolkit-section"><div className="section-shell">
    <div className="section-heading"><div><p className="eyebrow">03 / Technical toolkit</p><h2>Tools behind the work.</h2></div><p>My core stack spans data preparation, modeling, and serving. The projects above show how I use it.</p></div>
    <SkillGroups categories={technicalSkills.categories.slice(0, 4)} />
    <details className="more-projects"><summary>Full toolkit <span>Cloud, databases & methods</span></summary><SkillGroups categories={technicalSkills.categories.slice(4)} /></details>
  </div></section>;
}
