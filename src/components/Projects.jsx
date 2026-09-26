import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Play, ScrollText, Volume2 } from 'lucide-react'
import { featured, apps, research } from '../data/projects'
import { decisionsFor } from '../data/decisions'
import DecisionLayer from './DecisionLayer'
import FilmLayer from './FilmLayer'
import Media, { CoversPaused } from './Media'
import Reveal, { stagger, item } from './Reveal'
import { clock, readMinutes, spoken } from '../lib/duration'

// Status is the one status signal on a card: a neutral pill with a colored dot,
// never the link color. Anything not listed here reads as private (grey).
const TONE = {
  Live: 'live',
  'In production': 'live',
  'On the App Store': 'live',
  Shipped: 'live',
  'Shipped internally': 'live',
  'Open source': 'live',
  'In App Store review': 'building',
  'Open beta': 'building',
  'In beta with doctors': 'building',
  'Active dev': 'building',
  'Build ready': 'building',
}
const DOT = { live: 'bg-[#3F9A5E]', building: 'bg-[#D39A2C]', private: 'bg-faint' }

function Status({ status }) {
  const tone = TONE[status] || 'private'
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-soft bg-paper/70 border border-line rounded-full pl-2 pr-2.5 py-0.5 whitespace-nowrap">
      <span className={`w-1.5 h-1.5 rounded-full ${DOT[tone]} ${tone === 'live' ? 'animate-pulseDot motion-reduce:animate-none' : ''}`} />
      {status}
    </span>
  )
}

function Tag({ children }) {
  return (
    <span className="font-mono text-[11px] text-soft border border-line rounded-full px-2.5 py-1 whitespace-nowrap">
      {children}
    </span>
  )
}

/** The film's credit line, directly under the cover. Never on the cover itself. */
function FilmLine({ p, pad, tall, onPlay }) {
  return (
    <button
      type="button" onClick={() => onPlay(p.id)}
      aria-label={`Play the ${p.name} film, ${spoken(p.film.seconds)}, narrated, with sound`}
      className={`group/film w-full ${tall ? 'h-12' : 'h-11'} ${pad} flex items-center gap-2.5 border-b border-line bg-paper/50 text-left transition-colors hover:bg-accent/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent`}
    >
      <span className="shrink-0 w-[22px] h-[22px] rounded-full bg-ink text-paper grid place-items-center transition-colors duration-200 group-hover/film:bg-accent">
        <Play size={9} fill="currentColor" strokeWidth={0} className="translate-x-[0.5px]" />
      </span>
      <span className="text-[13px] font-medium text-ink whitespace-nowrap transition-colors duration-200 group-hover/film:text-accent">Play the film</span>
      <span className="font-mono text-[11px] text-faint tabular-nums">{clock(p.film.seconds)}</span>
      <span className="ml-auto inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-faint whitespace-nowrap">
        <Volume2 size={12} /> Narrated
      </span>
    </button>
  )
}

/** The case study in the same slot, for a card that has one and no film. */
function StudyLine({ p, minutes, pad, tall, onOpen }) {
  return (
    <button
      type="button" onClick={() => onOpen(p.id)}
      aria-label={`Read the ${p.name} case study, ${minutes} minute read`}
      className={`group/film w-full ${tall ? 'h-12' : 'h-11'} ${pad} flex items-center gap-2.5 border-b border-line bg-paper/50 text-left transition-colors hover:bg-accent/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent`}
    >
      <span className="shrink-0 w-[22px] h-[22px] rounded-full bg-ink text-paper grid place-items-center transition-colors duration-200 group-hover/film:bg-accent">
        <ScrollText size={11} />
      </span>
      <span className="text-[13px] font-medium text-ink whitespace-nowrap transition-colors duration-200 group-hover/film:text-accent">Read the case study</span>
      <span className="font-mono text-[11px] text-faint tabular-nums whitespace-nowrap">{minutes} min</span>
      {tall && <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.16em] text-faint whitespace-nowrap">Problem → Result</span>}
    </button>
  )
}

function PrimaryLink({ link }) {
  return (
    <a href={link.href} target="_blank" rel="noreferrer"
      className="inline-flex items-center gap-1.5 text-[13px] font-medium text-paper bg-ink rounded-full pl-3.5 pr-3 py-1.5 hover:bg-accent transition-colors">
      {link.label} <ArrowUpRight size={14} />
    </a>
  )
}

function TextLink({ link }) {
  return (
    <a href={link.href} target="_blank" rel="noreferrer"
      className="inline-flex items-center gap-1 text-[13px] font-medium text-accent hover:text-accent-ink transition-colors">
      {link.label} <ArrowUpRight size={14} />
    </a>
  )
}

/** Opens the case study layer for this card only (rendered when the project has a write-up). */
function CaseStudyBtn({ minutes, onClick }) {
  return (
    <button type="button" onClick={onClick}
      className="inline-flex items-center gap-1.5 text-[13px] font-medium text-paper bg-ink rounded-full px-3.5 py-1.5 hover:bg-accent transition-colors">
      <ScrollText size={14} /> Case study <span className="font-normal text-paper/60">· {minutes} min</span>
    </button>
  )
}

// The footer is for using the thing. One filled pill per card: the first link,
// or the case study when a film already holds the story slot. Everything else
// is a text link. A card with nothing to open shows its note (why there is no
// public build) in the same slot, under the same divider.
function Footer({ p, minutes, studyHere, pad, bottom, onOpenDecision }) {
  const links = p.links || []
  const hasStudy = studyHere
  if (!hasStudy && !links.length && !p.note) return <div aria-hidden />
  const secondary = hasStudy ? links : links.slice(1)
  return (
    <div className={`${pad} ${bottom}`}>
      <div className="pt-4 border-t border-line">
        {p.note && <p className="font-mono text-[11px] leading-relaxed text-soft/80">{p.note}</p>}
        {(hasStudy || links.length > 0) && (
          <div className={`flex flex-wrap items-center gap-x-5 gap-y-3 ${p.note ? 'mt-4' : ''}`}>
            {hasStudy ? <CaseStudyBtn minutes={minutes} onClick={() => onOpenDecision(p.id)} /> : <PrimaryLink link={links[0]} />}
            {secondary.map((l) => <TextLink key={l.href} link={l} />)}
          </div>
        )}
      </div>
    </div>
  )
}

const SIZE = {
  lg: {
    shell: 'rounded-3xl', lift: -6, pad: 'px-6 sm:px-7', head: 'pt-6 sm:pt-7',
    title: 'text-xl sm:text-2xl', blurb: 'text-[15px] mt-3', chips: 'mt-5', foot: 'mt-6', bottom: 'pb-6 sm:pb-7',
  },
  md: {
    shell: 'rounded-2xl', lift: -5, pad: 'px-5', head: 'pt-5',
    title: 'text-lg leading-tight', blurb: 'text-sm mt-2', chips: 'mt-4', foot: 'mt-5', bottom: 'pb-5',
  },
}

// Every card spans six rows of its grid and shares them with its neighbours
// (CSS subgrid), so covers, film lines, titles, blurbs, chips and footers line
// up across a row even when one card has no film or a longer blurb. The grid
// has no row gap (it would open up between a card's own rows); cards space
// themselves with a bottom margin instead.
function Card({ p, size = 'md', onOpenFilm, onOpenDecision }) {
  const s = SIZE[size]
  const tall = size === 'lg'
  const studies = decisionsFor(p.id)
  const minutes = studies.length
    ? readMinutes(studies.flatMap((x) => [x.headline, x.context, ...x.sections.map((sec) => sec.body)]))
    : 0
  // The slot under the cover tells the story: the film, else the case study.
  const story = p.film
    ? <FilmLine p={p} pad={s.pad} tall={tall} onPlay={onOpenFilm} />
    : minutes
      ? <StudyLine p={p} minutes={minutes} pad={s.pad} tall={tall} onOpen={onOpenDecision} />
      : <div aria-hidden />
  return (
    <motion.article
      variants={item} whileHover={{ y: s.lift }} transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className={`group bg-paper2 border border-line ${s.shell} overflow-hidden grid grid-rows-subgrid row-span-6 gap-0 mb-6`}
    >
      <div className="relative aspect-video overflow-hidden border-b border-line">
        <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.03]">
          <Media cover={p.cover} alt={p.name} />
        </div>
      </div>

      {story}

      <div className={`${s.pad} ${s.head}`}>
        {p.status && <Status status={p.status} />}
        <h3 className={`display ${s.title} font-semibold text-ink ${p.status ? 'mt-2.5' : ''}`}>{p.name}</h3>
        {p.tagline && <p className="font-mono text-xs text-soft mt-1">{p.tagline}</p>}
      </div>

      <p className={`${s.pad} text-soft leading-relaxed ${s.blurb}`}>{p.blurb}</p>

      <div className={`${s.pad} ${s.chips} flex flex-wrap content-start gap-1.5`}>
        {p.stack.map((t) => <Tag key={t}>{t}</Tag>)}
      </div>

      <div className={s.foot}>
        <Footer p={p} minutes={minutes} studyHere={Boolean(minutes && p.film)} pad={s.pad} bottom={s.bottom} onOpenDecision={onOpenDecision} />
      </div>
    </motion.article>
  )
}

function Head({ kicker, title, sub }) {
  return (
    <Reveal className="mb-10">
      <p className="eyebrow text-accent mb-3">{kicker}</p>
      <h2 className="display text-3xl sm:text-5xl font-semibold tracking-tight text-ink">{title}</h2>
      {sub && <p className="text-soft mt-4 max-w-2xl text-lg">{sub}</p>}
    </Reveal>
  )
}

function Grid({ className, children }) {
  return (
    <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
      className={`grid gap-x-6 ${className}`}>
      {children}
    </motion.div>
  )
}

// The open layer lives in the URL hash (#film-<id> or #decision-<id>) so it is
// deep-linkable and the browser Back button closes it.
const LAYER_HASH = /^#(film|decision)-([a-z0-9-]+)$/
const readLayerHash = () => {
  const m = LAYER_HASH.exec(window.location.hash)
  return m ? { kind: m[1], id: m[2] } : null
}

export default function Projects() {
  const [layer, setLayer] = useState(null)

  useEffect(() => {
    const sync = () => setLayer(readLayerHash())
    sync()
    window.addEventListener('popstate', sync)
    window.addEventListener('hashchange', sync)
    return () => {
      window.removeEventListener('popstate', sync)
      window.removeEventListener('hashchange', sync)
    }
  }, [])

  const openLayer = useCallback((kind, id) => {
    window.history.pushState({ layer: kind }, '', `#${kind}-${id}`)
    setLayer({ kind, id })
  }, [])
  const openFilm = useCallback((id) => openLayer('film', id), [openLayer])
  const openDecision = useCallback((id) => openLayer('decision', id), [openLayer])

  const closeLayer = useCallback(() => {
    if (window.history.state?.layer) {
      window.history.back() // popstate → sync → null
    } else {
      // Arrived by deep link: clear the hash without adding a history entry.
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
      setLayer(null)
    }
  }, [])

  const cards = (list, size) =>
    list.map((p) => <Card key={p.id} p={p} size={size} onOpenFilm={openFilm} onOpenDecision={openDecision} />)

  return (
    <section id="work" className="relative py-24 sm:py-32">
      <CoversPaused.Provider value={layer !== null}>
        <div className="max-w-content mx-auto px-5 sm:px-8">
          <Head kicker="Selected work" title="Flagship builds"
            sub="The big ones: a production retail POS, a loyalty platform, fintech automation, and clinical AI." />
          <Grid className="md:grid-cols-2">{cards(featured, 'lg')}</Grid>

          <div className="mt-24">
            <Head kicker="More apps" title="Shipped fast, end to end"
              sub="Most of these went from idea to a working build in two or three days." />
            <Grid className="sm:grid-cols-2 lg:grid-cols-3">{cards(apps, 'md')}</Grid>
          </div>

          <div className="mt-24">
            <Head kicker="Earlier & research" title="Where it started" />
            <Grid className="sm:grid-cols-2 lg:grid-cols-3">{cards(research, 'md')}</Grid>
          </div>
        </div>
      </CoversPaused.Provider>

      <DecisionLayer projectId={layer?.kind === 'decision' ? layer.id : null} onClose={closeLayer} />
      <FilmLayer projectId={layer?.kind === 'film' ? layer.id : null} onClose={closeLayer} />
    </section>
  )
}
