import Nav from './components/Nav'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Projects from './components/Projects'
import Timeline from './components/Timeline'
import About from './components/About'
import Signature from './components/Signature'
import Contact from './components/Contact'

export default function App() {
  return (
    <div className="relative">
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Projects />
        <Timeline />
        <About />
        <Signature />
        <Contact />
      </main>
    </div>
  )
}
