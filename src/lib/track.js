// Lightweight first-party analytics. Sends to a private collector.
// Every path is wrapped so a failure here can never affect the page.

const ENDPOINT = 'https://portfolio-collector.vercel.app/api/track'
const VID_KEY = 'pf_vid'
const OPTOUT_KEY = 'pf_notrack'
const SID_KEY = 'pf_sid'
const SID_TTL = 30 * 60 * 1000

const rid = () =>
  (crypto?.randomUUID?.() || Math.random().toString(36).slice(2) + Date.now().toString(36))
    .replace(/-/g, '').slice(0, 22)

function store(area, key, val) {
  try {
    if (val === undefined) return area.getItem(key)
    area.setItem(key, val)
    return val
  } catch { return null }
}

function visitorId() {
  let v = store(localStorage, VID_KEY)
  if (!v) { v = rid(); store(localStorage, VID_KEY, v) }
  return v
}

function sessionId() {
  try {
    const raw = store(sessionStorage, SID_KEY)
    const now = Date.now()
    if (raw) {
      const [id, ts] = raw.split('|')
      if (id && now - Number(ts) < SID_TTL) {
        store(sessionStorage, SID_KEY, `${id}|${now}`)
        return id
      }
    }
    const id = rid()
    store(sessionStorage, SID_KEY, `${id}|${now}`)
    return id
  } catch { return rid() }
}

// Sections come from the nav's own anchor links, so this stays right
// even if sections get added, renamed or reordered later.
function sectionTargets() {
  const ids = new Set()
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    const id = a.getAttribute('href').slice(1)
    if (id && id.length < 40) ids.add(id)
  })
  return [...ids].map((id) => document.getElementById(id)).filter(Boolean)
}

function clickLabel(a) {
  const href = a.getAttribute('href') || ''
  if (href.startsWith('mailto:')) return 'email'
  if (href.startsWith('tel:')) return 'phone'
  if (href.startsWith('#')) return null
  if (/\.pdf($|\?)/i.test(href) || /resume|cv\b/i.test(href + ' ' + (a.textContent || ''))) return 'resume'
  try {
    const u = new URL(href, location.href)
    if (u.hostname === location.hostname) return null
    const host = u.hostname.replace(/^www\./, '')
    if (/linkedin\./.test(host)) return 'linkedin'
    if (/github\./.test(host)) return 'github'
    return host + (u.pathname !== '/' ? u.pathname.slice(0, 40) : '')
  } catch { return null }
}

export function initTracking() {
  try {
    const params = new URLSearchParams(location.search)

    // Visiting with ?nt=1 permanently silences this browser. Use it on your
    // own devices so your visits never pollute the numbers.
    if (params.get('nt') === '1') store(localStorage, OPTOUT_KEY, '1')
    if (params.get('nt') === '0') { try { localStorage.removeItem(OPTOUT_KEY) } catch {} }
    if (store(localStorage, OPTOUT_KEY) === '1') return

    const sid = sessionId()
    const vid = visitorId()

    const eng = { sec: 0, scroll: 0, sections: [], clicks: [] }
    let seq = 0
    let visibleSince = document.visibilityState === 'visible' ? Date.now() : 0

    const base = () => ({
      sid, vid,
      tag: params.get('s') || params.get('src') || '',
      utm: {
        source: params.get('utm_source') || '', medium: params.get('utm_medium') || '',
        campaign: params.get('utm_campaign') || '', content: params.get('utm_content') || '',
      },
      ref: document.referrer || '',
      path: location.pathname,
      qs: location.search.slice(0, 300),
      screen: `${screen.width}x${screen.height}`,
      lang: navigator.language || '',
      tz: Intl.DateTimeFormat().resolvedOptions().timeZone || '',
    })

    const send = (n) => {
      try {
        if (visibleSince) { eng.sec += Math.round((Date.now() - visibleSince) / 1000); visibleSince = Date.now() }
        const body = JSON.stringify({ ...base(), seq: n, eng })
        // text/plain keeps this a simple request, so there is no CORS preflight.
        if (navigator.sendBeacon) {
          navigator.sendBeacon(ENDPOINT, new Blob([body], { type: 'text/plain;charset=UTF-8' }))
        } else {
          fetch(ENDPOINT, { method: 'POST', body, keepalive: true, mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain;charset=UTF-8' } }).catch(() => {})
        }
      } catch { /* never surface an analytics failure */ }
    }

    const onScroll = () => {
      try {
        const h = document.documentElement.scrollHeight - window.innerHeight
        const pct = h > 0 ? Math.round((window.scrollY / h) * 100) : 100
        if (pct > eng.scroll) eng.scroll = Math.min(100, pct)
      } catch {}
    }
    addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !eng.sections.includes(e.target.id)) eng.sections.push(e.target.id)
        }
      }, { threshold: 0.35 })
      // Sections mount with the React tree, so observe after the first paint.
      setTimeout(() => { try { sectionTargets().forEach((el) => io.observe(el)) } catch {} }, 800)
    }

    document.addEventListener('click', (e) => {
      try {
        const a = e.target.closest?.('a[href]')
        if (!a) return
        const label = clickLabel(a)
        if (label && eng.clicks.length < 50) eng.clicks.push(label)
      } catch {}
    }, true)

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        if (seq < 6) send(++seq)
        if (visibleSince) { eng.sec += Math.round((Date.now() - visibleSince) / 1000); visibleSince = 0 }
      } else if (!visibleSince) {
        visibleSince = Date.now()
      }
    })
    addEventListener('pagehide', () => { if (seq < 6) send(++seq) }, { once: true })

    // Fire immediately so a visitor who bounces in two seconds still counts.
    send(0)
  } catch { /* analytics must never break the site */ }
}
