import { useEffect, useRef, useState } from 'react'
import Cover from './covers'

// Renders a project cover with the right treatment so nothing looks zoomed.
// Fills its parent; parent controls the height.
//
// Motion covers (video / slideshow / animated svg) only run while the card is
// on screen or hovered, so a page full of projects stays cheap to render.
// Anything that fails to load degrades to the hand-drawn SVG cover instead of
// a broken-image glyph.

function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    if (typeof matchMedia !== 'function') return
    const mq = matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener?.('change', sync)
    return () => mq.removeEventListener?.('change', sync)
  }, [])
  return reduced
}

// Live while the card is comfortably on screen, or while the pointer is on it.
function useLive(ref) {
  const [inView, setInView] = useState(false)
  const [hover, setHover] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.35, rootMargin: '0px 0px -10% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref])

  const handlers = {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
  }
  return [inView || hover, handlers]
}

const SHELL = 'w-full h-full grid place-items-center bg-[radial-gradient(120%_120%_at_50%_0%,#EEF1FD_0%,#ECE7DB_70%)]'

export default function Media({ cover, alt }) {
  const ref = useRef(null)
  const videoRef = useRef(null)
  const [live, handlers] = useLive(ref)
  const reduced = useReducedMotion()
  const [failed, setFailed] = useState(false)
  const [slide, setSlide] = useState(0)

  const active = live && !reduced

  // Drive the video off the same signal rather than autoplaying everything.
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (active) {
      const p = v.play()
      if (p && typeof p.catch === 'function') p.catch(() => {})
    } else {
      v.pause()
    }
  }, [active, cover])

  // Slideshow covers advance only while live.
  const frames = cover.type === 'slideshow' ? cover.srcs || [] : []
  useEffect(() => {
    if (cover.type !== 'slideshow' || !active || frames.length < 2) return
    const id = setInterval(() => setSlide((s) => (s + 1) % frames.length), cover.interval || 2200)
    return () => clearInterval(id)
  }, [cover.type, cover.interval, active, frames.length])

  const wrap = (children) => (
    <div ref={ref} {...handlers} className="w-full h-full">
      {children}
    </div>
  )

  // A cover that failed to load falls back to generated art, never a broken icon.
  if (failed || cover.type === 'svg') {
    return wrap(<Cover variant={cover.variant || cover.fallback || 'trading'} active={active} />)
  }

  if (cover.type === 'icon') {
    return wrap(
      <div className={SHELL}>
        <img
          src={cover.src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="w-[40%] max-w-[120px] aspect-square object-contain rounded-[22%] shadow-[0_10px_30px_rgba(25,21,16,0.14)] ring-1 ring-black/5 bg-white"
        />
      </div>,
    )
  }

  if (cover.type === 'slideshow') {
    return wrap(
      <div className="relative w-full h-full bg-paper2 overflow-hidden">
        {frames.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={i === 0 ? alt : ''}
            loading="lazy"
            decoding="async"
            onError={() => i === 0 && setFailed(true)}
            className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-700 ${i === slide ? 'opacity-100' : 'opacity-0'}`}
          />
        ))}
        {frames.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {frames.map((src, i) => (
              <span
                key={src}
                className={`h-1 rounded-full transition-all duration-500 ${i === slide ? 'w-4 bg-white/90' : 'w-1.5 bg-white/50'}`}
              />
            ))}
          </div>
        )}
      </div>,
    )
  }

  if (cover.type === 'shot' && cover.frame === 'phone') {
    return wrap(
      <div className={`${SHELL} p-4`}>
        <img
          src={cover.src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="h-full w-auto max-w-full object-contain rounded-2xl shadow-[0_12px_34px_rgba(25,21,16,0.18)] ring-1 ring-black/5"
        />
      </div>,
    )
  }

  if (cover.type === 'shot') {
    // web / desktop screenshot inside a minimal browser window
    return wrap(
      <div className="w-full h-full flex flex-col bg-paper2">
        <div className="flex items-center gap-1.5 px-3 h-7 shrink-0 border-b border-line bg-paper2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E5705B]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#E8C15B]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#7DBE6A]" />
        </div>
        <div className="relative flex-1 overflow-hidden bg-white">
          <img
            src={cover.src}
            alt={alt}
            loading="lazy"
            decoding="async"
            onError={() => setFailed(true)}
            className="w-full h-full object-cover object-top"
          />
        </div>
      </div>,
    )
  }

  // Video never swaps to fallback art. Scroll-reveal remounts the element
  // mid-load and the resulting abort is indistinguishable enough from a real
  // failure that latching on it silently killed working covers. The poster is
  // already a real product still, so a video that cannot play just stays on it.
  if (cover.type === 'video') {
    const inner = (
      <video
        ref={videoRef}
        src={cover.src}
        poster={cover.poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={alt}
        className="w-full h-full object-cover"
      />
    )
    if (cover.frame === 'web') {
      return wrap(
        <div className="w-full h-full flex flex-col bg-paper2">
          <div className="flex items-center gap-1.5 px-3 h-7 shrink-0 border-b border-line bg-paper2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E5705B]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#E8C15B]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#7DBE6A]" />
          </div>
          <div className="relative flex-1 overflow-hidden bg-black">{inner}</div>
        </div>,
      )
    }
    return wrap(inner)
  }

  // photo
  return wrap(
    <img
      src={cover.src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className="w-full h-full object-cover"
    />,
  )
}
