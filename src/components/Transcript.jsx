import { clock } from '../lib/duration'

// 'page' sits on the cream page under the Timeline card; 'dark' sits inside
// the player, on the dark backdrop. Every text color here clears 4.5:1 on its
// surface (soft on paper 5.3:1, paper/70 on the panel 5.6:1), and the focus
// ring is the one the surface can show: cobalt on paper, paper on the dark.
const VARIANT = {
  page: {
    list: 'divide-y divide-line',
    time: 'text-accent hover:text-accent-ink',
    ring: 'focus-visible:ring-accent',
    eyebrow: 'text-soft',
    headline: 'text-ink',
    body: 'text-soft',
    titles: 'border-line text-soft',
  },
  dark: {
    list: 'divide-y divide-paper/10',
    time: 'text-paper/70 hover:text-paper',
    ring: 'focus-visible:ring-paper/70',
    eyebrow: 'text-paper/70',
    headline: 'text-paper',
    body: 'text-paper/70',
    titles: 'border-paper/10 text-paper/70',
  },
}

// Eyebrows are set in capitals, but the brand keeps its own casing, as it
// does in the film (and in the hero eyebrow).
const brandCase = (text) =>
  text.split(/(CStoreiQ)/).map((part, i) => (i % 2 ? <span key={i} className="normal-case">{part}</span> : part))

/**
 * The film, in words: every line the film shows, in order. Each beat's time
 * is a button that seeks the film to it (on the page, that opens the player
 * at that second). Shared by the Timeline card and the player.
 */
export default function Transcript({ beats, titles, variant = 'page', onSeek, className = '' }) {
  const v = VARIANT[variant]
  return (
    <div className={className}>
      <ol className={v.list}>
        {beats.map((b) => (
          <li key={b.t} className="grid grid-cols-[44px_1fr] gap-x-3 py-3">
            {/* The padding is the touch target (44px tall on a phone); the negative
                margin keeps the text where the row's first line is. */}
            <button
              type="button" onClick={() => onSeek(b.t)}
              aria-label={`Play the film from ${clock(b.t)}`}
              className={`self-start -my-3.5 py-3.5 sm:-my-1 sm:py-1 font-mono text-[11px] tabular-nums text-left transition-colors ${v.time} focus-visible:outline-none focus-visible:ring-2 ${v.ring} rounded-sm`}
            >
              {clock(b.t)}
            </button>
            <div>
              {b.eyebrow && (
                <p className={`font-mono text-[10px] uppercase tracking-[0.16em] mb-1 ${v.eyebrow}`}>{brandCase(b.eyebrow)}</p>
              )}
              <p className={`text-[14px] font-medium leading-snug ${v.headline}`}>{b.headline}</p>
              <p className={`text-[14px] leading-relaxed mt-1 ${v.body}`}>{b.body}</p>
            </div>
          </li>
        ))}
      </ol>
      {titles && <p className={`border-t pt-3 font-mono text-[11px] leading-relaxed ${v.titles}`}>{titles}</p>}
    </div>
  )
}
