import { ArrowUpRight } from 'lucide-react'
import { studies } from '../data/decisions'
import Reveal from './Reveal'

function Num({ n }) {
  return (
    <div className="border-t border-line pt-3">
      <p className="display text-2xl sm:text-3xl font-semibold text-ink leading-none">{n.value}</p>
      <p className="font-mono text-[11px] text-soft mt-2 leading-relaxed">{n.label}</p>
    </div>
  )
}

function Study({ s, i }) {
  return (
    <Reveal delay={0.05}>
      <article className="grid lg:grid-cols-[0.85fr_1.4fr] gap-10 lg:gap-16 py-14 border-t border-line first:border-t-0 first:pt-0">
        <div className="lg:sticky lg:top-28 self-start">
          <p className="font-mono text-[11px] text-accent">
            {String(i + 1).padStart(2, '0')} · {s.product}
          </p>
          <h3 className="display text-2xl sm:text-4xl font-semibold tracking-tight text-ink mt-3 leading-[1.08]">
            {s.headline}
          </h3>
          <p className="text-soft mt-5 leading-relaxed text-[15px]">{s.context}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-5 mt-8">
            {s.numbers.map((n) => <Num key={n.label} n={n} />)}
          </div>
          {s.link && (
            <a href={s.link.href} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:text-accent-ink transition-colors mt-8">
              {s.link.label} <ArrowUpRight size={15} />
            </a>
          )}
        </div>
        <div className="flex flex-col">
          {s.sections.map((sec) => (
            <div key={sec.label} className="grid sm:grid-cols-[140px_1fr] gap-2 sm:gap-8 py-6 border-t border-line first:border-t-0 first:pt-0">
              <p className="eyebrow text-accent pt-1">{sec.label}</p>
              <p className="text-ink/90 leading-relaxed text-[15px] sm:text-base">{sec.body}</p>
            </div>
          ))}
        </div>
      </article>
    </Reveal>
  )
}

export default function CaseStudy() {
  return (
    <section id="decisions" className="relative py-24 sm:py-32 border-t border-line">
      <div className="max-w-content mx-auto px-5 sm:px-8">
        <Reveal className="mb-12 sm:mb-16">
          <p className="eyebrow text-accent mb-3">Product decisions</p>
          <h2 className="display text-3xl sm:text-5xl font-semibold tracking-tight text-ink">Judgment, not just speed</h2>
          <p className="text-soft mt-4 max-w-2xl text-lg">
            Shipping fast is the easy part to show. These are the calls I am most accountable for, what each one cost, and what it produced.
          </p>
        </Reveal>
        {studies.map((s, i) => <Study key={s.id} s={s} i={i} />)}
      </div>
    </section>
  )
}
