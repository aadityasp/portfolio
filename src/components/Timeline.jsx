import { motion, useScroll, useSpring } from 'framer-motion'
import { useRef, useState } from 'react'
import { experience, education, certs, moreCerts } from '../data/profile'
import Reveal from './Reveal'

const ease = [0.22, 1, 0.36, 1]

function Entry({ e, isFirst, showChapter }) {
  return (
    <div className="relative pl-[84px] sm:pl-[200px] pb-14 sm:pb-20">
      {/* year, left of the rail */}
      <div className="absolute left-0 top-0 w-[60px] sm:w-[150px] text-right pr-3 sm:pr-8">
        <span className="font-mono text-xl sm:text-4xl font-medium text-ink tabular-nums">{e.year}</span>
        {e.current && (
          <span className="hidden sm:block font-mono text-[10px] uppercase tracking-[0.15em] text-accent mt-1">Now</span>
        )}
      </div>

      {/* dot on the rail */}
      <span className="absolute left-[64px] sm:left-[168px] top-1.5 -translate-x-1/2 z-10">
        {e.current ? (
          <span className="relative flex w-3.5 h-3.5">
            <span className="absolute inline-flex w-full h-full rounded-full bg-accent animate-pulseDot" />
            <span className="relative inline-flex w-3.5 h-3.5 rounded-full bg-accent ring-4 ring-paper" />
          </span>
        ) : (
          <span className="block w-3 h-3 rounded-full bg-paper border-2 border-soft ring-4 ring-paper" />
        )}
      </span>

      <motion.div
        initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-12% 0px -12% 0px' }} transition={{ duration: 0.6, ease }}
      >
        {showChapter && (
          <p className="eyebrow text-accent mb-4 -mt-1">{e.chapter}</p>
        )}
        <div className="flex items-center gap-3 mb-1">
          {e.logo && (
            <span className="w-9 h-9 rounded-lg bg-white border border-line grid place-items-center overflow-hidden shrink-0">
              <img src={e.logo} alt={e.company} className="w-7 h-7 object-contain" />
            </span>
          )}
          <div>
            <h3 className="display text-xl sm:text-2xl font-semibold text-ink leading-tight">{e.role}</h3>
            <p className="font-mono text-xs text-soft">{e.company} &middot; {e.location} &middot; {e.range}</p>
          </div>
        </div>
        <ul className="mt-4 space-y-1.5 text-soft text-[15px] leading-relaxed">
          {e.points.map((pt) => (
            <li key={pt} className="flex gap-2.5">
              <span className="text-accent mt-2 w-1 h-1 rounded-full bg-accent shrink-0" />
              <span>{pt}</span>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-1.5 mt-4">
          {e.tags.map((t) => (
            <span key={t} className="font-mono text-[11px] text-soft border border-line rounded-full px-2.5 py-1">{t}</span>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default function Timeline() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start center', 'end end'] })
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  const [certsExpanded, setCertsExpanded] = useState(false)

  let prevChapter = null

  return (
    <section id="timeline" className="relative py-24 sm:py-32 border-t border-line">
      <div className="max-w-content mx-auto px-5 sm:px-8">
        <Reveal className="mb-14">
          <p className="eyebrow text-accent mb-3">The path</p>
          <h2 className="display text-3xl sm:text-5xl font-semibold tracking-tight text-ink">
            From engineering to product
          </h2>
          <p className="text-soft mt-4 max-w-2xl text-lg">
            Autonomous vehicles, then computer vision, then product. The engineering never stopped, it just got AI-assisted.
          </p>
        </Reveal>

        {/* timeline rail + entries */}
        <div ref={ref} className="relative">
          {/* base rail */}
          <div className="absolute top-1 bottom-0 left-[64px] sm:left-[168px] w-px bg-line" />
          {/* fill rail */}
          <motion.div
            style={{ scaleY: fill }}
            className="absolute top-1 left-[64px] sm:left-[168px] w-px h-full bg-accent origin-top"
          />
          {experience.map((e, i) => {
            const showChapter = e.chapter !== prevChapter
            prevChapter = e.chapter
            return <Entry key={e.company} e={e} isFirst={i === 0} showChapter={showChapter} />
          })}
        </div>

        {/* education + certifications */}
        <div className="grid md:grid-cols-2 gap-10 mt-10 pt-12 border-t border-line">
          <Reveal>
            <p className="eyebrow text-accent mb-5">Education</p>
            <div className="space-y-6">
              {education.map((ed) => (
                <div key={ed.degree} className="flex items-start gap-3">
                  {ed.logo && (
                    <span className="w-9 h-9 rounded-lg bg-white border border-line grid place-items-center overflow-hidden shrink-0">
                      <img src={ed.logo} alt="" className="w-7 h-7 object-contain" />
                    </span>
                  )}
                  <div>
                    <h4 className="display text-lg font-semibold text-ink">{ed.degree}</h4>
                    <p className="text-soft text-sm">{ed.school}</p>
                    <p className="font-mono text-xs text-faint mt-0.5">{ed.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="eyebrow text-accent mb-5">Certifications</p>
            <div className="flex flex-wrap gap-2">
              {certs.map((c) => (
                <span key={c} className="font-mono text-xs text-soft border border-line rounded-full px-3 py-1.5">{c}</span>
              ))}
              {certsExpanded && moreCerts.map((c) => (
                <span key={c} className="font-mono text-xs text-soft border border-line rounded-full px-3 py-1.5">{c}</span>
              ))}
              {moreCerts.length > 0 && (
                <button
                  type="button"
                  onClick={() => setCertsExpanded((v) => !v)}
                  aria-expanded={certsExpanded}
                  className="font-mono text-xs text-accent border border-line rounded-full px-3 py-1.5 hover:bg-accent hover:text-paper transition-colors cursor-pointer"
                >
                  {certsExpanded ? 'Show less' : `+ ${moreCerts.length} more`}
                </button>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
