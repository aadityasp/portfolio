import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { featured, apps, research } from '../data/projects'
import Cover from './covers'
import Reveal, { stagger, item } from './Reveal'

function CoverMedia({ cover, alt }) {
  if (cover.type === 'svg') return <Cover variant={cover.variant} />
  if (cover.type === 'video')
    return (
      <video
        src={cover.src}
        muted loop autoPlay playsInline
        className="w-full h-full object-cover"
      />
    )
  return (
    <img
      src={cover.src}
      alt={alt}
      loading="lazy"
      className={`w-full h-full ${cover.contain ? 'object-contain p-8 bg-[#0e0e16]' : 'object-cover'}`}
    />
  )
}

function Tag({ children }) {
  return (
    <span className="text-[11px] font-mono text-muted border border-line rounded-full px-2.5 py-1 whitespace-nowrap">
      {children}
    </span>
  )
}

function LinkBtn({ link }) {
  return (
    <a href={link.href} target="_blank" rel="noreferrer"
      className="inline-flex items-center gap-1 text-sm font-medium text-glow hover:text-white transition-colors">
      {link.label} <ArrowUpRight size={15} />
    </a>
  )
}

function FeaturedCard({ p, i }) {
  return (
    <Reveal delay={i * 0.05}>
      <motion.article
        whileHover={{ y: -6 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        className="group glass rounded-3xl overflow-hidden h-full flex flex-col"
      >
        <div className="relative h-60 sm:h-72 overflow-hidden">
          <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.04]">
            <CoverMedia cover={p.cover} alt={p.name} />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-transparent" />
          {p.badge && (
            <span className="absolute top-4 left-4 text-[11px] font-mono bg-accent/90 text-white rounded-full px-3 py-1 backdrop-blur">
              {p.badge}
            </span>
          )}
        </div>
        <div className="p-6 sm:p-7 flex flex-col flex-1">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-display text-xl sm:text-2xl font-semibold">{p.name}</h3>
            <span className="font-mono text-[11px] text-glow whitespace-nowrap">{p.status}</span>
          </div>
          <p className="font-mono text-xs text-accent-soft mt-1">{p.tagline}</p>
          <p className="text-muted mt-3 leading-relaxed text-[15px]">{p.blurb}</p>
          <div className="flex flex-wrap gap-1.5 mt-4">
            {p.stack.map((s) => <Tag key={s}>{s}</Tag>)}
          </div>
          {p.links?.length > 0 && (
            <div className="flex gap-5 mt-5 pt-4 border-t border-line">
              {p.links.map((l) => <LinkBtn key={l.href} link={l} />)}
            </div>
          )}
        </div>
      </motion.article>
    </Reveal>
  )
}

function AppCard({ p }) {
  return (
    <motion.article
      variants={item}
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className="group glass rounded-2xl overflow-hidden flex flex-col"
    >
      <div className="relative h-40 overflow-hidden">
        <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.05]">
          <CoverMedia cover={p.cover} alt={p.name} />
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-display text-lg font-semibold leading-tight">{p.name}</h3>
        </div>
        {p.status && <span className="font-mono text-[11px] text-glow mt-0.5">{p.status}</span>}
        <p className="text-muted mt-2 text-sm leading-relaxed flex-1">{p.blurb}</p>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {p.stack.map((s) => <Tag key={s}>{s}</Tag>)}
        </div>
        {p.links?.length > 0 && (
          <div className="flex gap-4 mt-4 pt-3 border-t border-line">
            {p.links.map((l) => <LinkBtn key={l.href} link={l} />)}
          </div>
        )}
      </div>
    </motion.article>
  )
}

function SectionHead({ kicker, title, sub }) {
  return (
    <Reveal className="mb-10">
      <p className="font-mono text-sm text-glow mb-3">{kicker}</p>
      <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight">{title}</h2>
      {sub && <p className="text-muted mt-4 max-w-2xl text-lg">{sub}</p>}
    </Reveal>
  )
}

export default function Projects() {
  return (
    <section id="work" className="relative py-24 sm:py-32">
      <div className="max-w-content mx-auto px-5 sm:px-8">
        <SectionHead
          kicker="01 — Selected work"
          title="Flagship builds"
          sub="The big ones: production retail systems, a loyalty platform, fintech automation, and clinical AI."
        />
        <div className="grid md:grid-cols-2 gap-6">
          {featured.map((p, i) => <FeaturedCard key={p.id} p={p} i={i} />)}
        </div>

        <div className="mt-24">
          <SectionHead
            kicker="02 — More apps"
            title="Shipped fast, end to end"
            sub="Most of these went from idea to working build in two or three days."
          />
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {apps.map((p) => <AppCard key={p.id} p={p} />)}
          </motion.div>
        </div>

        <div className="mt-24">
          <SectionHead kicker="03 — Earlier & research" title="Where it started" />
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {research.map((p) => <AppCard key={p.id} p={p} />)}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
