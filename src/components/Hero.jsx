import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { ArrowDown } from 'lucide-react'
import { MaskText } from './Reveal'

const ease = [0.22, 1, 0.36, 1]

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const yText = useTransform(scrollYProgress, [0, 1], [0, 90])
  const yImg = useTransform(scrollYProgress, [0, 1], [0, -50])
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0])

  return (
    <section id="top" ref={ref} className="relative min-h-[100svh] flex items-center">
      <div className="relative max-w-content mx-auto px-5 sm:px-8 w-full pt-28 pb-16 grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-12 items-center">
        {/* text */}
        <motion.div style={{ y: yText, opacity }} className="order-2 lg:order-1">
          <motion.div
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}
            className="flex items-center gap-2.5 mb-7"
          >
            <span className="relative flex w-2.5 h-2.5">
              <span className="absolute inline-flex w-full h-full rounded-full bg-accent animate-pulseDot" />
              <span className="relative inline-flex w-2.5 h-2.5 rounded-full bg-accent" />
            </span>
            <span className="eyebrow text-soft">AI Product Manager who ships</span>
          </motion.div>

          <h1 className="display font-medium leading-[0.95] text-[clamp(2.5rem,6.5vw,5rem)] text-ink">
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
            className="mt-7 max-w-lg text-lg text-soft leading-relaxed"
          >
            Product manager at CStoreIQ with an MS in AI. I turn ideas into shipped products
            in days across retail, health and fintech, then bring the metrics.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.55, ease }}
            className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-3 font-mono text-sm text-soft"
          >
            <a href="#work" className="group inline-flex items-center gap-2 rounded-full bg-ink text-paper px-5 py-2.5 hover:bg-accent transition-colors">
              See the work <ArrowDown size={15} className="group-hover:translate-y-0.5 transition-transform" />
            </a>
            <a href="mailto:aadityasp@gmail.com" className="hover:text-ink transition-colors">aadityasp@gmail.com</a>
          </motion.div>
        </motion.div>

        {/* photo */}
        <motion.div style={{ y: yImg, opacity }} className="order-1 lg:order-2 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease }}
            className="relative mx-auto w-[64%] sm:w-[52%] lg:w-[88%] max-w-[420px]"
          >
            <div className="absolute -inset-3 sm:-inset-4 rounded-[28px] bg-accent/12 rotate-3" />
            <img
              src="/images/aditya_hero.jpg"
              alt="Aditya Sri Prasad"
              style={{ objectPosition: '58% 22%' }}
              className="relative w-full rounded-[24px] object-cover border border-line shadow-[0_24px_60px_rgba(25,21,16,0.18)] aspect-[4/5]"
            />
            <div className="absolute -bottom-4 -left-3 sm:-left-4 bg-paper border border-line rounded-2xl px-4 py-2.5 shadow-[0_10px_30px_rgba(25,21,16,0.12)]">
              <span className="font-mono text-[11px] text-soft">Hi, I’m</span>
              <p className="display text-base font-semibold leading-none text-ink">Aditya</p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div style={{ opacity }} className="absolute bottom-6 left-1/2 -translate-x-1/2 text-faint"
        initial={{ y: 0 }} animate={{ y: [0, 7, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
        <ArrowDown size={20} />
      </motion.div>
    </section>
  )
}
