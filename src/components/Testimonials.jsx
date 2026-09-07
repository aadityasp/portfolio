import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { testimonials } from '../data/testimonials'
import Reveal from './Reveal'

// Horizontal, snap-scrolling row of farewell notes. Scroll or swipe the row,
// use the arrow buttons, or focus the row and use the keyboard arrows.
export default function Testimonials() {
  const trackRef = useRef(null)
  const targetRef = useRef(0) // card the row is heading to; survives rapid clicks mid-scroll
  const settleTimer = useRef(null)
  const [index, setIndex] = useState(0)
  const [progress, setProgress] = useState(0) // 0..1 scroll position
  const [thumb, setThumb] = useState(1) // visible fraction of the track
  const count = testimonials.length

  const padLeft = () => {
    const el = trackRef.current
    return el ? parseFloat(getComputedStyle(el).paddingLeft) || 0 : 0
  }

  const update = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setProgress(max > 0 ? Math.min(1, Math.max(0, el.scrollLeft / max)) : 0)
    setThumb(el.scrollWidth > 0 ? el.clientWidth / el.scrollWidth : 1)
    const pl = padLeft()
    let best = 0
    let bestDist = Infinity
    el.querySelectorAll('[data-card]').forEach((card, i) => {
      const d = Math.abs(card.offsetLeft - pl - el.scrollLeft)
      if (d < bestDist) { bestDist = d; best = i }
    })
    // Fully scrolled right means the last card is in view even if it never reaches the left edge.
    if (max > 0 && el.scrollLeft >= max - 2) best = count - 1
    setIndex(best)
    // Once the row stops moving (user swipe or finished animation), the settled card is the target.
    clearTimeout(settleTimer.current)
    settleTimer.current = setTimeout(() => { targetRef.current = best }, 160)
  }, [])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    update()
    // On resize the browser re-snaps the row to a stale target (Chrome does this on any layout
    // change, including the mobile address bar collapsing). Put the row back on the card in use.
    let raf = 0
    const onResize = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => requestAnimationFrame(() => {
        const cards = el.querySelectorAll('[data-card]')
        const card = cards[targetRef.current]
        if (card) el.scrollTo({ left: card.offsetLeft - padLeft(), behavior: 'auto' })
        update()
      }))
    }
    el.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      el.removeEventListener('scroll', update)
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(raf)
      clearTimeout(settleTimer.current)
    }
  }, [update])

  function goTo(i) {
    const el = trackRef.current
    if (!el) return
    const cards = el.querySelectorAll('[data-card]')
    const target = Math.min(count - 1, Math.max(0, i))
    targetRef.current = target
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollTo({ left: cards[target].offsetLeft - padLeft(), behavior: reduce ? 'auto' : 'smooth' })
  }

  const step = (dir) => goTo(targetRef.current + dir)

  function onKeyDown(e) {
    if (e.key === 'ArrowRight') { e.preventDefault(); step(1) }
    if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1) }
  }

  const atStart = progress <= 0.001
  const atEnd = progress >= 0.999

  return (
    <section id="testimonials" className="relative py-24 sm:py-32 border-t border-line">
      <div className="max-w-content mx-auto px-5 sm:px-8">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-6">
            <div className="max-w-2xl">
              <p className="eyebrow text-accent mb-3">What colleagues say</p>
              <h2 className="display text-3xl sm:text-5xl font-semibold tracking-tight text-ink leading-[1.05]">
                What it is like to work with me, in their words.
              </h2>
              <p className="text-soft mt-4 text-lg leading-relaxed">
                A few testimonials from the autonomous vehicle simulation team at Wipro.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-soft tabular-nums" aria-live="polite">
                {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
              </span>
              <button
                type="button"
                onClick={() => step(-1)}
                disabled={atStart}
                aria-label="Previous note"
                className="w-11 h-11 rounded-full border border-line bg-paper text-ink grid place-items-center transition-colors hover:border-ink disabled:opacity-30 disabled:hover:border-line focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
              >
                <ChevronLeft size={18} strokeWidth={1.75} />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                disabled={atEnd}
                aria-label="Next note"
                className="w-11 h-11 rounded-full border border-line bg-paper text-ink grid place-items-center transition-colors hover:border-ink disabled:opacity-30 disabled:hover:border-line focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
              >
                <ChevronRight size={18} strokeWidth={1.75} />
              </button>
            </div>
          </div>
        </Reveal>

        <div
          ref={trackRef}
          role="region"
          aria-roledescription="carousel"
          aria-label="Notes from colleagues"
          tabIndex={0}
          onKeyDown={onKeyDown}
          className="no-scrollbar mt-10 -mx-5 sm:-mx-8 px-5 sm:px-8 scroll-pl-5 sm:scroll-pl-8 flex gap-4 sm:gap-5 overflow-x-auto snap-x snap-mandatory pb-2 rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          {testimonials.map((t, i) => (
            <article
              key={t.name}
              data-card
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}, ${t.name}`}
              className="snap-start flex-none w-[min(88vw,560px)] flex flex-col rounded-2xl border border-line bg-paper2 p-6 sm:p-8"
            >
              <blockquote className="display text-ink text-[17px] sm:text-lg leading-[1.6] space-y-3">
                {t.paragraphs.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </blockquote>
              <footer className="mt-auto pt-6">
                <div className="border-t border-line pt-4 flex items-baseline justify-between gap-4">
                  <span className="display italic text-lg text-ink">{t.name}</span>
                  <span className="font-mono text-xs text-faint">{t.context}</span>
                </div>
              </footer>
            </article>
          ))}
        </div>

        {/* Position line: the thumb's width is the visible share of the row. */}
        <div className="mt-6 h-px bg-line relative" aria-hidden="true">
          <div
            className="absolute top-0 h-px bg-accent transition-[left,width] duration-150"
            style={{ width: `${thumb * 100}%`, left: `${progress * (1 - thumb) * 100}%` }}
          />
        </div>
      </div>
    </section>
  )
}
