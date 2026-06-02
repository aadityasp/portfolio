import { useRef } from 'react'
import {
  motion, useScroll, useVelocity, useSpring, useTransform, useMotionValue, useAnimationFrame, wrap,
} from 'framer-motion'

const words = [
  'Product Strategy', 'AI-first Development', 'POS & Retail', 'Computer Vision',
  'Full-stack', 'Flutter', 'Next.js', 'FastAPI', 'Healthcare AI', 'Fintech',
  'Rapid Prototyping', 'Kotlin', 'LLMs',
]

// Marquee that drifts on its own and speeds up / reverses with scroll velocity.
function Row({ baseVelocity = 3 }) {
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smooth = useSpring(scrollVelocity, { damping: 50, stiffness: 400 })
  const factor = useTransform(smooth, [0, 1000], [0, 5], { clamp: false })
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`)
  const dir = useRef(1)

  useAnimationFrame((t, delta) => {
    let moveBy = dir.current * baseVelocity * (delta / 1000)
    if (factor.get() < 0) dir.current = -1
    else if (factor.get() > 0) dir.current = 1
    moveBy += dir.current * moveBy * factor.get()
    baseX.set(baseX.get() + moveBy)
  })

  const group = (
    <span className="flex items-center shrink-0">
      {words.map((w, i) => (
        <span key={i} className="flex items-center font-display text-2xl sm:text-3xl text-ink/80">
          <span className="px-6">{w}</span>
          <span className="text-accent text-base">✦</span>
        </span>
      ))}
    </span>
  )

  return (
    <div className="overflow-hidden">
      <motion.div style={{ x }} className="flex w-max whitespace-nowrap will-change-transform">
        {group}{group}{group}{group}
      </motion.div>
    </div>
  )
}

export default function Marquee() {
  return (
    <div className="relative py-6 border-y border-line bg-paper2/50">
      <Row baseVelocity={3} />
    </div>
  )
}
