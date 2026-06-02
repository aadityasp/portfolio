import { motion } from 'framer-motion'
import { Mail, Github, ArrowUpRight } from 'lucide-react'
import Reveal from './Reveal'

export default function Contact() {
  return (
    <section id="contact" className="relative py-28 sm:py-36 border-t border-line bg-aurora">
      <div className="max-w-content mx-auto px-5 sm:px-8 text-center">
        <Reveal>
          <p className="font-mono text-sm text-glow mb-4">06 — Contact</p>
          <h2 className="font-display text-4xl sm:text-6xl font-bold tracking-tight">
            Have something to <span className="text-gradient">build?</span>
          </h2>
          <p className="text-muted mt-5 max-w-xl mx-auto text-lg">
            I’m open to product, founding-engineer and AI-build work. The fastest way to reach me is email.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <motion.a
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}
              href="mailto:aadityasp@gmail.com"
              className="rounded-full bg-white text-ink font-medium px-7 py-3.5 flex items-center gap-2 hover:bg-accent hover:text-white transition-colors"
            >
              <Mail size={18} /> aadityasp@gmail.com
            </motion.a>
            <a href="https://github.com/aadityasp" target="_blank" rel="noreferrer"
              className="rounded-full glass px-7 py-3.5 flex items-center gap-2 hover:border-white/30 transition-colors">
              <Github size={18} /> GitHub <ArrowUpRight size={15} />
            </a>
          </div>
        </Reveal>
      </div>

      <footer className="max-w-content mx-auto px-5 sm:px-8 mt-24 pt-8 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted">
        <span>© {2026} Aditya Sri Prasad</span>
        <span className="font-mono text-xs">Built AI-first with React + Framer Motion</span>
      </footer>
    </section>
  )
}
