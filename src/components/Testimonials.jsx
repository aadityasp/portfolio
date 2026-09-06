import { motion } from 'framer-motion'
import { testimonials } from '../data/testimonials'
import Reveal, { stagger, item } from './Reveal'

export default function Testimonials() {
  return (
    <section id="testimonials" className="relative py-24 sm:py-32 border-t border-line">
      <div className="max-w-content mx-auto px-5 sm:px-8">
        <Reveal>
          <p className="eyebrow text-accent mb-3">What colleagues said</p>
          <h2 className="display text-3xl sm:text-5xl font-semibold tracking-tight text-ink leading-[1.05]">
            Notes from the team when I left Wipro.
          </h2>
          <p className="text-soft mt-4 text-lg leading-relaxed max-w-2xl">
            From the autonomous vehicle simulation team, December 2020. Their words, lightly trimmed for length.
          </p>
        </Reveal>

        <motion.ul
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="mt-10 grid gap-px bg-line rounded-2xl overflow-hidden border border-line sm:grid-cols-2 lg:grid-cols-3"
        >
          {testimonials.map((t) => (
            <motion.li key={t.name} variants={item} className="bg-paper p-6 sm:p-7 flex flex-col">
              <blockquote className="text-ink text-base sm:text-lg leading-relaxed flex-1">
                <span aria-hidden="true" className="display text-accent text-3xl leading-none mr-1">&ldquo;</span>
                {t.quote}
              </blockquote>
              <figcaption className="mt-5">
                <div className="text-ink font-semibold">{t.name}</div>
                <div className="text-soft text-sm mt-0.5">{t.context}</div>
              </figcaption>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}
