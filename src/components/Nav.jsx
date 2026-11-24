import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, Search, X } from 'lucide-react'

const links = [
  { href: '#work', label: 'Work' },
  { href: '#timeline', label: 'Timeline' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
]

export default function Nav({ onSearch }) {
  // The shortcut shown on the Search button: the Command key on Apple devices, Ctrl elsewhere.
  const mod = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent) ? '⌘' : 'Ctrl'
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -70, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-3 bg-paper/80 backdrop-blur-md border-b border-line' : 'py-5'
      }`}
    >
      <nav className="max-w-content mx-auto px-5 sm:px-8 flex items-center justify-between">
        <a href="#top" className="font-display text-lg font-semibold tracking-tight">
          Aditya Appana
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-soft hover:text-ink transition-colors">
              {l.label}
            </a>
          ))}
          <button
            type="button" onClick={onSearch} aria-label="Search this portfolio" aria-keyshortcuts="Meta+K Control+K"
            className="group inline-flex items-center gap-2 h-9 pl-3 pr-2 rounded-full border border-line bg-paper/60 text-sm text-soft hover:text-ink hover:border-ink/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <Search size={14} /> Search
            <kbd className="font-mono text-[10px] text-soft border border-line rounded px-1.5 py-0.5 group-hover:border-ink/30">{mod} K</kbd>
          </button>
          <a href="#contact"
            className="text-sm font-medium rounded-full bg-ink text-paper px-4 py-2 hover:bg-accent transition-colors">
            Say hi
          </a>
        </div>

        <div className="md:hidden flex items-center gap-1">
          <button type="button" className="p-2 text-ink rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent" onClick={onSearch} aria-label="Search this portfolio">
            <Search size={20} />
          </button>
          <button className="p-2 -mr-2 text-ink" onClick={() => setOpen((v) => !v)} aria-label="Menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-paper border-t border-line mt-3"
          >
            <div className="flex flex-col px-6 py-4 gap-4">
              {links.map((l) => (
                <a key={l.href} href={l.href} onClick={() => setOpen(false)}
                  className="text-base text-soft hover:text-ink transition-colors">
                  {l.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
