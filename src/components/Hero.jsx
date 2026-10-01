import { useEffect, lazy, Suspense } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { heroContent, socialLinks } from '../data/portfolioData';
import SystemExplorer from './SystemExplorer';
const HeroBackground = lazy(() => import('./HeroBackground'));
export default function Hero() {
  useEffect(() => { AOS.init({ duration: 450, once: true, easing: 'ease-out', disable: () => window.matchMedia('(prefers-reduced-motion: reduce)').matches }); }, []);
  return <section id="home" className="portfolio-hero">
    <div className="hero-network" aria-hidden="true"><Suspense fallback={null}><HeroBackground /></Suspense></div>
    <div className="hero-shade" aria-hidden="true" />
    <div className="section-shell hero-copy">
      <div className="hero-grid"><div className="hero-intro">
        <p className="eyebrow"><span className="status-ring" /> Mayur Patil / ML & Data Science</p>
        <h1>From raw data.<br />To real<br /><span>possibilities.</span></h1>
        <p className="hero-description">I build the systems around machine learning, from the first data pipeline to a model you can actually use.</p>
        <p className="hero-credential">M.S. Data Science · George Washington University</p>
        <div className="hero-actions"><a className="primary-action" href="#projects">Explore my work ↗</a><a className="secondary-action" href={heroContent.ctaResume.href} download>Download résumé ↓</a></div>
      </div><SystemExplorer /></div>
      <div className="hero-bottom"><span>DATA ENGINEERING <i>/</i> APPLIED ML <i>/</i> GENAI</span><div><a href={socialLinks.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a><a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a><a href="#contact">Get in touch ↗</a></div></div>
    </div>
  </section>;
}
