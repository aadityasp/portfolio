import { useEffect, useMemo, useState } from 'react'
import Lenis from 'lenis'
import { MotionConfig, motion, useScroll, useSpring } from 'framer-motion'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Projects from './components/Projects'
import Timeline from './components/Timeline'
import Testimonials from './components/Testimonials'
import About from './components/About'
import Signature from './components/Signature'
import Contact from './components/Contact'
import DecisionLayer from './components/DecisionLayer'
import FilmLayer, { filmFor } from './components/FilmLayer'
import StarIntro from './components/StarIntro'
import CommandPalette from './components/CommandPalette'
import { initTracking } from './lib/track'
import { LayerProvider, useLayer } from './lib/layer'
import { setLenis } from './lib/scroll'

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })
  return <motion.div style={{ scaleX }} className="fixed top-0 left-0 right-0 h-[3px] bg-accent origin-left z-[60]" />
}

// The page behind a layer is inert while one is open: nothing there takes a
// click, focus or a Tab, and it leaves the accessibility tree, so the dialog
// is all there is. (React 18 has no `inert` prop; the attribute's presence,
// an empty string, is what turns it on.)
function Page({ busy, children }) {
  const { layer } = useLayer()
  return <div inert={layer || busy ? '' : undefined}>{children}</div>
}

// The one layer that can sit over the page, mounted once for every door
// (project cards, the hero chip, the Timeline card, a deep link).
function Layers() {
  const { layer, gesture, closeLayer } = useLayer()
  const filmId = layer?.kind === 'film' ? layer.id : null
  const film = useMemo(() => filmFor(filmId), [filmId])
  return (
    <>
      <DecisionLayer projectId={layer?.kind === 'decision' ? layer.id : null} onClose={closeLayer} />
      <FilmLayer film={film} start={layer?.t || 0} gesture={gesture} onClose={closeLayer} />
    </>
  )
}

export default function App() {
  useEffect(() => { initTracking() }, [])

  // The star intro: index.html decides before first paint whether this visit
  // gets one and marks <html data-intro>. 'playing' -> 'reveal' (the screen is
  // all paper, the hero starts its entrance) -> 'done' (overlay unmounted).
  const [intro, setIntro] = useState(() => (document.documentElement.hasAttribute('data-intro') ? 'playing' : 'off'))

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 1 })
    setLenis(lenis)
    let raf = requestAnimationFrame(function loop(t) {
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    })

    // smooth in-page anchor navigation (a layer link such as #story has no
    // element on the page, so it is left alone)
    function onClick(e) {
      const a = e.target.closest('a[href^="#"]')
      if (!a) return
      const id = a.getAttribute('href')
      if (id.length > 1) {
        const el = document.querySelector(id)
        if (el) { e.preventDefault(); lenis.scrollTo(el, { offset: -64 }) }
      }
    }
    document.addEventListener('click', onClick)
    return () => { cancelAnimationFrame(raf); lenis.destroy(); setLenis(null); document.removeEventListener('click', onClick) }
  }, [])

  // The command palette: Cmd/Ctrl+K anywhere, or "/" when not typing in a field.
  const [palette, setPalette] = useState(false)
  useEffect(() => {
    function onKey(e) {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable
      const combo = (e.metaKey || e.ctrlKey) && !e.altKey && !e.shiftKey && e.key.toLowerCase() === 'k'
      if (combo) { e.preventDefault(); setPalette((v) => !v) }
      else if (e.key === '/' && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) { e.preventDefault(); setPalette(true) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <LayerProvider>
        <div className="relative">
          <Page busy={palette}>
            <ScrollProgress />
            <Nav onSearch={() => setPalette(true)} />
            <main>
              {/* Remounted at the reveal so its entrance plays as the intro lifts. */}
              <Hero key={intro === 'playing' ? 'held' : 'live'} />
              <Marquee />
              <Projects />
              <Timeline />
              <About />
              <Signature />
              <Testimonials />
              <Contact />
            </main>
          </Page>
          <Layers />
          <CommandPalette open={palette} onClose={() => setPalette(false)} />
          {(intro === 'playing' || intro === 'reveal') && (
            <StarIntro onReveal={() => setIntro('reveal')} onDone={() => setIntro('done')} />
          )}
        </div>
      </LayerProvider>
    </MotionConfig>
  )
}
