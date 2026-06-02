import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { featured, apps, research } from '../data/projects'
import Media from './Media'
import Reveal, { Parallax, stagger, item } from './Reveal'

function Tag({ children }) {
  return (
    <span className="font-mono text-[11px] text-soft border border-line rounded-full px-2.5 py-1 whitespace-nowrap">
      {children}
    </span>
  )
}

function LinkBtn({ link }) {
  return (
    <a href={link.href} target="_blank" rel="noreferrer"
      className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:text-accent-ink transition-colors">
      {link.label} <ArrowUpRight size={15} />
    </a>
  )
}

function FeaturedCard({ p, i }) {
  return (
    <Reveal delay={(i % 2) * 0.06}>
      <motion.article
        whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        className="group bg-paper2 border border-line rounded-3xl overflow-hidden h-full flex flex-col"
      >
        <div className="relative h-64 sm:h-72 overflow-hidden border-b border-line">
          <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.03]">
            <Media cover={p.cover} alt={p.name} />
          </div>
          {p.badge && (
            <span className="absolute top-4 left-4 font-mono text-[11px] bg-ink text-paper rounded-full px-3 py-1">
              {p.badge}
            </span>
          )}
        </div>
        <div className="p-6 sm:p-7 flex flex-col flex-1">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="display text-xl sm:text-2xl font-semibold text-ink">{p.name}</h3>
            <span className="font-mono text-[11px] text-accent whitespace-nowrap">{p.status}</span>
          </div>
          <p className="font-mono text-xs text-soft mt-1">{p.tagline}</p>
          <p className="text-soft mt-3 leading-relaxed text-[15px]">{p.blurb}</p>
          <div className="flex flex-wrap gap-1.5 mt-4">{p.stack.map((s) => <Tag key={s}>{s}</Tag>)}</div>
          {p.links?.length > 0 && (
            <div className="flex gap-5 mt-5 pt-4 border-t border-line">{p.links.map((l) => <LinkBtn key={l.href} link={l} />)}</div>
          )}
        </div>
      </motion.article>
    </Reveal>
  )
}

function AppCard({ p }) {
  return (
    <motion.article
      variants={item} whileHover={{ y: -5 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className="group bg-paper2 border border-line rounded-2xl overflow-hidden flex flex-col"
    >
      <div className="relative h-44 overflow-hidden border-b border-line">
        <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.04]">
          <Media cover={p.cover} alt={p.name} />
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="display text-lg font-semibold leading-tight text-ink">{p.name}</h3>
        {p.status && <span className="font-mono text-[11px] text-accent mt-0.5">{p.status}</span>}
        <p className="text-soft mt-2 text-sm leading-relaxed flex-1">{p.blurb}</p>
        <div className="flex flex-wrap gap-1.5 mt-3">{p.stack.map((s) => <Tag key={s}>{s}</Tag>)}</div>
        {p.links?.length > 0 && (
          <div className="flex gap-4 mt-4 pt-3 border-t border-line">{p.links.map((l) => <LinkBtn key={l.href} link={l} />)}</div>
        )}
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

export default function Projects() {
  return (
    <section id="work" className="relative py-24 sm:py-32">
      <div className="max-w-content mx-auto px-5 sm:px-8">
        <Head kicker="Selected work" title="Flagship builds"
          sub="The big ones: a production retail POS, a loyalty platform, fintech automation, and clinical AI." />
        <div className="grid md:grid-cols-2 gap-6 items-start">
          {featured.map((p, i) => (
            <Parallax key={p.id} speed={i % 2 === 0 ? 26 : -14} className="h-full">
              <FeaturedCard p={p} i={i} />
            </Parallax>
          ))}
        </div>

        <div className="mt-24">
          <Head kicker="More apps" title="Shipped fast, end to end"
            sub="Most of these went from idea to a working build in two or three days." />
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {apps.map((p) => <AppCard key={p.id} p={p} />)}
          </motion.div>
        </div>

        <div className="mt-24">
          <Head kicker="Earlier & research" title="Where it started" />
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {research.map((p) => <AppCard key={p.id} p={p} />)}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
