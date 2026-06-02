import { useEffect, useRef } from 'react'

// Faithful port of Aditya's current-site contact canvas: simplex-noise flow
// field, trail fade, attract on hover, big-bang repel on click, speed glow.
export default function Particles() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let width = 0, height = 0, dpr = 1
    let particles = []
    let mouse = { x: null, y: null, active: false, clicked: false }
    let visible = false
    let raf = null
    let time = 0

    const COUNT = window.innerWidth < 640 ? 340 : 800
    const COLORS = ['#20c997', '#28a745', '#4facfe', '#667eea', '#f093fb']

    // Simplex noise (2D)
    const noise = (() => {
      const grad3 = [[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]]
      const p = [151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180]
      const perm = new Array(512)
      for (let i = 0; i < 512; i++) perm[i] = p[i & 255]
      const dot = (g, x, y) => g[0] * x + g[1] * y
      return (xin, yin) => {
        const F2 = 0.5 * (Math.sqrt(3) - 1), G2 = (3 - Math.sqrt(3)) / 6
        const s = (xin + yin) * F2
        const i = Math.floor(xin + s), j = Math.floor(yin + s)
        const t = (i + j) * G2
        const x0 = xin - (i - t), y0 = yin - (j - t)
        const [i1, j1] = x0 > y0 ? [1, 0] : [0, 1]
        const x1 = x0 - i1 + G2, y1 = y0 - j1 + G2
        const x2 = x0 - 1 + 2 * G2, y2 = y0 - 1 + 2 * G2
        const ii = i & 255, jj = j & 255
        let t0 = 0.5 - x0 * x0 - y0 * y0
        const n0 = t0 < 0 ? 0 : (t0 *= t0, t0 * t0 * dot(grad3[perm[ii + perm[jj]] % 12], x0, y0))
        let t1 = 0.5 - x1 * x1 - y1 * y1
        const n1 = t1 < 0 ? 0 : (t1 *= t1, t1 * t1 * dot(grad3[perm[ii + i1 + perm[jj + j1]] % 12], x1, y1))
        let t2 = 0.5 - x2 * x2 - y2 * y2
        const n2 = t2 < 0 ? 0 : (t2 *= t2, t2 * t2 * dot(grad3[perm[ii + 1 + perm[jj + 1]] % 12], x2, y2))
        return 70 * (n0 + n1 + n2)
      }
    })()

    function resize() {
      const zone = canvas.parentElement
      dpr = window.devicePixelRatio || 1
      width = zone.offsetWidth; height = zone.offsetHeight
      canvas.width = width * dpr; canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    function makeParticle() {
      return {
        x: Math.random() * width, y: Math.random() * height, vx: 0, vy: 0,
        size: Math.random() * 2 + 0.5,
        color: COLORS[(Math.random() * COLORS.length) | 0],
        alpha: Math.random() * 0.6 + 0.2,
      }
    }
    function init() {
      resize(); particles = []
      for (let i = 0; i < COUNT; i++) particles.push(makeParticle())
    }
    function update() {
      time += 0.008
      for (const p of particles) {
        const scale = 0.003
        const n = noise(p.x * scale + time * 0.5, p.y * scale + time * 0.3)
        const angle = n * Math.PI * 4
        p.vx += Math.cos(angle) * 0.25
        p.vy += Math.sin(angle) * 0.25
        if (mouse.active) {
          const dx = mouse.x - p.x, dy = mouse.y - p.y
          const dist = Math.sqrt(dx * dx + dy * dy) || 1
          if (mouse.clicked && dist < 300) {
            const f = (300 - dist) / 300
            p.vx -= (dx / dist) * f * 4; p.vy -= (dy / dist) * f * 4
          } else if (dist < 200) {
            const f = (200 - dist) / 200
            p.vx += (dx / dist) * f * 1.5; p.vy += (dy / dist) * f * 1.5
          }
        }
        p.vx *= 0.95; p.vy *= 0.95
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = width; if (p.x > width) p.x = 0
        if (p.y < 0) p.y = height; if (p.y > height) p.y = 0
      }
    }
    function draw() {
      // trail fade toward the band background (#191510)
      ctx.fillStyle = 'rgba(25, 21, 16, 0.12)'
      ctx.fillRect(0, 0, width, height)
      for (const p of particles) {
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
        const alpha = Math.min(1, speed * 0.25 + 0.15)
        const size = p.size * (1 + speed * 0.08)
        ctx.beginPath()
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = alpha * p.alpha
        ctx.fill()
        if (speed > 2) {
          ctx.beginPath()
          ctx.arc(p.x, p.y, size * 3, 0, Math.PI * 2)
          ctx.globalAlpha = alpha * 0.08
          ctx.fill()
        }
      }
      ctx.globalAlpha = 1
      if (mouse.active) {
        const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 120)
        g.addColorStop(0, mouse.clicked ? 'rgba(245,87,108,0.14)' : 'rgba(32,201,151,0.12)')
        g.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = g
        ctx.beginPath(); ctx.arc(mouse.x, mouse.y, 120, 0, Math.PI * 2); ctx.fill()
      }
    }
    function animate() {
      if (!visible) return
      update(); draw()
      raf = requestAnimationFrame(animate)
    }

    function onMove(e) { const r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouse.active = true }
    function onLeave() { mouse.active = false }
    function onDown() { mouse.clicked = true }
    function onUp() { mouse.clicked = false }
    function onTouch(e) { const r = canvas.getBoundingClientRect(); mouse.x = e.touches[0].clientX - r.left; mouse.y = e.touches[0].clientY - r.top; mouse.active = true }
    function onTouchEnd() { mouse.active = false }

    canvas.addEventListener('mousemove', onMove)
    canvas.addEventListener('mouseleave', onLeave)
    canvas.addEventListener('mousedown', onDown)
    canvas.addEventListener('mouseup', onUp)
    canvas.addEventListener('touchmove', onTouch, { passive: true })
    canvas.addEventListener('touchend', onTouchEnd)
    window.addEventListener('resize', resize)

    init()
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting && !reduce) { visible = true; animate() }
        else { visible = false; if (raf) { cancelAnimationFrame(raf); raf = null } }
      })
    }, { threshold: 0.05 })
    io.observe(canvas.parentElement)
    if (reduce) { update(); draw() }

    return () => {
      visible = false; if (raf) cancelAnimationFrame(raf); io.disconnect()
      canvas.removeEventListener('mousemove', onMove)
      canvas.removeEventListener('mouseleave', onLeave)
      canvas.removeEventListener('mousedown', onDown)
      canvas.removeEventListener('mouseup', onUp)
      canvas.removeEventListener('touchmove', onTouch)
      canvas.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full cursor-crosshair" />
}
