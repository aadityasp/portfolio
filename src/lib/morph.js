import { useLayoutEffect } from 'react'
import { animate, useMotionValue } from 'framer-motion'

// A layer grows out of whatever opened it (a project card, a cover, the hero
// chip) and folds back into it on close. The opener is remembered here as an
// element, not a rectangle, so it is measured fresh each time it is needed.
// Opened from the URL or the command palette there is no opener, and the
// layer just rises into place.
let originEl = null
export const setOrigin = (el) => { originEl = el || null }

const EASE = [0.22, 1, 0.36, 1]
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Where `el` (sitting untransformed at its final place) would have to move
// and scale to lie exactly over the opener.
function offsets(el) {
  if (!el || !originEl?.isConnected || reduced()) return null
  const o = originEl.getBoundingClientRect(), r = el.getBoundingClientRect()
  if (o.width < 1 || o.height < 1 || r.width < 1 || r.height < 1) return null
  if (o.bottom < 0 || o.top > window.innerHeight) return null // the opener is off screen
  return {
    x: o.left + o.width / 2 - (r.left + r.width / 2),
    y: o.top + o.height / 2 - (r.top + r.height / 2),
    scaleX: o.width / r.width,
    scaleY: o.height / r.height,
  }
}

/**
 * Drives one element (`ref`) through that move. Spread `style` on a motion
 * element, give it `variants={variants} exit="exit"`, and put `content` on
 * the opacity of whatever is inside, so the insides fade in once the shape
 * has mostly arrived instead of being seen stretched.
 */
export function useMorph(open, ref) {
  const x = useMotionValue(0), y = useMotionValue(0)
  const scaleX = useMotionValue(1), scaleY = useMotionValue(1)
  const opacity = useMotionValue(0), content = useMotionValue(0)

  useLayoutEffect(() => {
    if (!open) return
    x.set(0); y.set(0); scaleX.set(1); scaleY.set(1)
    const from = offsets(ref.current)
    const runs = []
    if (from) {
      x.set(from.x); y.set(from.y); scaleX.set(from.scaleX); scaleY.set(from.scaleY)
      opacity.set(0.4); content.set(0)
      const t = { duration: 0.5, ease: EASE }
      runs.push(animate(x, 0, t), animate(y, 0, t), animate(scaleX, 1, t), animate(scaleY, 1, t),
        animate(opacity, 1, { duration: 0.18 }), animate(content, 1, { duration: 0.3, delay: 0.16 }))
    } else {
      y.set(reduced() ? 0 : 24); opacity.set(0); content.set(1)
      runs.push(animate(y, 0, { duration: 0.4, ease: EASE }), animate(opacity, 1, { duration: 0.22 }))
    }
    return () => runs.forEach((r) => r.stop())
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  const variants = {
    exit: () => {
      // The insides leave first. Driven from here, not from an `exit` prop on each
      // element: several elements share this one value, and two exit animations on
      // one value cancel each other, which leaves the layer waiting forever.
      animate(content, 0, { duration: 0.12 })
      const to = offsets(ref.current)
      return to
        ? { ...to, opacity: 0, transition: { duration: 0.36, ease: EASE, opacity: { duration: 0.2, delay: 0.16 } } }
        : { y: 16, opacity: 0, transition: { duration: 0.2 } }
    },
  }
  return { style: { x, y, scaleX, scaleY, opacity }, content, variants }
}
