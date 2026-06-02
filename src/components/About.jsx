import { motion } from 'framer-motion'
import { stats } from '../data/projects'
import Reveal, { stagger, item } from './Reveal'

export default function About() {
  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="max-w-content mx-auto px-5 sm:px-8 grid lg:grid-cols-[1.2fr_1fr] gap-14 items-center">
        <Reveal>
          <p className="font-mono text-sm text-glow mb-3">05 — About</p>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
            I turn ideas into shipped products — fast.
          </h2>
          <div className="text-muted mt-6 space-y-4 text-lg leading-relaxed">
            <p>
              I’m a product engineer who builds AI-first. That means I design, prototype, and
              ship across the whole stack — mobile, web, backend, ML — and lean on AI to move
              at a pace that used to take a team.
            </p>
            <p>
              The result is a wide range: a production convenience-store POS, a gamified
              loyalty platform, a clinical scribe for Indian healthcare, fintech invoice
              automation, trading systems, and a 3D wedding site — most going from idea to a
              working build in days.
            </p>
          </div>
        </Reveal>

        <motion.div
          variants={stagger} initial="hidden" whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-2 gap-4"
        >
          {stats.map((s) => (
            <motion.div key={s.label} variants={item}
              className="glass rounded-2xl p-6 flex flex-col justify-center">
              <span className="font-display text-3xl sm:text-4xl font-bold text-gradient">{s.value}</span>
              <span className="text-muted text-sm mt-2 leading-snug">{s.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
