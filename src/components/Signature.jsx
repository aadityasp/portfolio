import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion'
import Particles from './Particles'

const TARGET = 8_000_000_000

export default function Signature() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-120px' })
  const count = useMotionValue(0)
  const text = useTransform(count, (v) => Math.round(v).toLocaleString('en-US'))
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!inView) return
    const controls = animate(count, TARGET, {
      duration: 2.8,
      ease: [0.16, 1, 0.3, 1],
      onComplete: () => setDone(true),
    })
    return () => controls.stop()
  }, [inView, count])

  return (
    <section ref={ref} className="relative bg-ink text-paper overflow-hidden">
      <Particles />
      {/* glow accents */}
      <div className="pointer-events-none absolute inset-0 opacity-60"
        style={{ background: 'radial-gradient(60rem 30rem at 50% 120%, rgba(124,92,255,0.18), transparent 70%)' }} />

      <div className="relative z-10 max-w-content mx-auto px-5 sm:px-8 py-28 sm:py-36 text-center pointer-events-none">
        <p className="eyebrow text-glow mb-6" style={{ color: '#7de3cf' }}>Tokens spent building, and counting</p>

        <div className="display font-medium leading-none text-[clamp(2.6rem,9vw,7rem)] tabular-nums flex items-end justify-center gap-2">
          <motion.span>{text}</motion.span>
          <span className="text-accent" style={{ color: '#a892ff' }}>+</span>
        </div>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: done ? 1 : 0.0 }} transition={{ duration: 0.6 }}
          className="font-display italic text-xl sm:text-2xl text-paper/90 mt-7"
        >
          Still curious. Still building.
        </motion.p>

        <p className="font-mono text-xs uppercase tracking-[0.22em] text-paper/45 mt-10">
          Build things &middot; Break things &middot; Ship things
        </p>
        <p className="font-mono text-[11px] text-paper/30 mt-6">psst, the dots react to your cursor. click them.</p>
      </div>
    </section>
  )
}
