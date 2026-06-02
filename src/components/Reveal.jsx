import { motion, useSpring } from 'framer-motion'
import { useRef } from 'react'

const ease = [0.22, 1, 0.36, 1]

// Fade + lift into view, once.
export default function Reveal({ children, delay = 0, y = 24, className = '', as = 'div' }) {
  const MotionTag = motion[as] || motion.div
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease }}
    >
      {children}
    </MotionTag>
  )
}

export const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } } }
export const item = { hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease } } }

// Masked line-rise headline reveal. Pass an array of lines.
export function MaskText({ lines, className = '', delay = 0 }) {
  const container = { hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: delay } } }
  const line = { hidden: { y: '115%' }, show: { y: 0, transition: { duration: 0.7, ease } } }
  return (
    <motion.span variants={container} initial="hidden" animate="show" className={className}>
      {lines.map((l, i) => (
        <span key={i} className="mask-line">
          <motion.span variants={line} className="block">{l}</motion.span>
        </span>
      ))}
    </motion.span>
  )
}

// Magnetic wrapper: child gently follows the cursor, springs back on leave.
export function Magnetic({ children, strength = 0.35, className = '' }) {
  const ref = useRef(null)
  const x = useSpring(0, { stiffness: 150, damping: 15, mass: 0.1 })
  const y = useSpring(0, { stiffness: 150, damping: 15, mass: 0.1 })
  function onMove(e) {
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  function reset() { x.set(0); y.set(0) }
  return (
    <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={reset} style={{ x, y }} className={className}>
      {children}
    </motion.div>
  )
}
