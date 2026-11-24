import { useEffect, useRef } from 'react'
import { useScroll } from 'framer-motion'

// The page ends where it began. Behind the Contact section the paper gives way
// to the night sky of the landing intro. This is the sky alone (dusk and
// stars); the Earth and what orbits it live in Orbit.jsx.
//
// Drawn only while the section is on screen; under reduced motion nothing drifts.

export default function Liftoff({ target }) {
  const skyRef = useRef(null)
  const { scrollYProgress } = useScroll({ target, offset: ['start end', 'end end'] })

  useEffect(() => {
    const sky = skyRef.current
    const ctx = sky.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0, h = 0, raf = 0, alive = true, visible = false

    const stars = Array.from({ length: window.innerWidth < 640 ? 260 : 520 }, () => ({
      x: Math.random(), y: Math.random(),
      size: 0.6 + Math.random() ** 3 * 1.8,
      depth: Math.random(),
      phase: Math.random() * Math.PI * 2,
      tint: Math.random() < 0.12 ? '140, 158, 255' : Math.random() < 0.1 ? '255, 226, 184' : '246, 243, 236',
    }))

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      w = sky.clientWidth; h = sky.clientHeight
      sky.width = Math.round(w * dpr); sky.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (!raf) draw(performance.now())
    }

    function draw(now) {
      const t = reduce ? 0 : now / 1000
      const p = scrollYProgress.get()
      ctx.clearRect(0, 0, w, h)
      for (const s of stars) {
        // nearer stars slide a little further as the page scrolls, which gives the sky depth
        const y = (s.y * h + (1 - p) * s.depth * 140) % h
        const a = (0.35 + 0.65 * s.depth) * (reduce ? 1 : 0.75 + 0.25 * Math.sin(s.phase + t * 1.6))
        ctx.fillStyle = `rgba(${s.tint}, ${a})`
        ctx.beginPath(); ctx.arc(s.x * w, y, s.size / 2, 0, Math.PI * 2); ctx.fill()
      }
    }

    function loop(now) {
      draw(now)
      raf = visible && !reduce ? requestAnimationFrame(loop) : 0
    }

    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting
      if (visible) { if (!raf) raf = requestAnimationFrame(loop) }
    }, { rootMargin: '300px' })
    io.observe(sky)
    // Under reduced motion there is no loop, so the scroll itself repaints the sky.
    const stop = reduce ? scrollYProgress.on('change', () => { if (visible) draw(performance.now()) }) : null
    window.addEventListener('resize', resize)
    resize()

    return () => {
      alive = false
      cancelAnimationFrame(raf); io.disconnect(); stop?.()
      window.removeEventListener('resize', resize)
    }
  }, [scrollYProgress])

  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none">
      {/* dusk: the paper darkens into the night sky */}
      <div className="absolute inset-x-0 top-0 h-[34vh]" style={{ background: 'linear-gradient(to bottom, #F6F3EC 0%, #CFCBD0 20%, #74759A 48%, #2B2B45 74%, #191510 100%)' }} />
      <canvas
        ref={skyRef} className="absolute inset-0 w-full h-full"
        style={{ maskImage: 'linear-gradient(to bottom, transparent 10vh, black 34vh)', WebkitMaskImage: 'linear-gradient(to bottom, transparent 10vh, black 34vh)' }}
      />
    </div>
  )
}
