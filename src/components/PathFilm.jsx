import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { story } from '../data/story'
import { useLayer } from '../lib/layer'
import { spoken } from '../lib/duration'
import FilmLine from './FilmLine'
import Transcript from './Transcript'

/**
 * The career film's home: a poster card at the head of the Timeline, built
 * from the project cards' anatomy (cover, credit line under it, the dark
 * player), with the whole film in words underneath for anyone who would
 * rather read it. Every door here opens the same layer (#story).
 *
 * Renders two siblings (the card, then the words) so the Timeline head can
 * place the words on their own grid row and the heading stays level with
 * the card when the words are open.
 */
export default function PathFilm() {
  const { openLayer } = useLayer()
  const open = (source, t = 0) => openLayer('film', 'story', { source, t })

  return (
    <>
      <div className="relative mt-8 lg:mt-0">
        {/* A faint tilted block behind the card, the device the hero photo uses. */}
        <div className="absolute -inset-2.5 rounded-[22px] bg-accent/10 rotate-[1.5deg]" aria-hidden />
        <motion.div
          whileHover={{ y: -5 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          className="group relative bg-paper2 border border-line rounded-2xl overflow-hidden shadow-[0_18px_50px_rgba(25,21,16,0.12)]"
        >
          {/* The cover is clickable but not a tab stop; the credit line below is the control. */}
          <div className="aspect-video overflow-hidden border-b border-line cursor-pointer" onClick={() => open('card')} aria-hidden>
            <img
              src={story.poster} width="1280" height="720" alt="" loading="lazy" decoding="async"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
          </div>
          <FilmLine
            tall pad="px-5" divider={false} seconds={story.seconds} audio="music"
            ariaLabel={`Play the film: the path, ${spoken(story.seconds)}, music only, no narration`}
            describedBy="story-words-intro"
            onPlay={() => open('card')}
          />
        </motion.div>
      </div>

      <details className="group/words mt-4 lg:col-start-2">
        {/* On a phone the padding makes a 44px touch target; the negative margin keeps the line where it is. */}
        <summary className="inline-flex items-center gap-1.5 py-3.5 -my-3.5 sm:py-0 sm:my-0 cursor-pointer list-none [&::-webkit-details-marker]:hidden font-mono text-[11px] uppercase tracking-[0.16em] text-accent hover:text-accent-ink transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
          <ChevronRight size={12} className="transition-transform group-open/words:rotate-90" />
          <span className="group-open/words:hidden">Read the film instead</span>
          <span className="hidden group-open/words:inline">Hide the words</span>
        </summary>
        <p id="story-words-intro" className="text-sm text-soft mt-3">
          The film is music only. Every word it shows is below, in order.
        </p>
        <Transcript beats={story.transcript} titles={story.titles} variant="page" onSeek={(t) => open('words', t)} className="mt-2" />
      </details>
    </>
  )
}
