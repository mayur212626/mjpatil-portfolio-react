import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import TechnicalSkills from './components/TechnicalSkills'
import Projects from './components/Projects'
import LiveDemo from './components/LiveDemo'
import AnomalyLiveDemo from './components/AnomalyLiveDemo'
import Internships from './components/Internships'
import Leadership from './components/Leadership'
import Contact from './components/Contact'
import Footer from './components/Footer'
import CommandPalette from './components/CommandPalette'
import ScrollProgress from './components/ScrollProgress'

export default function App() {
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <ScrollProgress /><CommandPalette /><Navbar />
    <main id="main">
      <Hero /><Projects /><About /><TechnicalSkills />
      <LiveDemo /><AnomalyLiveDemo /><Internships /><Leadership /><Contact />
    </main>
    <Footer />
  </>
}
