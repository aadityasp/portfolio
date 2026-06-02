import { Mail, Github, ArrowUpRight } from 'lucide-react'
import Reveal, { Magnetic } from './Reveal'

export default function Contact() {
  return (
    <section id="contact" className="relative py-28 sm:py-40 border-t border-line">
      <div className="max-w-content mx-auto px-5 sm:px-8 text-center">
        <Reveal>
          <p className="eyebrow text-accent mb-5">Contact</p>
          <h2 className="display text-[clamp(2.6rem,9vw,7rem)] font-medium tracking-tight leading-[0.95] text-ink">
            Let’s build
            <br />
            <span className="italic text-accent">something.</span>
          </h2>
          <p className="text-soft mt-7 max-w-xl mx-auto text-lg">
            Open to product and founding-engineer conversations. Email is the fastest way to reach me.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-11 flex flex-wrap items-center justify-center gap-4">
            <Magnetic>
              <a href="mailto:aadityasp@gmail.com"
                className="rounded-full bg-ink text-paper font-medium px-7 py-4 flex items-center gap-2 hover:bg-accent transition-colors">
                <Mail size={18} /> aadityasp@gmail.com
              </a>
            </Magnetic>
            <Magnetic>
              <a href="https://github.com/aadityasp" target="_blank" rel="noreferrer"
                className="rounded-full border border-line px-7 py-4 flex items-center gap-2 hover:border-ink transition-colors">
                <Github size={18} /> GitHub <ArrowUpRight size={15} />
              </a>
            </Magnetic>
          </div>
        </Reveal>
      </div>

      <footer className="max-w-content mx-auto px-5 sm:px-8 mt-24 pt-8 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-soft">
        <span className="font-mono text-xs">© 2026 Aditya Appana</span>
        <span className="font-mono text-xs">Built AI-first with React + Framer Motion</span>
      </footer>
    </section>
  )
}
