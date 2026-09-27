import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { mark } from './track'

// The one layer that can sit over the page (a project film, a case study, or
// the career film) lives in the URL hash, so it is deep-linkable and the
// browser Back button closes it:
//   #film-<id>      a project's film
//   #decision-<id>  a project's case study
//   #story          the career film
//   #story-<sec>    the career film, opened at that second (a transcript line
//                   writes its exact time, so up to two decimals are accepted)
const LAYER_HASH = /^#(?:(film|decision)-([a-z0-9-]+)|story(?:-(\d{1,3}(?:\.\d{1,2})?))?)$/

export function readLayerHash() {
  const m = LAYER_HASH.exec(window.location.hash)
  if (!m) return null
  if (m[1]) return { kind: m[1], id: m[2], t: 0 }
  return { kind: 'film', id: 'story', t: Number(m[3] || 0) }
}

// The time is written to two decimals at most, so what it writes, LAYER_HASH reads back.
const hashFor = ({ kind, id, t }) => {
  if (id !== 'story') return `#${kind}-${id}`
  const sec = Math.round(t * 100) / 100
  return `#story${sec ? `-${sec}` : ''}`
}

const LayerContext = createContext({ layer: null, gesture: false, openLayer: () => {}, closeLayer: () => {} })

/**
 * Owns the open layer for the whole page. `gesture` is true when a click
 * opened it (a film may start with sound) and false when the URL did (a deep
 * link, or Back/Forward), in which case a film waits on its poster instead.
 */
export function LayerProvider({ children }) {
  const [state, setState] = useState({ layer: null, gesture: false })
  const marked = useRef(false)

  useEffect(() => {
    // From the URL there is no user gesture.
    const sync = () => setState({ layer: readLayerHash(), gesture: false })
    sync()
    // Deferred a tick: the tracker starts in App's own mount effect, which runs after this one.
    if (!marked.current && readLayerHash()?.id === 'story') { marked.current = true; setTimeout(() => mark('story:open:link'), 0) }
    window.addEventListener('popstate', sync)
    window.addEventListener('hashchange', sync)
    return () => {
      window.removeEventListener('popstate', sync)
      window.removeEventListener('hashchange', sync)
    }
  }, [])

  // `source` says which door opened the story (chip | card | words) for the tracker.
  const openLayer = useCallback((kind, id, { t = 0, source } = {}) => {
    const layer = { kind, id, t }
    window.history.pushState({ layer: kind }, '', hashFor(layer))
    setState({ layer, gesture: true })
    if (id === 'story') mark(`story:open:${source || 'link'}`)
  }, [])

  const closeLayer = useCallback(() => {
    if (window.history.state?.layer) {
      window.history.back() // popstate → sync → null
    } else {
      // Arrived by deep link: clear the hash without adding a history entry.
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
      setState({ layer: null, gesture: false })
    }
  }, [])

  const value = useMemo(() => ({ ...state, openLayer, closeLayer }), [state, openLayer, closeLayer])
  return <LayerContext.Provider value={value}>{children}</LayerContext.Provider>
}

export const useLayer = () => useContext(LayerContext)
