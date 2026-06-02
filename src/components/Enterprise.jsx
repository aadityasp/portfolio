import { motion } from 'framer-motion'
import { enterprise } from '../data/projects'
import Reveal, { stagger, item } from './Reveal'

export default function Enterprise() {
  return (
    <section id="enterprise" className="relative py-24 sm:py-32 border-t border-line">
      <div className="max-w-content mx-auto px-5 sm:px-8">
        <Reveal className="mb-10">
          <p className="eyebrow text-accent mb-3">Enterprise experience</p>
          <h2 className="display text-3xl sm:text-5xl font-semibold tracking-tight text-ink">
            Production codebases I work in
          </h2>
          <p className="text-soft mt-4 max-w-2xl text-lg">
            Beyond my own builds, I ship inside large, live retail systems, AI-first, alongside the team.
          </p>
        </Reveal>

        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
          className="grid sm:grid-cols-2 gap-px bg-line rounded-2xl overflow-hidden border border-line">
          {enterprise.map((e) => (
            <motion.div key={e.name} variants={item} className="bg-paper2 p-6 hover:bg-paper transition-colors">
              <h3 className="display text-lg font-semibold text-ink">{e.name}</h3>
              <p className="text-soft text-sm mt-2 leading-relaxed">{e.desc}</p>
              <p className="font-mono text-[11px] text-accent mt-3">{e.stack}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
