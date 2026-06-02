import { useEffect, useRef } from 'react'

// Interactive particle field, adapted from Aditya's current site.
// Mouse attracts particles; click triggers a burst. Tuned for the dark band.
export default function Particles() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let particles = []
    let raf = 0
    const mouse = { x: null, y: null, active: false }
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const COUNT = window.innerWidth < 640 ? 220 : 520
    const COLORS = ['#7d8cff', '#33e6c0', '#a892ff', '#ffffff']
    let W = 0, H = 0

    function resize() {
      const r = canvas.parentElement.getBoundingClientRect()
      W = r.width; H = r.height
      canvas.width = W * dpr; canvas.height = H * dpr
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function make() {
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.6 + 0.4,
        c: COLORS[(Math.random() * COLORS.length) | 0],
      }
    }

    function init() {
      particles = []
      for (let i = 0; i < COUNT; i++) particles.push(make())
    }

    function step() {
      ctx.clearRect(0, 0, W, H)
      ctx.globalCompositeOperation = 'lighter'
      for (const p of particles) {
        if (mouse.active) {
          const dx = mouse.x - p.x
          const dy = mouse.y - p.y
          const d = Math.hypot(dx, dy)
          if (d < 180 && d > 0.5) {
            const f = (180 - d) / 180
            p.vx += (dx / d) * f * 0.6
            p.vy += (dy / d) * f * 0.6
          }
        }
        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.94
        p.vy *= 0.94
        // gentle drift back so they never freeze
        p.vx += (Math.random() - 0.5) * 0.04
        p.vy += (Math.random() - 0.5) * 0.04
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0

        ctx.beginPath()
        ctx.fillStyle = p.c
        ctx.globalAlpha = 0.85
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
      if (mouse.active) {
        const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 120)
        g.addColorStop(0, 'rgba(51,230,192,0.10)')
        g.addColorStop(1, 'rgba(51,230,192,0)')
        ctx.fillStyle = g
        ctx.globalAlpha = 1
        ctx.beginPath(); ctx.arc(mouse.x, mouse.y, 120, 0, Math.PI * 2); ctx.fill()
      }
      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = 'source-over'
      raf = requestAnimationFrame(step)
    }

    function onMove(e) {
      const r = canvas.getBoundingClientRect()
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouse.active = true
    }
    function onLeave() { mouse.active = false }
    function onClick(e) {
      const r = canvas.getBoundingClientRect()
      const cx = e.clientX - r.left, cy = e.clientY - r.top
      for (const p of particles) {
        const dx = p.x - cx, dy = p.y - cy
        const d = Math.hypot(dx, dy) || 1
        if (d < 320) {
          const f = (320 - d) / 320
          p.vx += (dx / d) * f * 14
          p.vy += (dy / d) * f * 14
        }
      }
    }

    resize(); init()
    if (!reduce) step()
    else { // static frame for reduced motion
      ctx.clearRect(0, 0, W, H)
      for (const p of particles) { ctx.fillStyle = p.c; ctx.globalAlpha = 0.7; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill() }
    }
    canvas.addEventListener('mousemove', onMove)
    canvas.addEventListener('mouseleave', onLeave)
    canvas.addEventListener('click', onClick)
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      canvas.removeEventListener('mousemove', onMove)
      canvas.removeEventListener('mouseleave', onLeave)
      canvas.removeEventListener('click', onClick)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full cursor-crosshair" />
}
