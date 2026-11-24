import { useRef } from 'react'
import { Mail, Github, Linkedin, ArrowUpRight } from 'lucide-react'
import Reveal, { Magnetic } from './Reveal'
import Liftoff from './Liftoff'
import Orbit from './Orbit'

// The last section is the lift-off: the paper darkens into the night sky of
// the landing intro (Liftoff.jsx) and the Earth falls away below the buttons
// with everything on this page in orbit around it (Orbit.jsx).
// On ink the accent is a lighter cobalt, since the page's own is too dim there.
export default function Contact() {
  const ref = useRef(null)
  return (
    <section id="contact" ref={ref} className="relative bg-ink text-paper overflow-hidden">
      <Liftoff target={ref} />
      <div className="relative max-w-content mx-auto px-5 sm:px-8 text-center pt-[38vh] sm:pt-[42vh]">
        <Reveal>
          <p className="eyebrow text-[#9DB0FF] mb-5">Contact</p>
          <h2 className="display text-[clamp(2.6rem,9vw,7rem)] font-medium tracking-tight leading-[0.95] text-paper">
            Let’s build
            <br />
            <span className="italic text-[#9DB0FF]">something great!</span>
          </h2>
          <p className="text-paper/70 mt-7 max-w-xl mx-auto text-lg">
            Open to AI product manager roles. Email is the fastest way to reach me.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-11 flex flex-wrap items-center justify-center gap-4">
            <Magnetic>
              <a href="mailto:aadityasp@gmail.com"
                className="rounded-full bg-paper text-ink font-medium px-7 py-4 flex items-center gap-2 hover:bg-[#9DB0FF] transition-colors">
                <Mail size={18} /> aadityasp@gmail.com
              </a>
            </Magnetic>
            <Magnetic>
              <a href="https://www.linkedin.com/in/aadityasp/" target="_blank" rel="noreferrer"
                className="rounded-full border border-paper/30 bg-ink/40 px-7 py-4 flex items-center gap-2 hover:border-paper transition-colors">
                <Linkedin size={18} /> LinkedIn <ArrowUpRight size={15} />
              </a>
            </Magnetic>
            <Magnetic>
              <a href="https://github.com/aadityasp" target="_blank" rel="noreferrer"
                className="rounded-full border border-paper/30 bg-ink/40 px-7 py-4 flex items-center gap-2 hover:border-paper transition-colors">
                <Github size={18} /> GitHub <ArrowUpRight size={15} />
              </a>
            </Magnetic>
          </div>
        </Reveal>
      </div>

      <Orbit section={ref} />

      <footer className="relative max-w-content mx-auto px-5 sm:px-8 py-7 border-t border-paper/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-paper/55">
        <span className="font-mono text-xs">© 2026 Aditya Appana</span>
        <span className="font-mono text-xs">Anonymous visit analytics. No third-party trackers.</span>
        <span className="font-mono text-xs">Built AI-first with React + Framer Motion</span>
      </footer>
    </section>
  )
}
