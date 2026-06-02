import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { ArrowDown } from 'lucide-react'
import { MaskText } from './Reveal'

const ease = [0.22, 1, 0.36, 1]

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 120])
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0])

  return (
    <section id="top" ref={ref} className="relative min-h-[100svh] flex items-center">
      <motion.div style={{ y, opacity }} className="relative max-w-content mx-auto px-5 sm:px-8 w-full pt-32 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}
          className="flex items-center gap-2.5 mb-8"
        >
          <span className="relative flex w-2.5 h-2.5">
            <span className="absolute inline-flex w-full h-full rounded-full bg-accent animate-pulseDot" />
            <span className="relative inline-flex w-2.5 h-2.5 rounded-full bg-accent" />
          </span>
          <span className="eyebrow text-soft">Product Manager &middot; AI Builder &middot; Huntsville, AL</span>
        </motion.div>

        <h1 className="display font-medium leading-[0.94] text-[clamp(2.7rem,8.5vw,7rem)] text-ink">
          <MaskText lines={['I design products', 'and build them']} />
          <span className="mask-line">
            <motion.span
              initial={{ y: '115%' }} animate={{ y: 0 }} transition={{ duration: 0.7, delay: 0.3, ease }}
              className="block italic text-accent"
            >
              myself.
            </motion.span>
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.45, ease }}
          className="mt-9 max-w-2xl text-lg sm:text-xl text-soft leading-relaxed"
        >
          I’m a product manager at{' '}
          <a className="link-accent" href="#timeline">CStoreIQ</a> with an MS in AI from
          Northeastern. I work across retail, healthcare and fintech, and I ship the code
          myself, AI-first. Most of what you’ll see here went from idea to working build in
          a few days.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.55, ease }}
          className="mt-11 flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-sm text-soft"
        >
          <a href="#work" className="group inline-flex items-center gap-2 text-ink hover:text-accent transition-colors">
            See the work
            <ArrowDown size={16} className="group-hover:translate-y-0.5 transition-transform" />
          </a>
          <a href="mailto:aadityasp@gmail.com" className="hover:text-ink transition-colors">aadityasp@gmail.com</a>
          <a href="https://github.com/aadityasp" target="_blank" rel="noreferrer" className="hover:text-ink transition-colors">github.com/aadityasp</a>
        </motion.div>
      </motion.div>

      <motion.div style={{ opacity }} className="absolute bottom-7 left-1/2 -translate-x-1/2 text-faint"
        initial={{ y: 0 }} animate={{ y: [0, 7, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
        <ArrowDown size={20} />
      </motion.div>
    </section>
  )
}
