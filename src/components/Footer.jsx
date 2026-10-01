import { personalInfo, socialLinks } from '../data/portfolioData';
export default function Footer() {
  return <footer className="portfolio-footer"><div className="section-shell"><div className="footer-top"><a className="brand" href="#home">{personalInfo.brandName}<span>.</span></a><span>Data science. Thoughtfully engineered.</span><a href="#home">Back to top ↑</a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Mayur Patil</span><span>Built with React · {personalInfo.location}</span><a href={socialLinks.github} target="_blank" rel="noopener noreferrer">Explore my GitHub ↗</a></div></div></footer>;
}
