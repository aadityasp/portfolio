import { useEffect, useRef } from 'react'
import { getLenis } from '../lib/scroll'
import { createEarth } from '../lib/earth'

// First-landing intro: a night sky in the site's own ink with the Earth small
// at its center, a flight through the stars toward it, and the paper page
// opening out of it.
// It plays on every load of the page (index.html decides, before first paint,
// marks <html data-intro> and starts fetching the Earth imagery), never on a
// deep link and never under prefers-reduced-motion. Any click, key, scroll or
// touch ends it early. If the Earth is not ready in time (slow network, no
// WebGL) the intro runs on stars alone, so nobody waits on it.

const INK = '#191510'
const PAPER = '246, 243, 236'
const STAR_TINTS = [PAPER, PAPER, PAPER, PAPER, PAPER, PAPER, '255, 226, 184', '140, 158, 255']

const FACING = { lat: 30, lon: -88 } // the side of the Earth turned to us: North America

// Seconds. The sky holds still until the Earth is ready or EARTH_WAIT runs out.
const EARTH_MIN = 0.5
const EARTH_WAIT = 1.5
const FADE_MS = 450 // the paper overlay lifts off the page

// Flight toward Earth, on a clock that starts when the Earth appears. It
// stays a globe the whole way: about a sixth of the screen height at first,
// about half when the paper starts to open over it.
const FLY_START = 0.4, FLY = 1.9
const ALT_FAR = 14.5, ALT_NEAR = 1.6 // Earth radii above the ground
const EARTH_BLOOM = [1.6, 2.3]

// Stars alone, on a clock that starts when the wait runs out.
const WARP = 1.65
const STAR_BLOOM = [1.2, 1.9]

const clamp01 = (v) => Math.min(1, Math.max(0, v))

export default function StarIntro({ onReveal, onDone }) {
  const wrapRef = useRef(null)
  const skyRef = useRef(null)
  const earthRef = useRef(null)
  const cb = useRef({ onReveal, onDone })
  cb.current = { onReveal, onDone }

  useEffect(() => {
    const wrap = wrapRef.current, canvas = skyRef.current
    const ctx = canvas.getContext('2d')
    const root = document.documentElement
    let w = 0, h = 0, cx = 0, cy = 0, reach = 0, diag = 0, dpr = 1
    let raf = 0, doneTimer = 0, alive = true
    let t = 0, last = 0, rate = 1, revealed = false
    let mode = null, u = 0 // 'earth' | 'stars', and seconds since that began
    let earth = null
    let glScale = 1, slow = 0, settle = 0 // Earth canvas resolution, stepped down on a slow GPU

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth; h = window.innerHeight
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cx = w / 2; cy = h / 2
      reach = Math.max(w, h) / 2
      diag = Math.hypot(w, h) / 2
      earth?.resize(w, h, dpr * glScale)
    }
    resize()

    // index.html started these downloads before this bundle had even parsed.
    const imgs = window.__introEarth
    if (imgs?.length === 1) {
      imgs[0].decode().then(() => {
        if (!alive || mode) return
        earth = createEarth(earthRef.current, imgs[0])
        earth?.resize(w, h, dpr * glScale)
      }).catch(() => {})
    }

    const count = w < 640 ? 600 : 1400
    const spawn = (s, z) => {
      s.x = Math.random() * 2 - 1
      s.y = Math.random() * 2 - 1
      s.z = z
      s.size = 1 + Math.random() ** 3 * 2.4   // mostly fine points, a few bright ones
      s.tint = STAR_TINTS[(Math.random() * STAR_TINTS.length) | 0]
      s.twinkle = Math.random() * Math.PI * 2
      return s
    }
    const stars = Array.from({ length: count }, () => spawn({}, 0.08 + Math.random() * 0.92))

    function frame(now) {
      const raw = last ? (now - last) / 1000 : 0
      // Long frames still move the clock at full pace (to 10 fps), so a slow
      // machine gets a choppier flight, not a slower one.
      const dt = Math.min(0.1, raw) * rate
      last = now
      t += dt
      if (!mode) {
        if (earth && t >= EARTH_MIN) mode = 'earth'
        else if (t >= EARTH_WAIT) mode = 'stars'
      } else u += dt
      const toEarth = mode === 'earth' && !earth.lost
      if (mode === 'earth' && !toEarth) { mode = 'stars'; u = Math.min(u, STAR_BLOOM[0]) }

      const flight = toEarth ? clamp01((u - FLY_START) / FLY) : 0
      const warp = mode ? clamp01((u - (toEarth ? FLY_START : 0)) / WARP) : 0 // how hard the stars streak
      const span = toEarth ? EARTH_BLOOM : STAR_BLOOM
      const bloom = mode ? clamp01((u - span[0]) / (span[1] - span[0])) : 0

      const speed = 0.018 + 2.4 * warp * warp * warp   // depth units per second
      const tail = 1 + 7 * warp                         // streak length, in frames of travel
      const fadeIn = clamp01(t / 0.35)

      ctx.fillStyle = INK
      ctx.fillRect(0, 0, w, h)

      // stars alone: the light we are flying toward
      if (warp > 0 && !toEarth) {
        const r = diag * (0.06 + 0.2 * warp)
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
        g.addColorStop(0, `rgba(${PAPER}, ${0.32 * warp * warp})`)
        g.addColorStop(1, `rgba(${PAPER}, 0)`)
        ctx.fillStyle = g
        ctx.fillRect(cx - r, cy - r, r * 2, r * 2)
      }

      ctx.lineCap = 'round'
      for (const s of stars) {
        const zPrev = s.z + speed * dt * tail
        s.z -= speed * dt
        if (s.z <= 0.012) { spawn(s, 1); continue }
        const x = cx + (s.x / s.z) * reach, y = cy + (s.y / s.z) * reach
        if (x < -60 || x > w + 60 || y < -60 || y > h + 60) { spawn(s, 1); continue }
        const near = 1 - s.z
        const size = s.size * (0.9 + near * 1.1)
        const shimmer = 0.78 + 0.22 * Math.sin(s.twinkle + t * 3)
        const alpha = fadeIn * Math.min(1, 0.6 + near * 1.2) * (warp > 0.2 ? 1 : shimmer)
        const px = cx + (s.x / zPrev) * reach, py = cy + (s.y / zPrev) * reach
        if (Math.hypot(x - px, y - py) < size) {
          ctx.fillStyle = `rgba(${s.tint}, ${alpha})`
          ctx.beginPath(); ctx.arc(x, y, size / 2, 0, Math.PI * 2); ctx.fill()
        } else {
          ctx.strokeStyle = `rgba(${s.tint}, ${alpha})`
          ctx.lineWidth = size
          ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(x, y); ctx.stroke()
        }
      }

      if (toEarth) {
        // Frames running long: draw the Earth at a lower resolution.
        slow = slow * 0.8 + raw * 0.2
        if (--settle < 0 && slow > 0.03 && glScale > 0.4) {
          glScale *= 0.7; slow = 0; settle = 8
          earth.resize(w, h, dpr * glScale)
        }
        // Altitude falls by a growing ratio, so the zoom gathers pace with
        // the stars, and the globe turns slowly as we close in.
        earth.draw({
          lat: FACING.lat,
          lon: FACING.lon + 24 * (1 - flight),
          altitude: ALT_FAR * (ALT_NEAR / ALT_FAR) ** flight ** 1.4,
          alpha: clamp01(u / 0.5),
          bloom: 1.7 * bloom * bloom,
        })
      }

      if (bloom >= 1) {
        ctx.fillStyle = `rgb(${PAPER})`
        ctx.fillRect(0, 0, w, h)
        reveal()
        return
      }
      // stars alone: the paper opens from the center and takes the whole screen
      if (bloom > 0 && !toEarth) {
        const r = diag * 1.7 * bloom * bloom
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
        g.addColorStop(0, `rgba(${PAPER}, 1)`)
        g.addColorStop(0.55, `rgba(${PAPER}, 1)`)
        g.addColorStop(1, `rgba(${PAPER}, 0)`)
        ctx.fillStyle = g
        ctx.fillRect(0, 0, w, h)
      }
      raf = requestAnimationFrame(frame)
    }

    // The screen is solid paper, the same paper as the page under it: hand
    // the page back, then lift the overlay off.
    function reveal() {
      if (revealed) return
      revealed = true
      root.removeAttribute('data-intro')
      cb.current.onReveal?.()
      wrap.style.transition = `opacity ${FADE_MS}ms ease-out`
      wrap.style.opacity = '0'
      wrap.style.pointerEvents = 'none'
      doneTimer = setTimeout(finish, FADE_MS)
    }
    function finish() {
      release()
      cb.current.onDone?.()
    }

    // The page holds still under the intro (Lenis scrolls by script, so it
    // has to be stopped as well as the overflow).
    const prevOverflow = root.style.overflow
    root.style.overflow = 'hidden'
    const holdLenis = requestAnimationFrame(() => getLenis()?.stop())
    let released = false
    function release() {
      if (released) return
      released = true
      root.style.overflow = prevOverflow
      getLenis()?.start()
    }

    // Any input means "take me to the page": jump to the opening and run it fast.
    function skip() {
      if (!mode) mode = earth ? 'earth' : 'stars'
      const start = (mode === 'earth' ? EARTH_BLOOM : STAR_BLOOM)[0]
      if (u < start) u = start
      rate = 2
    }
    const opts = { passive: true }
    window.addEventListener('pointerdown', skip, opts)
    window.addEventListener('keydown', skip, opts)
    window.addEventListener('wheel', skip, opts)
    window.addEventListener('touchmove', skip, opts)
    window.addEventListener('resize', resize)

    raf = requestAnimationFrame(frame)
    return () => {
      alive = false
      cancelAnimationFrame(raf); cancelAnimationFrame(holdLenis); clearTimeout(doneTimer)
      window.removeEventListener('pointerdown', skip, opts)
      window.removeEventListener('keydown', skip, opts)
      window.removeEventListener('wheel', skip, opts)
      window.removeEventListener('touchmove', skip, opts)
      window.removeEventListener('resize', resize)
      root.removeAttribute('data-intro')
      earth?.destroy()
      release()
    }
  }, [])

  return (
    <div ref={wrapRef} aria-hidden="true" className="fixed inset-0 z-[100]" style={{ background: INK }}>
      <canvas ref={skyRef} className="absolute inset-0 w-full h-full" />
      <canvas ref={earthRef} className="absolute inset-0 w-full h-full" />
    </div>
  )
}
