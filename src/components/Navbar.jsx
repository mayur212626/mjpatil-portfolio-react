import { useState, useEffect } from 'react';
import { personalInfo } from '../data/portfolioData';
const links = ['Projects', 'About', 'Skills', 'Demo', 'Research'];
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState('home');
  useEffect(() => {
    const sections = [...document.querySelectorAll('main section[id]')];
    let frame;
    function update() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const current = sections.filter(section => section.getBoundingClientRect().top <= 160).at(-1);
        setActive(current?.id || 'home');
      });
    }
    update(); window.addEventListener('scroll', update, { passive: true });
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', update); };
  }, []);
  const navLink = (link) => <a key={link} href={`#${link.toLowerCase()}`} aria-current={active === link.toLowerCase() ? 'location' : undefined} onClick={() => setIsOpen(false)}>{link}</a>;
  return <nav className="portfolio-nav" aria-label="Main navigation" onKeyDown={event => {
    if (event.key === 'Escape') { setIsOpen(false); event.currentTarget.querySelector('.menu-toggle')?.focus(); }
  }}><div className="nav-shell"><a className="brand" href="#home" onClick={() => setIsOpen(false)}>{personalInfo.brandName}<span>.</span></a><div className="desktop-nav">{links.map(navLink)}</div><div className="nav-tools"><button className="search-trigger" type="button" aria-label="Open quick navigation" onClick={() => { setIsOpen(false); window.dispatchEvent(new Event('portfolio:search')); }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/></svg><kbd>⌘ / Ctrl K</kbd></button><a className="nav-contact" href="#contact">Let’s talk ↗</a><button type="button" className="menu-toggle" aria-expanded={isOpen} aria-controls="mobile-navigation" aria-label={isOpen ? 'Close menu' : 'Open menu'} onClick={() => setIsOpen(!isOpen)}>{isOpen ? 'Close ×' : 'Menu +'}</button></div></div><div id="mobile-navigation" className="mobile-navigation" hidden={!isOpen}>{['Home', ...links, 'Experience', 'Contact'].map(navLink)}</div></nav>;
}
