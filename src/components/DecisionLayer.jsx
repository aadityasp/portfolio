import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, X } from 'lucide-react'
import { decisionsFor } from '../data/decisions'
import { getLenis } from '../lib/scroll'
import { featured, apps } from '../data/projects'

const allProjects = [...featured, ...apps]

function Num({ n }) {
  return (
    <div className="border-t border-line pt-3">
      <p className="display text-2xl font-semibold text-ink leading-none">{n.value}</p>
      <p className="font-mono text-[11px] text-soft mt-2 leading-relaxed">{n.label}</p>
    </div>
  )
}

function Example({ ex }) {
  return (
    <div className="mt-8 rounded-2xl border border-line bg-paper2/60 p-5 sm:p-7">
      <p className="eyebrow text-accent">{ex.title}</p>
      <ol className="mt-5 space-y-5">
        {ex.steps.map((st, i) => (
          <li key={st.label} className="grid sm:grid-cols-[130px_1fr] gap-2 sm:gap-8">
            <p className="font-mono text-[11px] uppercase tracking-wider text-soft pt-1">
              <span className="text-accent font-semibold">{i + 1}</span>&nbsp;&nbsp;{st.label}
            </p>
            <div className="min-w-0">
              {st.lines && (
                <div className="rounded-xl bg-white border border-line px-4 py-3 font-mono text-[12.5px] leading-relaxed text-ink/85">
                  {st.lines.map((l) => <p key={l}>{st.lines.length > 1 ? `· ${l}` : `› ${l}`}</p>)}
                </div>
              )}
              {st.groups && (
                <div className="rounded-xl bg-white border-2 border-accent/70 px-4 py-3 space-y-3">
                  {st.groups.map((g, gi) => (
                    <div key={g.heading}>
                      <p className={`text-[13px] font-semibold ${gi === 0 ? 'text-accent' : 'text-ink'}`}>{g.heading}</p>
                      <ul className="mt-1.5 space-y-1">
                        {g.items.map((it, k) => (
                          <li key={it} className={`text-[13.5px] leading-snug flex gap-2 ${gi === 0 && k === 0 ? 'text-ink font-medium' : 'text-ink/75'}`}>
                            <span className={`font-mono shrink-0 ${gi === 0 ? 'text-accent' : 'text-soft'}`}>{gi === 0 ? k + 1 : '›'}</span>
                            <span>{it}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
              {st.sent && (
                <div className="rounded-xl bg-ink px-4 py-3">
                  <p className="font-mono text-[10.5px] uppercase tracking-wider text-[#9DB0FF]">Sent as your next message</p>
                  <p className="text-white text-[14.5px] leading-relaxed mt-1">{st.sent}</p>
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
      {ex.image && (
        <figure className="mt-7">
          <img src={ex.image.src} alt={ex.image.alt} loading="lazy" className="w-full rounded-xl border border-line" />
          <figcaption className="font-mono text-[11px] text-soft mt-2 leading-relaxed">{ex.image.caption}</figcaption>
        </figure>
      )}
    </div>
  )
}

/**
 * The decision layer: a dismissable sheet over the page showing ONLY the
 * decision write-ups attached to one project. Opened from the "Case study"
 * button on that project's card. Escape, the backdrop, and the close
 * button all dismiss it; the opener owns the URL hash so browser Back also
 * closes it (see Projects.jsx).
 */
export default function DecisionLayer({ projectId, onClose }) {
  const project = allProjects.find((p) => p.id === projectId)
  const studies = decisionsFor(projectId)
  const open = Boolean(project && studies.length)
  const closeRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const previouslyFocused = document.activeElement
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    // Lenis owns the wheel; stop it or the page keeps scrolling behind the sheet.
    const lenis = getLenis()
    lenis?.stop()
    closeRef.current?.focus()
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = overflow
      lenis?.start()
      window.removeEventListener('keydown', onKey)
      previouslyFocused?.focus?.()
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="decision-layer"
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
        >
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={onClose} aria-hidden />
          <motion.div
            role="dialog" aria-modal="true" aria-labelledby="decision-title"
            data-lenis-prevent
            initial={{ y: 28, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className="relative w-full sm:max-w-3xl max-h-[92vh] sm:max-h-[88vh] overflow-y-auto bg-paper border border-line rounded-t-3xl sm:rounded-3xl shadow-2xl"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between gap-4 px-6 sm:px-9 py-4 bg-paper/95 backdrop-blur border-b border-line">
              <p className="eyebrow text-accent">Case study · {project.name}</p>
              <button
                ref={closeRef} type="button" onClick={onClose} aria-label="Close"
                className="shrink-0 w-9 h-9 inline-flex items-center justify-center rounded-full border border-line text-soft hover:text-ink hover:bg-paper2 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="px-6 sm:px-9 py-8 sm:py-10">
              {studies.map((s, i) => (
                <article key={s.id} className={i > 0 ? 'mt-14 pt-12 border-t border-line' : ''}>
                  <h2
                    id={i === 0 ? 'decision-title' : undefined}
                    className="display text-2xl sm:text-4xl font-semibold tracking-tight text-ink leading-[1.08]"
                  >
                    {s.headline}
                  </h2>
                  <p className="text-soft mt-4 leading-relaxed text-[15px] sm:text-base">{s.context}</p>

                  <div className="grid sm:grid-cols-3 gap-5 mt-8">
                    {s.numbers.map((n) => <Num key={n.label} n={n} />)}
                  </div>

                  {s.example && <Example ex={s.example} />}

                  <div className="mt-8">
                    {s.sections.map((sec) => (
                      <div key={sec.label} className="grid sm:grid-cols-[130px_1fr] gap-2 sm:gap-8 py-6 border-t border-line">
                        <p className="eyebrow text-accent pt-1">{sec.label}</p>
                        <p className="text-ink/90 leading-relaxed text-[15px] sm:text-base">{sec.body}</p>
                      </div>
                    ))}
                  </div>

                  {s.link && (
                    <a
                      href={s.link.href} target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:text-accent-ink transition-colors mt-6"
                    >
                      {s.link.label} <ArrowUpRight size={15} />
                    </a>
                  )}
                </article>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
