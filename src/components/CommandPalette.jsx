import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, CornerDownLeft, Hash, LayoutGrid, Mail, Play, ScrollText, Search } from 'lucide-react'
import { featured, apps, research } from '../data/projects'
import { studies } from '../data/decisions'
import { story } from '../data/story'
import { getLenis, scrollToEl, goToCard } from '../lib/scroll'
import { useLayer } from '../lib/layer'
import { clock, readMinutes } from '../lib/duration'
import { mark } from '../lib/track'

// The command palette: Cmd/Ctrl+K (or "/", or the Search button in the nav)
// opens one box that reaches everything on the page. It jumps to a section or
// a project card, opens a film or a case study, or starts an email. Built
// from the same data files the page renders, so it can never list something
// the page does not have.

const all = [...featured, ...apps, ...research]
const nameOf = (id) => all.find((p) => p.id === id)?.name || ''

const SECTIONS = [
  ['top', 'Top of the page'],
  ['work', 'Work: products I led and built'],
  ['timeline', 'Timeline: from engineering to product'],
  ['about', 'About'],
  ['contact', 'Contact'],
]

// Contact rows press the page's own Contact links, so the addresses live in one place.
const pressContactLink = (prefix) => document.querySelector(`#contact a[href^="${prefix}"]`)?.click()

function buildItems() {
  const items = []
  SECTIONS.forEach(([id, label]) => items.push({
    key: `go-${id}`, group: 'Go to', icon: Hash, label, hint: 'Section', words: id, base: true,
    run: () => scrollToEl(document.getElementById(id), id === 'top' ? 0 : -64),
  }))
  items.push({
    key: 'film-story', group: 'Go to', icon: Play, label: 'My story, the career film', hint: clock(story.seconds), words: 'story film career path video watch', base: true,
    run: ({ openLayer }) => openLayer('film', 'story', { source: 'palette' }),
  })
  all.forEach((p) => items.push({
    key: `project-${p.id}`, group: 'Projects', icon: LayoutGrid, label: p.name, hint: p.status || 'Project',
    words: [p.tagline, ...(p.stack || [])].join(' '), base: featured.includes(p),
    run: () => goToCard(p.id),
  }))
  all.filter((p) => p.film).forEach((p) => items.push({
    key: `film-${p.id}`, group: 'Films', icon: Play, label: `${p.name}, the product overview`, hint: clock(p.film.seconds),
    words: 'film video watch overview narrated',
    run: ({ openLayer }) => openLayer('film', p.id),
  }))
  // One row per project that has a write-up; the layer shows all of that project's studies.
  const seen = new Set()
  studies.forEach((s) => {
    if (seen.has(s.project) || !nameOf(s.project)) return
    seen.add(s.project)
    const mine = studies.filter((x) => x.project === s.project)
    const minutes = readMinutes(mine.flatMap((x) => [x.headline, x.context, ...x.sections.map((sec) => sec.body)]))
    items.push({
      key: `decision-${s.project}`, group: 'Case studies', icon: ScrollText, label: s.headline, hint: `${nameOf(s.project)} · ${minutes} min`,
      words: `case study decision read ${nameOf(s.project)}`,
      run: ({ openLayer }) => openLayer('decision', s.project),
    })
  })
  items.push(
    { key: 'email', group: 'Contact', icon: Mail, label: 'Email Aditya', hint: 'Opens your mail app', words: 'mail contact hire reach', base: true,
      run: () => pressContactLink('mailto:') },
    { key: 'linkedin', group: 'Contact', icon: ArrowUpRight, label: 'LinkedIn', hint: 'Opens a new tab', words: 'profile connect contact hire', base: true,
      run: () => pressContactLink('https://www.linkedin.com') },
    { key: 'github', group: 'Contact', icon: ArrowUpRight, label: 'GitHub', hint: 'Opens a new tab', words: 'code repos contact', base: true,
      run: () => pressContactLink('https://github.com') },
  )
  return items
}

export default function CommandPalette({ open, onClose }) {
  const { openLayer } = useLayer()
  const items = useMemo(buildItems, [])
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef(null)
  const listRef = useRef(null)

  // Nothing typed: the short list (sections, the flagship products, contact).
  // Typing searches everything; every word typed has to match.
  const results = useMemo(() => {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
    if (!terms.length) return items.filter((it) => it.base)
    return items.filter((it) => {
      const hay = `${it.label} ${it.group} ${it.hint} ${it.words}`.toLowerCase()
      return terms.every((t) => hay.includes(t))
    })
  }, [items, query])

  useEffect(() => { setActive(0) }, [query])

  useEffect(() => {
    if (!open) return
    setQuery(''); setActive(0)
    mark('palette:open')
    const previouslyFocused = document.activeElement
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    const lenis = getLenis()
    lenis?.stop()
    inputRef.current?.focus()
    return () => {
      document.body.style.overflow = overflow
      lenis?.start()
      // The box stays mounted while it animates out. Take focus off it now, or
      // keys typed in that moment land in a field nobody can see.
      inputRef.current?.blur()
      previouslyFocused?.focus?.()
    }
  }, [open])

  useEffect(() => {
    listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' })
  }, [active, results])

  const choose = (it) => {
    if (!it) return
    mark(`palette:${it.key}`)
    onClose()
    // The palette hands the page back (scroll, focus) as it leaves; act once it has.
    setTimeout(() => it.run({ openLayer }), 80)
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((i) => Math.min(results.length - 1, i + 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((i) => Math.max(0, i - 1)) }
    else if (e.key === 'Enter') { e.preventDefault(); choose(results[active]) }
    else if (e.key === 'Escape') { e.preventDefault(); onClose() }
    else if (e.key === 'Tab') e.preventDefault() // the box is the only stop; arrows move through the list
  }

  let lastGroup = null
  return (
    <AnimatePresence>
      {open && (
        <motion.div key="palette" className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[12vh] sm:pt-[16vh]" initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 1 }}>
          <motion.div
            className="absolute inset-0 bg-ink/35 backdrop-blur-sm" onClick={onClose} aria-hidden
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
          />
          <motion.div
            role="dialog" aria-modal="true" aria-label="Search this portfolio"
            data-lenis-prevent
            initial={{ opacity: 0, y: -14, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            className="relative w-full max-w-xl bg-paper border border-line rounded-2xl shadow-[0_30px_90px_rgba(25,21,16,0.28)] overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 sm:px-5 border-b border-line">
              <Search size={17} className="shrink-0 text-soft" />
              <input
                ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={onKeyDown}
                role="combobox" aria-expanded="true" aria-controls="palette-list" aria-autocomplete="list"
                aria-activedescendant={results[active] ? `palette-${results[active].key}` : undefined}
                placeholder="Search projects, films, case studies"
                autoComplete="off" autoCorrect="off" spellCheck="false"
                className="flex-1 min-w-0 h-14 bg-transparent text-[16px] text-ink placeholder:text-faint focus:outline-none"
              />
              <kbd className="hidden sm:inline-block font-mono text-[10px] text-soft border border-line rounded px-1.5 py-0.5">esc</kbd>
            </div>

            <div id="palette-list" ref={listRef} role="listbox" aria-label="Results" className="max-h-[min(52vh,420px)] overflow-y-auto overscroll-contain py-2">
              {results.length === 0 && (
                <p className="px-5 py-8 text-center text-sm text-soft">Nothing here matches “{query}”.</p>
              )}
              {results.map((it, i) => {
                const head = it.group !== lastGroup
                lastGroup = it.group
                const on = i === active
                return (
                  <div key={it.key}>
                    {head && <p className="eyebrow px-5 pt-3 pb-1.5">{it.group}</p>}
                    <div
                      id={`palette-${it.key}`} role="option" aria-selected={on}
                      onMouseMove={() => setActive(i)} onClick={() => choose(it)}
                      className={`relative mx-2 px-3 h-11 flex items-center gap-3 rounded-lg cursor-pointer ${on ? 'bg-accent/[0.08]' : ''}`}
                    >
                      {on && <span aria-hidden className="absolute left-0 top-2.5 bottom-2.5 w-[3px] rounded-full bg-accent" />}
                      <it.icon size={15} className={`shrink-0 ${on ? 'text-accent' : 'text-soft'}`} />
                      <span className={`min-w-0 truncate text-[14.5px] ${on ? 'text-ink font-medium' : 'text-ink/85'}`}>{it.label}</span>
                      <span className="ml-auto shrink-0 max-w-[45%] truncate font-mono text-[11px] text-soft">{it.hint}</span>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="hidden sm:flex items-center gap-4 px-5 h-10 border-t border-line font-mono text-[10.5px] text-soft">
              <span><kbd className="text-ink">↑↓</kbd> move</span>
              <span className="inline-flex items-center gap-1"><CornerDownLeft size={11} className="text-ink" /> open</span>
              <span className="ml-auto">{results.length} {results.length === 1 ? 'result' : 'results'}</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
