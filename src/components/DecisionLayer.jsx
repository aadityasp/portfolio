import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, X } from 'lucide-react'
import { decisionsFor } from '../data/decisions'
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

/**
 * The decision layer: a dismissable sheet over the page showing ONLY the
 * decision write-ups attached to one project. Opened from the "Read the
 * decision" button on that project's card. Escape, the backdrop, and the close
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
    closeRef.current?.focus()
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = overflow
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
            initial={{ y: 28, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className="relative w-full sm:max-w-3xl max-h-[92vh] sm:max-h-[88vh] overflow-y-auto bg-paper border border-line rounded-t-3xl sm:rounded-3xl shadow-2xl"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between gap-4 px-6 sm:px-9 py-4 bg-paper/95 backdrop-blur border-b border-line">
              <p className="eyebrow text-accent">Product decision · {project.name}</p>
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
