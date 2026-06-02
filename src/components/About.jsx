import { motion } from 'framer-motion'
import { stats } from '../data/projects'
import Reveal, { stagger, item } from './Reveal'

export default function About() {
  return (
    <section id="about" className="relative py-24 sm:py-32 border-t border-line bg-paper2/40">
      <div className="max-w-content mx-auto px-5 sm:px-8 grid lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-16 items-center">
        <Reveal className="order-2 lg:order-1">
          <div className="relative max-w-[320px] mx-auto lg:mx-0">
            <div className="absolute -inset-3 rounded-3xl bg-accent/10 -rotate-3" />
            <img src="/images/resized_asp2.png" alt="Aditya Sri Prasad"
              className="relative rounded-3xl w-full object-cover border border-line shadow-[0_18px_50px_rgba(25,21,16,0.16)]" />
          </div>
        </Reveal>

        <div className="order-1 lg:order-2">
          <Reveal>
            <p className="eyebrow text-accent mb-3">About</p>
            <h2 className="display text-3xl sm:text-5xl font-semibold tracking-tight text-ink leading-[1.05]">
              A product manager who ships the code.
            </h2>
            <div className="text-soft mt-6 space-y-4 text-lg leading-relaxed">
              <p>
                I started in engineering: autonomous-vehicle simulation at Wipro, then computer
                vision research and a CV/ML internship while finishing my MS in AI at Northeastern.
              </p>
              <p>
                Now I lead product at CStoreIQ, and I still build. AI-first development lets me go
                from a problem to a working product in days, across retail, healthcare and fintech.
                This site is most of that work, in one place.
              </p>
            </div>
          </Reveal>

          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-line rounded-2xl overflow-hidden border border-line mt-10">
            {stats.map((s) => (
              <motion.div key={s.label} variants={item} className="bg-paper p-5">
                <div className="display text-2xl sm:text-3xl font-semibold text-ink">{s.value}</div>
                <div className="text-soft text-xs mt-1.5 leading-snug">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
