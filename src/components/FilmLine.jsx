import { Music2, Play, Volume2 } from 'lucide-react'
import { clock } from '../lib/duration'

/**
 * The film's credit line, directly under a cover. Never on the cover itself.
 * `audio` is 'narrated' (the project films) or 'music' (the career film has
 * no narration, so the line says so before anyone presses play). `divider`
 * is off when the line is the last row of its card. `shortLabel` replaces
 * `label` when the card is too narrow for it (see .film-line in index.css).
 */
export default function FilmLine({
  label = 'Play the film', shortLabel, seconds, audio = 'narrated', pad, tall, divider = true, ariaLabel, describedBy, onPlay,
}) {
  return (
    <button
      type="button" onClick={onPlay}
      aria-label={ariaLabel} aria-describedby={describedBy}
      className={`film-line group/film w-full ${tall ? 'h-12' : 'h-11'} ${pad} flex items-center gap-2.5 ${divider ? 'border-b border-line' : ''} bg-paper/50 text-left transition-colors hover:bg-accent/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent`}
    >
      <span className="shrink-0 w-[22px] h-[22px] rounded-full bg-ink text-paper grid place-items-center transition-colors duration-200 group-hover/film:bg-accent">
        <Play size={9} fill="currentColor" strokeWidth={0} className="translate-x-[0.5px]" />
      </span>
      <span className="text-[13px] font-medium text-ink whitespace-nowrap transition-colors duration-200 group-hover/film:text-accent">
        <span className={`fl-full${shortLabel ? ' has-short' : ''}`}>{label}</span>
        {shortLabel && <span className="fl-short">{shortLabel}</span>}
      </span>
      {/* soft, not faint: at this size faint is 2.7:1 on the line's background. */}
      <span className="font-mono text-[11px] text-soft tabular-nums">{clock(seconds)}</span>
      <span className="ml-auto inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-soft whitespace-nowrap">
        {audio === 'music' ? (
          <>
            <Music2 size={12} />
            <span className="hidden sm:inline">Music, no narration</span>
            <span className="sm:hidden">Music only</span>
          </>
        ) : (
          <>
            <Volume2 size={12} /> <span className="fl-tag-text">Narrated</span>
          </>
        )}
      </span>
    </button>
  )
}
