import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { featured, apps, research } from '../data/projects'
import { getLenis } from '../lib/scroll'
import { clock } from '../lib/duration'

const allProjects = [...featured, ...apps, ...research]

/**
 * The film layer: one project's full narrated film, with sound, in a dark
 * on-page player. Opened from the "Play the film" line under a card's cover.
 * Escape, the backdrop, and the close button all dismiss it; the opener owns
 * the URL hash (#film-<id>) so browser Back also closes it (see Projects.jsx).
 */
export default function FilmLayer({ projectId, onClose }) {
  const project = allProjects.find((p) => p.id === projectId)
  const open = Boolean(project?.film)
  const dialogRef = useRef(null)
  const closeRef = useRef(null)
  const videoRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const previouslyFocused = document.activeElement
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    const lenis = getLenis()
    lenis?.stop()
    closeRef.current?.focus()
    // The click that opened the layer is the user gesture, so sound is allowed.
    // If a browser still refuses, the native controls are there to press play.
    const p = videoRef.current?.play()
    if (p && typeof p.catch === 'function') p.catch(() => {})

    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key !== 'Tab' || !dialogRef.current) return
      // Keep focus inside the dialog: close button <-> video controls.
      const items = [...dialogRef.current.querySelectorAll('button, video')]
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
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
          key="film-layer"
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
        >
          <div className="absolute inset-0 bg-ink/85 backdrop-blur-md" onClick={onClose} aria-hidden />
          <motion.div
            ref={dialogRef}
            role="dialog" aria-modal="true" aria-labelledby="film-title"
            initial={{ y: 24, opacity: 0, scale: 0.98 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 16, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative w-full max-w-5xl"
          >
            <div className="flex items-center justify-between gap-4 mb-3 sm:mb-4">
              <p id="film-title" className="font-mono text-[11px] uppercase tracking-[0.18em] text-paper/70">
                <span className="text-paper">{project.name}</span>
                <span className="mx-2 text-paper/40">·</span>The film
                <span className="mx-2 text-paper/40">·</span>
                <span className="tabular-nums">{clock(project.film.seconds)}</span>
              </p>
              <button
                ref={closeRef} type="button" onClick={onClose} aria-label="Close the film"
                className="shrink-0 w-9 h-9 inline-flex items-center justify-center rounded-full border border-paper/25 text-paper/80 hover:text-paper hover:bg-paper/10 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <div className="aspect-video rounded-2xl overflow-hidden bg-black shadow-[0_30px_80px_rgba(0,0,0,0.45)] ring-1 ring-paper/10">
              <video
                ref={videoRef}
                src={project.film.src}
                controls
                autoPlay
                playsInline
                preload="auto"
                aria-label={`${project.name}, the film`}
                className="w-full h-full"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
