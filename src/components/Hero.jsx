import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { ArrowDown, Github, Mail } from 'lucide-react'

const ease = [0.22, 1, 0.36, 1]

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 140])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section id="top" ref={ref} className="relative min-h-[100svh] flex items-center bg-aurora overflow-hidden">
      {/* floating orbs */}
      <motion.div style={{ y }} className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-[8%] w-72 h-72 rounded-full bg-accent/20 blur-3xl animate-float" />
        <div className="absolute top-1/3 right-[6%] w-80 h-80 rounded-full bg-glow/15 blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
      </motion.div>

      <motion.div style={{ opacity }} className="relative max-w-content mx-auto px-5 sm:px-8 w-full pt-28 pb-20">
        <motion.p
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="font-mono text-sm text-glow mb-5 flex items-center gap-2"
        >
          <span className="inline-block w-2 h-2 rounded-full bg-glow animate-pulse" />
          Aditya Sri Prasad — building, AI-first
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05, ease }}
          className="font-display font-bold leading-[0.98] tracking-tight text-[clamp(2.6rem,8vw,6rem)]"
        >
          I ship full products
          <br />
          <span className="text-gradient">in days, not months.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease }}
          className="mt-7 max-w-2xl text-lg sm:text-xl text-muted leading-relaxed"
        >
          AI product engineer working across retail, healthcare, fintech and consumer.
          POS systems, loyalty platforms, medical AI, trading engines — end to end,
          design through deploy.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <a href="#work"
            className="group rounded-full bg-white text-ink font-medium px-6 py-3 flex items-center gap-2 hover:bg-accent hover:text-white transition-colors">
            View the work
            <ArrowDown size={18} className="group-hover:translate-y-0.5 transition-transform" />
          </a>
          <a href="mailto:aadityasp@gmail.com"
            className="rounded-full glass px-6 py-3 flex items-center gap-2 hover:border-white/30 transition-colors">
            <Mail size={18} /> Get in touch
          </a>
          <a href="https://github.com/aadityasp" target="_blank" rel="noreferrer"
            className="rounded-full glass p-3 hover:border-white/30 transition-colors" aria-label="GitHub">
            <Github size={18} />
          </a>
        </motion.div>
      </motion.div>

      <motion.a
        href="#work"
        style={{ opacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted"
        initial={{ y: 0 }} animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}
        aria-label="Scroll"
      >
        <ArrowDown size={22} />
      </motion.a>
    </section>
  )
}
