import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, ChevronRight, Music2, Play, X } from 'lucide-react'
import { featured, apps, research } from '../data/projects'
import { story } from '../data/story'
import { getLenis } from '../lib/scroll'
import { clock } from '../lib/duration'
import { mark } from '../lib/track'
import Transcript from './Transcript'

const allProjects = [...featured, ...apps, ...research]

/** The film a layer id names: the career film, or one project's narrated film. */
export function filmFor(id) {
  if (!id) return null
  if (id === story.id) return story
  const p = allProjects.find((x) => x.id === id)
  return p?.film ? { id: p.id, name: p.name, src: p.film.src, seconds: p.film.seconds, audio: 'narrated' } : null
}

// Everything focusable inside the dialog, in DOM order, minus the focus guards
// and whatever a closed <details> hides. Chrome keeps client rects for that
// hidden transcript (content-visibility), but checkVisibility() says hidden and
// focus() on it is a no-op, so the check is visibility, not rects.
const FOCUSABLE = 'a[href], button, video, summary, [tabindex]:not([tabindex="-1"]):not([data-guard])'
const isShown = (el) =>
  (el.matches('summary') || !el.closest('details:not([open])')) &&
  (el.checkVisibility ? el.checkVisibility() : el.getClientRects().length > 0)
const focusables = (root) => [...root.querySelectorAll(FOCUSABLE)].filter(isShown)

/**
 * The film layer: one film, with sound, in a dark on-page player. A project
 * film is {name, src, seconds, audio:'narrated'}; the career film adds a
 * poster, chapters and a transcript. `gesture` says a click opened it (play
 * at once, with sound); from a deep link there is no gesture, so the poster
 * waits behind a Play button and nothing starts on its own. `start` is the
 * second a #story-<sec> link asked for.
 *
 * Escape, the backdrop, and the close button all dismiss it; the provider
 * owns the URL hash so browser Back also closes it (see src/lib/layer.jsx).
 *
 * Focus stays inside: the page behind is inert while a layer is open
 * (App.jsx), and a focus guard at each end of the dialog hands a Tab past the
 * last control (a native video control included) back to the first, and a
 * Shift+Tab before the first on to the last.
 */
export default function FilmLayer({ film, start = 0, gesture = false, onClose }) {
  const open = Boolean(film)
  const isStory = Boolean(film?.chapters)
  const dialogRef = useRef(null)
  const closeRef = useRef(null)
  const videoRef = useRef(null)
  const playRef = useRef(null)
  const rowRef = useRef(null)
  const seeWorkRef = useRef(null)
  // Where focus goes once the chapter row swaps its content: 'work' when the
  // film ends with focus on a chip, 'chip' after Watch again (the button leaves).
  const afterSwap = useRef(null)
  const [waiting, setWaiting] = useState(false)
  const [chapter, setChapter] = useState(-1)
  const [ended, setEnded] = useState(false)
  const saveData = typeof navigator !== 'undefined' && Boolean(navigator.connection?.saveData)

  // A fresh film (or a fresh start time) begins from a clean slate.
  useEffect(() => {
    if (!open) return
    setWaiting(!gesture)
    setChapter(-1)
    setEnded(false)
  }, [open, film, start, gesture])

  const toEdge = useCallback((edge) => {
    if (!dialogRef.current) return
    const items = focusables(dialogRef.current)
    const target = edge === 'first' ? items[0] : items[items.length - 1]
    target?.focus()
  }, [])

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
    if (gesture) {
      const p = videoRef.current?.play()
      if (p && typeof p.catch === 'function') p.catch(() => {})
    }

    const onKey = (e) => {
      if (e.key === 'Escape') return onClose()
      if (e.key !== 'Tab' || !dialogRef.current) return
      // Inside the dialog the guards do the wrapping. A click on plain text
      // leaves focus on <body>; the browser then tabs on from the click, which
      // is still inside the dialog. If that leaves nothing focused, come back in.
      if (dialogRef.current.contains(document.activeElement)) return
      const edge = e.shiftKey ? 'last' : 'first'
      setTimeout(() => { if (!dialogRef.current?.contains(document.activeElement)) toEdge(edge) }, 0)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = overflow
      lenis?.start()
      window.removeEventListener('keydown', onKey)
      previouslyFocused?.focus?.()
    }
  }, [open, gesture, onClose, toEdge])

  // From a deep link the Play button is the first thing to press.
  useEffect(() => { if (open && waiting) playRef.current?.focus() }, [open, waiting])

  // The chapter row swapped (chips <-> the end-of-film row): the control that
  // had focus is gone, so focus moves to a stable target instead of <body>.
  useEffect(() => {
    const want = afterSwap.current
    if (!want) return
    afterSwap.current = null
    if (want === 'work' && ended) seeWorkRef.current?.focus()
    if (want === 'chip' && !ended) rowRef.current?.querySelector('button')?.focus()
  }, [ended])

  const play = useCallback(() => {
    const p = videoRef.current?.play()
    if (p && typeof p.catch === 'function') p.catch(() => {})
  }, [])

  // The Play button leaves with the poster, so focus moves on to the player.
  const playFromPoster = useCallback(() => {
    play()
    videoRef.current?.focus()
  }, [play])

  const seek = useCallback((t) => {
    const v = videoRef.current
    if (!v) return
    if (v.readyState < 1) v.addEventListener('loadedmetadata', () => { v.currentTime = t }, { once: true })
    else v.currentTime = t
    play()
  }, [play])

  const onTimeUpdate = (e) => {
    if (!isStory) return
    // A seek to a chapter can land a frame early, hence the slack.
    const t = e.currentTarget.currentTime
    let i = -1
    film.chapters.forEach(([, at], idx) => { if (t >= at - 0.35) i = idx })
    setChapter(i)
  }

  const onEnded = () => {
    if (rowRef.current?.contains(document.activeElement)) afterSwap.current = 'work'
    setEnded(true)
    if (isStory) mark('story:ended')
  }

  const watchAgain = () => {
    afterSwap.current = 'chip'
    seek(0)
  }

  const seeWork = (e) => {
    e.preventDefault()
    onClose()
    // The layer restarts Lenis as it leaves; scroll once the page has it back.
    setTimeout(() => {
      const el = document.getElementById('work')
      const lenis = getLenis()
      if (lenis && el) lenis.scrollTo(el, { offset: -64, force: true })
      else el?.scrollIntoView()
    }, 150)
  }

  // Touch targets: 40px tall on a phone, and the ::after box reaches 3px past
  // the border each way (the hero chip's trick), so the hit area clears 44px
  // without the chips looking oversized. Rows sit 8px apart, so no overlap.
  const hit = 'relative after:absolute after:-inset-1'
  const chip = `inline-flex items-center h-10 sm:h-8 px-3 rounded-full border font-mono text-[11px] whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paper/70 ${hit}`
  const textLink = 'inline-flex items-center py-3 sm:py-0 whitespace-nowrap text-[13px] font-medium text-paper/75 hover:text-paper transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paper/70'
  const summaryCls = 'inline-flex items-center gap-1.5 py-3.5 -my-3.5 sm:py-0 sm:my-0 cursor-pointer list-none [&::-webkit-details-marker]:hidden font-mono text-[11px] uppercase tracking-[0.16em] text-paper/70 hover:text-paper transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paper/70'
  // A focus guard: not announced, never seen, only ever passed through.
  const guard = 'sr-only'

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="film-layer"
          className="fixed inset-0 z-[60]"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
        >
          <div className="absolute inset-0 bg-ink/85 backdrop-blur-md" aria-hidden />
          {/* The dialog scrolls inside this box when it is taller than a short viewport. */}
          <div
            className="absolute inset-0 max-h-[100svh] overflow-y-auto flex p-4 sm:p-8"
            data-lenis-prevent
            onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
          >
            {/* Width: as wide as a 16:9 frame that leaves room for the title row and
                chapter row. A landscape phone has little height, so there the frame
                takes the screen and the rows scroll into view below it. */}
            <motion.div
              ref={dialogRef}
              role="dialog" aria-modal="true" aria-labelledby="film-title"
              initial={{ y: 24, opacity: 0, scale: 0.98 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 16, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative m-auto w-[min(100%,calc((100svh-14rem)*16/9))] [@media(max-height:520px)]:w-[min(100%,calc((100svh-6.5rem)*16/9))] max-w-5xl"
            >
              <span tabIndex={0} data-guard onFocus={() => toEdge('last')} className={guard} />

              <div className="flex items-center justify-between gap-4 mb-3 sm:mb-4">
                <p id="film-title" className="min-w-0 truncate font-mono text-[11px] uppercase tracking-[0.18em] text-paper/70">
                  <span className="text-paper">{film.name}</span>
                  <span className="mx-2 text-paper/40">·</span>The film
                  <span className="mx-2 text-paper/40">·</span>
                  <span className="tabular-nums">{clock(film.seconds)}</span>
                  {film.audio === 'music' && (
                    <span className="hidden sm:inline"><span className="mx-2 text-paper/40">·</span>Music, no narration</span>
                  )}
                </p>
                <button
                  ref={closeRef} type="button" onClick={onClose} aria-label="Close the film"
                  className="shrink-0 w-11 h-11 sm:w-9 sm:h-9 inline-flex items-center justify-center rounded-full border border-paper/25 text-paper/80 hover:text-paper hover:bg-paper/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paper/70"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-[0_30px_80px_rgba(0,0,0,0.45)] ring-1 ring-paper/10">
                <video
                  ref={videoRef}
                  src={start ? `${film.src}#t=${start}` : film.src}
                  poster={film.poster}
                  controls
                  autoPlay={gesture}
                  playsInline
                  preload={saveData ? 'metadata' : 'auto'}
                  aria-label={isStory
                    ? 'The path: a one-minute film about going from engineer to AI product builder. Music only.'
                    : `${film.name}, the film`}
                  aria-describedby={isStory ? 'story-words-intro-dialog' : undefined}
                  onTimeUpdate={onTimeUpdate}
                  onSeeked={onTimeUpdate}
                  onPlay={() => { setWaiting(false); setEnded(false) }}
                  onEnded={onEnded}
                  className="w-full h-full object-cover"
                />
                {waiting && (
                  // Ink on paper, so it reads over a light poster and a dark first frame alike.
                  <div className="absolute inset-0 grid place-items-center pointer-events-none">
                    <button
                      ref={playRef} type="button" onClick={playFromPoster}
                      className="pointer-events-auto group/play flex flex-col items-center gap-2.5 rounded-2xl p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      <span className="w-16 h-16 rounded-full bg-ink text-paper ring-2 ring-paper/90 grid place-items-center shadow-[0_12px_40px_rgba(0,0,0,0.45)] transition-colors group-hover/play:bg-accent">
                        <Play size={22} fill="currentColor" strokeWidth={0} className="translate-x-[1.5px]" />
                      </span>
                      <span className="rounded-full bg-ink/80 text-paper px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.16em] tabular-nums">
                        Play · {clock(film.seconds)}
                      </span>
                    </button>
                  </div>
                )}
              </div>

              {isStory && (
                // The end of the film is announced; the visible row below carries the same line.
                <p className="sr-only" aria-live="polite">{ended ? 'That’s the path, so far.' : ''}</p>
              )}

              {isStory && (ended ? (
                // Keyed apart from the chapter row so it mounts fresh (at scroll 0)
                // and wraps on every screen: it has five items.
                <div key="ended" ref={rowRef} className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
                  <p className="display text-base text-paper whitespace-nowrap">That’s the path, so far.</p>
                  <a
                    ref={seeWorkRef} href="#work" onClick={seeWork}
                    className={`inline-flex items-center gap-1.5 h-10 sm:h-8 pl-3.5 pr-3 rounded-full bg-paper text-ink text-[13px] font-medium hover:bg-accent hover:text-paper transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paper/70 ${hit}`}
                  >
                    See the work <ArrowRight size={14} />
                  </a>
                  <a href="mailto:aadityasp@gmail.com" className={textLink}>Email me</a>
                  <a href="https://www.linkedin.com/in/aadityasp" target="_blank" rel="noreferrer" className={textLink}>LinkedIn</a>
                  <button type="button" onClick={watchAgain} className={textLink}>Watch again</button>
                </div>
              ) : (
                // On a short (landscape phone) viewport the chips stay one line and scroll sideways.
                <div
                  key="jump" ref={rowRef}
                  className="mt-3 flex flex-wrap items-center gap-2 sm:gap-1.5 [@media(max-height:520px)]:flex-nowrap [@media(max-height:520px)]:overflow-x-auto [@media(max-height:520px)]:[scrollbar-width:none] [@media(max-height:520px)]:[&::-webkit-scrollbar]:hidden"
                >
                  <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-paper/70 mr-1 whitespace-nowrap">Jump to</span>
                  {film.chapters.map(([name, at], i) => (
                    <button
                      key={name} type="button"
                      onClick={() => { seek(at); mark(`story:chapter:${name}`) }}
                      aria-current={i === chapter ? 'true' : undefined}
                      className={`${chip} ${i === chapter ? 'bg-paper text-ink border-paper' : 'border-paper/20 text-paper/70 hover:bg-paper/10 hover:text-paper'}`}
                    >
                      {name}<span className={`ml-1.5 tabular-nums ${i === chapter ? 'text-ink/70' : 'text-paper/65'}`}>{clock(at)}</span>
                    </button>
                  ))}
                  <span className="sm:hidden ml-auto inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-paper/70 whitespace-nowrap">
                    <Music2 size={12} /> Music only
                  </span>
                </div>
              ))}

              {isStory && (
                <details className="group/words mt-3">
                  <summary className={summaryCls}>
                    <ChevronRight size={12} className="transition-transform group-open/words:rotate-90" /> The film, in words
                  </summary>
                  <div className="mt-3 max-h-[40svh] overflow-y-auto rounded-xl bg-paper/5 px-4 py-3" data-lenis-prevent>
                    <p id="story-words-intro-dialog" className="text-[13px] text-paper/70 pb-1">
                      The film is music only. Every word it shows is below, in order.
                    </p>
                    <Transcript beats={film.transcript} titles={film.titles} variant="dark" onSeek={seek} />
                  </div>
                </details>
              )}

              <span tabIndex={0} data-guard onFocus={() => toEdge('first')} className={guard} />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
