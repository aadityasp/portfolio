import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUp, Mail, Play, Plus, X } from 'lucide-react'
import { featured, apps, research } from '../data/projects'
import { createEarth, limbRadius } from '../lib/earth'
import { goToCard } from '../lib/scroll'
import { useLayer } from '../lib/layer'
import { mark } from '../lib/track'

// The ending says what the page has been showing: everything here was built
// and launched. As the visitor scrolls to the bottom the Earth falls away and
// every project on the page lifts off its surface into orbit, one satellite
// each. Pick one to see what it is and go back to its card. One slot on the
// outer orbit is left open, and it leads to the email button.
//
// Built from the same data file as the cards, so the count is always the real
// one. Scroll-linked, so the launch moves only as fast as the visitor does.
// Under reduced motion everything is already in orbit and stands still.

const TAU = Math.PI * 2, RAD = Math.PI / 180
const clamp01 = (v) => Math.min(1, Math.max(0, v))
const smooth = (v) => { const x = clamp01(v); return x * x * (3 - 2 * x) }
const ALT_NEAR = 1.9, ALT_FAR = 4.6 // Earth radii above the ground: fills its box, then under half of it

// r in Earth radii, tilt = how far the ring is tipped toward the viewer, period in seconds per lap
const RINGS = [
  { r: 1.8, tilt: 21, roll: -15, period: 52 },
  { r: 2.55, tilt: 16, roll: 10, period: 78 },
  { r: 3.3, tilt: 24, roll: -5, period: 108 },
]
const SLOT = { id: 'open-slot', name: 'Open slot', slot: true }

function buildSats() {
  const rest = [...apps, ...research]
  const cut = Math.floor(rest.length * 0.42)
  const groups = [featured, rest.slice(0, cut), [...rest.slice(cut), SLOT]]
  return groups.flatMap((g, k) => g.map((p, i) => ({ p, ring: k, phase: (i / g.length) * TAU + k * 0.9 })))
}

export default function Orbit({ section }) {
  const { openLayer } = useLayer()
  const sats = useMemo(buildSats, [])
  const count = sats.length - 1
  const [hot, setHot] = useState(null)
  const [sel, setSel] = useState(null)
  const stageRef = useRef(null), ringsRef = useRef(null), earthRef = useRef(null), fleetRef = useRef(null)
  const satEls = useRef([]), labelEls = useRef([])
  const live = useRef({ hot: null, sel: null })
  const redraw = useRef(null)
  live.current.hot = hot; live.current.sel = sel

  useEffect(() => { redraw.current?.() }, [hot, sel])

  useEffect(() => {
    const stage = stageRef.current, rings = ringsRef.current, globe = earthRef.current, fleet = fleetRef.current
    const ctx = rings.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0, h = 0, box = 0, raf = 0, alive = true, visible = false, last = 0
    let earth = null, wanted = false, readyAt = 0
    const ang = [0, 0, 0]
    let speed = 1, mx = 0, my = 0, tx = 0, ty = 0
    let spin = 0, spinV = 0, drag = null

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = rings.clientWidth; h = rings.clientHeight; box = globe.clientWidth
      rings.width = Math.round(w * dpr); rings.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      earth?.resize(box, box, dpr)
      if (!raf) draw(performance.now())
    }

    // The intro has usually fetched this image already; otherwise fetch it as the section nears.
    function wantEarth() {
      if (wanted) return
      wanted = true
      let img = window.__introEarth?.[0]
      if (!img) {
        img = new Image()
        img.src = `/intro/earth-${window.innerWidth < 700 ? '2k' : '4k'}.jpg`
      }
      img.decode().then(() => {
        if (!alive) return
        earth = createEarth(globe, img)
        earth?.resize(box, box, Math.min(window.devicePixelRatio || 1, 2))
        readyAt = performance.now()
        if (!raf) draw(readyAt)
      }).catch(() => {})
    }

    function draw(now) {
      const t = reduce ? 0 : now / 1000
      const dt = reduce || !last ? 0 : Math.min(0.1, (now - last) / 1000)
      last = now
      const { hot, sel } = live.current

      // 0 as the Earth's box rises into view, 1 at the bottom of the page.
      const r = globe.getBoundingClientRect()
      const travel = section.current.getBoundingClientRect().bottom - r.top
      const q = reduce ? 1 : clamp01((window.innerHeight - r.top) / travel) ** 1.25
      const altitude = ALT_NEAR * (ALT_FAR / ALT_NEAR) ** q
      const R = limbRadius(altitude) * box / 2          // the globe's radius on screen now
      const Rfar = limbRadius(ALT_FAR) * box / 2        // and once it has fallen away
      // narrow screens pull the orbits in, but never onto the globe
      const outer = Math.min(RINGS[2].r * Rfar, w / 2 - 16)
      const inner = Math.min(RINGS[0].r * Rfar, Math.max(1.35 * Rfar, outer * 0.55))

      // the orbits slow right down while one is being looked at, so it can be caught
      speed += ((hot || sel ? 0.12 : 1) - speed) * Math.min(1, dt * 5)
      mx += (tx - mx) * Math.min(1, dt * 4); my += (ty - my) * Math.min(1, dt * 4)
      if (!drag) { spin += spinV * dt; spinV *= Math.exp(-dt * 1.6) }

      if (earth && !earth.lost) {
        earth.draw({
          lat: 30 - 10 * q,
          lon: -88 - 34 * q + t * 1.5 + spin,
          altitude,
          alpha: reduce ? 1 : clamp01((now - readyAt) / 700),
          bloom: 0,
        })
      }

      ctx.clearRect(0, 0, w, h)
      const cx = w / 2, cy = h / 2
      let anyOut = 0
      const geo = RINGS.map((ring, k) => {
        if (!reduce) ang[k] += dt * (TAU / ring.period) * speed
        const dep = smooth((q - 0.38 - 0.07 * k) / 0.42) // each orbit lifts off a little after the one inside it
        anyOut = Math.max(anyOut, dep)
        const far = inner + (outer - inner) * (ring.r - RINGS[0].r) / (RINGS[2].r - RINGS[0].r)
        const rp = Math.max(R * 1.04, R + (far - R) * dep)
        const tilt = (ring.tilt + my * 5) * RAD, roll = (ring.roll + mx * 4) * RAD
        return { dep, rp, st: Math.sin(tilt), ct: Math.cos(tilt), sr: Math.sin(roll), cr: Math.cos(roll) }
      })
      // a is the angle round the ring; z > 0 is the half nearer the viewer, which sits lower on screen
      const place = (g, a) => {
        const x0 = g.rp * Math.cos(a), y0 = g.rp * Math.sin(a) * g.st, z = g.rp * Math.sin(a) * g.ct
        const x = x0 * g.cr - y0 * g.sr, y = x0 * g.sr + y0 * g.cr
        return { x, y, z, hidden: z < 0 && Math.hypot(x, y) < R }
      }

      // the orbit lines, broken where they pass behind the Earth
      geo.forEach((g) => {
        if (g.dep < 0.01) return
        for (const front of [false, true]) {
          ctx.beginPath()
          let pen = false
          for (let i = 0; i <= 120; i++) {
            const a = (i / 120) * TAU
            const pt = place(g, a)
            if (pt.hidden || (pt.z >= 0) !== front) { pen = false; continue }
            if (pen) ctx.lineTo(cx + pt.x, cy + pt.y); else ctx.moveTo(cx + pt.x, cy + pt.y)
            pen = true
          }
          ctx.strokeStyle = `rgba(246, 243, 236, ${(front ? 0.2 : 0.09) * g.dep})`
          ctx.lineWidth = 1
          ctx.stroke()
        }
      })

      fleet.style.visibility = anyOut > 0.02 ? 'visible' : 'hidden'
      const wide = w >= 640
      sats.forEach((s, i) => {
        const el = satEls.current[i], label = labelEls.current[i]
        if (!el) return
        const g = geo[s.ring]
        const a = s.phase + ang[s.ring]
        const pt = place(g, a)
        const on = hot === s.p.id || sel === s.p.id
        const lead = s.ring === 0 || s.p.slot
        const tint = s.p.slot || lead || on ? '157, 176, 255' : '246, 243, 236'

        // a short tail along the orbit behind each one
        if (g.dep > 0.05 && !reduce) {
          for (let j = 0; j < 7; j++) {
            const p1 = place(g, a - j * 0.035), p2 = place(g, a - (j + 1) * 0.035)
            if (p1.hidden || p2.hidden) continue
            ctx.beginPath(); ctx.moveTo(cx + p1.x, cy + p1.y); ctx.lineTo(cx + p2.x, cy + p2.y)
            ctx.strokeStyle = `rgba(${tint}, ${(1 - j / 7) * 0.5 * g.dep * (pt.z < 0 ? 0.5 : 1)})`
            ctx.lineWidth = lead ? 1.6 : 1.1
            ctx.stroke()
          }
        }
        if (on && !pt.hidden) {
          const pulse = reduce ? 0.5 : (t * 0.9) % 1
          ctx.beginPath(); ctx.arc(cx + pt.x, cy + pt.y, 9 + pulse * 12, 0, TAU)
          ctx.strokeStyle = `rgba(157, 176, 255, ${(1 - pulse) * 0.7})`
          ctx.lineWidth = 1.2
          ctx.stroke()
        }

        const depth = 1 + 0.2 * (pt.z / g.rp)
        const show = pt.hidden ? 0 : g.dep * (pt.z < 0 && !on ? 0.55 : 1)
        el.style.transform = `translate(${pt.x.toFixed(1)}px, ${pt.y.toFixed(1)}px) translate(-50%, -50%) scale(${depth.toFixed(3)})`
        el.style.opacity = show
        el.style.pointerEvents = show > 0.4 ? 'auto' : 'none'
        el.style.zIndex = pt.z >= 0 ? 3 : 1
        if (label) {
          label.style.opacity = on ? 1 : lead && wide && pt.z >= 0 && g.dep > 0.9 ? 0.8 : 0
          label.style.transform = pt.x < 0 ? 'translate(calc(-100% - 16px), -50%)' : 'translate(16px, -50%)'
        }
      })
    }
    redraw.current = () => { if (!raf) draw(performance.now()) }

    function loop(now) {
      draw(now)
      raf = visible && !reduce ? requestAnimationFrame(loop) : 0
    }

    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting
      if (visible) { wantEarth(); last = 0; if (!raf) raf = requestAnimationFrame(loop) }
    }, { rootMargin: '300px' })
    io.observe(stage)

    // The whole system leans a few degrees toward the mouse.
    const onMove = (e) => {
      if (e.pointerType !== 'mouse' || reduce || !visible) return
      const s = stage.getBoundingClientRect()
      tx = Math.max(-1, Math.min(1, (e.clientX - (s.left + s.width / 2)) / (s.width / 2)))
      ty = Math.max(-1, Math.min(1, (e.clientY - (s.top + s.height / 2)) / (s.height / 2)))
    }
    // Drag across the Earth to spin it; let go and it coasts.
    const onDown = (e) => {
      drag = { x: e.clientX, at: performance.now() }
      spinV = 0
      globe.setPointerCapture?.(e.pointerId)
      globe.style.cursor = 'grabbing'
    }
    const onDrag = (e) => {
      if (!drag) return
      const now = performance.now()
      const deg = -(e.clientX - drag.x) * (70 / Math.max(60, box / 2))
      spin += deg
      spinV = deg / Math.max(0.008, (now - drag.at) / 1000)
      drag = { x: e.clientX, at: now }
      if (reduce) draw(now)
    }
    const onUp = () => {
      if (!drag) return
      drag = null
      spinV = reduce ? 0 : Math.max(-220, Math.min(220, spinV))
      globe.style.cursor = 'grab'
    }
    const onScroll = () => { if (reduce && visible) draw(performance.now()) }
    window.addEventListener('pointermove', onMove, { passive: true })
    globe.addEventListener('pointerdown', onDown)
    globe.addEventListener('pointermove', onDrag)
    globe.addEventListener('pointerup', onUp)
    globe.addEventListener('pointercancel', onUp)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', resize)
    resize()

    return () => {
      alive = false
      redraw.current = null
      cancelAnimationFrame(raf); io.disconnect()
      window.removeEventListener('pointermove', onMove)
      globe.removeEventListener('pointerdown', onDown)
      globe.removeEventListener('pointermove', onDrag)
      globe.removeEventListener('pointerup', onUp)
      globe.removeEventListener('pointercancel', onUp)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', resize)
      earth?.destroy()
    }
  }, [sats, section])

  useEffect(() => {
    if (!sel) return
    const onKey = (e) => { if (e.key === 'Escape') setSel(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [sel])

  const picked = sats.find((s) => s.p.id === sel)?.p
  const pick = (p) => {
    setSel((cur) => (cur === p.id ? null : p.id))
    mark(`orbit:${p.id}`)
  }

  return (
    <div className="relative">
      <div
        ref={stageRef} className="relative mx-auto mt-16 sm:mt-20"
        style={{ height: 'min(56vh, 92vw)' }}
        onClick={(e) => { if (e.target === e.currentTarget) setSel(null) }}
      >
        <canvas ref={ringsRef} aria-hidden className="absolute inset-x-0 -inset-y-16 w-full h-[calc(100%+8rem)] pointer-events-none" />
        <canvas
          ref={earthRef} aria-hidden
          className="absolute left-1/2 top-0 -translate-x-1/2 h-full aspect-square cursor-grab"
          style={{ touchAction: 'pan-y' }}
        />
        <div ref={fleetRef} className="absolute left-1/2 top-1/2" style={{ visibility: 'hidden' }}>
          {sats.map((s, i) => {
            const lead = s.ring === 0
            const on = hot === s.p.id || sel === s.p.id
            return (
              <button
                key={s.p.id} type="button"
                ref={(el) => { satEls.current[i] = el }}
                aria-label={s.p.slot ? 'Open slot: your product could be next' : `${s.p.name}${s.p.status ? `, ${s.p.status}` : ''}`}
                aria-pressed={sel === s.p.id}
                onClick={() => pick(s.p)}
                onPointerEnter={(e) => { if (e.pointerType === 'mouse') setHot(s.p.id) }}
                onPointerLeave={() => setHot((cur) => (cur === s.p.id ? null : cur))}
                onFocus={() => setHot(s.p.id)}
                onBlur={() => setHot((cur) => (cur === s.p.id ? null : cur))}
                className="group absolute left-0 top-0 w-9 h-9 rounded-full flex items-center justify-center opacity-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9DB0FF]"
              >
                {s.p.slot ? (
                  <span className="orbit-slot w-[18px] h-[18px] rounded-full border border-dashed border-[#9DB0FF] flex items-center justify-center text-[#9DB0FF]">
                    <Plus size={10} strokeWidth={2.5} />
                  </span>
                ) : (
                  <span
                    className={`block rounded-full transition-transform duration-200 ${on ? 'scale-150' : 'group-hover:scale-150'} ${lead ? 'w-[9px] h-[9px] bg-[#9DB0FF]' : 'w-[6px] h-[6px] bg-paper'}`}
                    style={{ boxShadow: lead || on ? '0 0 12px 2px rgba(157,176,255,0.75)' : '0 0 8px 1px rgba(246,243,236,0.5)' }}
                  />
                )}
                <span
                  ref={(el) => { labelEls.current[i] = el }} aria-hidden
                  className={`absolute left-1/2 top-1/2 whitespace-nowrap font-mono text-[10.5px] uppercase tracking-[0.14em] opacity-0 transition-opacity duration-200 pointer-events-none ${s.p.slot || on ? 'text-[#9DB0FF]' : 'text-paper'}`}
                  style={{ textShadow: '0 0 10px #191510, 0 0 4px #191510' }}
                >
                  {s.p.name}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="relative z-10 max-w-xl mx-auto px-5 pt-6 pb-12 min-h-[220px] sm:min-h-[196px] text-center">
        <AnimatePresence mode="wait" initial={false}>
          {!picked ? (
            <motion.div key="caption" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
              <p className="eyebrow text-[#9DB0FF] mb-3">In orbit</p>
              <p className="display text-2xl sm:text-[1.75rem] text-paper leading-snug">
                {count} things I built, each one <span className="italic text-[#9DB0FF]">a light up here.</span>
              </p>
              <p className="mt-3 text-sm text-paper/60">Pick one to see what it is. One slot is still open.</p>
            </motion.div>
          ) : (
            <motion.div key={picked.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
              <p className="eyebrow text-[#9DB0FF] mb-2">{picked.slot ? 'Open slot' : picked.status || 'Research'}</p>
              <p className="display text-2xl sm:text-[1.75rem] text-paper leading-snug">
                {picked.slot ? <>The next one could be <span className="italic text-[#9DB0FF]">yours.</span></> : picked.name}
              </p>
              <p className="mt-2 text-sm text-paper/65 line-clamp-2">
                {picked.slot ? 'Tell me what you are trying to build and I will tell you how I would start.' : picked.tagline || picked.blurb}
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
                {picked.slot ? (
                  <button type="button" onClick={() => document.querySelector('#contact a[href^="mailto:"]')?.click()}
                    className="rounded-full bg-paper text-ink text-sm font-medium px-5 h-10 inline-flex items-center gap-2 hover:bg-[#9DB0FF] transition-colors">
                    <Mail size={15} /> Email me
                  </button>
                ) : (
                  <>
                    <button type="button" onClick={() => { setSel(null); goToCard(picked.id) }}
                      className="rounded-full bg-paper text-ink text-sm font-medium px-5 h-10 inline-flex items-center gap-2 hover:bg-[#9DB0FF] transition-colors">
                      <ArrowUp size={15} /> See the card
                    </button>
                    {picked.film && (
                      <button type="button" onClick={(e) => openLayer('film', picked.id, { source: 'orbit', origin: e.currentTarget })}
                        className="rounded-full border border-paper/30 text-sm px-5 h-10 inline-flex items-center gap-2 hover:border-paper transition-colors">
                        <Play size={14} /> Watch the film
                      </button>
                    )}
                  </>
                )}
                <button type="button" onClick={() => setSel(null)} aria-label="Close"
                  className="rounded-full border border-paper/20 w-10 h-10 inline-flex items-center justify-center text-paper/70 hover:text-paper hover:border-paper transition-colors">
                  <X size={15} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
