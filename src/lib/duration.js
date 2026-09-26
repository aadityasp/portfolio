// Film lengths, from the `seconds` field in src/data/projects.js.
// Round first, then split, so 59.93 s reads 1:00 and never 0:60.

export function clock(seconds) {
  const t = Math.round(seconds)
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`
}

// Screen-reader form: "1 minute 9 seconds".
export function spoken(seconds) {
  const t = Math.round(seconds)
  const m = Math.floor(t / 60)
  const s = t % 60
  const part = (n, unit) => `${n} ${unit}${n === 1 ? '' : 's'}`
  return [m && part(m, 'minute'), s && part(s, 'second')].filter(Boolean).join(' ')
}

// Case-study read time at 265 words a minute (Medium's rate), never under a minute.
export function readMinutes(texts) {
  const words = texts.join(' ').split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 265))
}
