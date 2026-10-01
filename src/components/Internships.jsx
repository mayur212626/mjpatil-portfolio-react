import { internshipsList } from '../data/portfolioData';
export default function Internships() {
  return <section id="experience" className="experience-section"><div className="section-shell experience-grid"><div><p className="eyebrow">04 / Experience</p><h2>Learning through<br />real work.</h2></div><div>{internshipsList.map(intern => <article className="experience-row" key={intern.organization}><p className="eyebrow">{intern.duration}</p><h3>{intern.role}</h3><p className="experience-company">{intern.organization}</p><p>Areas of practice</p><ul className="tech-tags">{intern.skills.map(skill => <li key={skill}>{skill}</li>)}</ul><p className="experience-tech">{intern.tech.join(' / ')}</p></article>)}</div></div></section>;
}
