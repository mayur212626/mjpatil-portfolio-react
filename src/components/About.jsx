import portrait from '../assets/about/avatar.png';
import { education, personalInfo, socialLinks } from '../data/portfolioData';
export default function About() {
  return <section id="about" className="about-section"><div className="section-shell">
    <div className="section-heading"><div><p className="eyebrow">02 / Behind the work</p><h2>Curiosity, with<br /><span>engineering discipline.</span></h2></div><p>I’m Mayur, a data scientist and ML engineer pursuing an M.S. in Data Science at George Washington University.</p></div>
    <div className="about-grid"><div className="portrait-card"><img src={portrait} alt="Mayur Patil" loading="lazy" width="360" height="420"/><div><span>Mayur Patil</span><small>{personalInfo.location}</small></div></div>
      <div className="about-note"><p className="eyebrow">How I approach the work</p><h3>A model is one part<br />of the system.</h3><p>I’m interested in what makes ML useful beyond a notebook: reliable data, understandable predictions, reproducible experiments, and a clear path to deployment.</p><p>My projects span log analytics, clinical ML research, and multi-agent language models. Each is an opportunity to connect modeling with the engineering around it.</p><a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer">Connect on LinkedIn ↗</a></div>
      <div className="education-card"><p className="eyebrow">Education</p><h3>{education.degree}</h3><p>{education.institution}</p><span>{education.cgpa}</span><hr/><h4>{education.twelfth}</h4><p>{education.tenth}</p><a href={personalInfo.resumeUrl} download>Full résumé ↓</a></div>
    </div>
  </div></section>;
}
