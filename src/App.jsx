import Nav from './components/Nav'
import Hero from './components/Hero'
import Projects from './components/Projects'
import Enterprise from './components/Enterprise'
import About from './components/About'
import Contact from './components/Contact'

export default function App() {
  return (
    <div className="relative">
      <Nav />
      <main>
        <Hero />
        <Projects />
        <Enterprise />
        <About />
        <Contact />
      </main>
    </div>
  )
}
