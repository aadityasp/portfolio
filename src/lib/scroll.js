// The page scrolls through Lenis (smooth wheel), which captures wheel events
// globally, so `body { overflow: hidden }` alone does not stop the page moving
// behind an overlay. App.jsx registers the instance here; overlays call
// getLenis()?.stop() while open and start() on close.
let lenis = null
export const setLenis = (l) => { lenis = l }
export const getLenis = () => lenis

// Scroll an element to just under the fixed nav, smoothly when Lenis is running.
export function scrollToEl(el, offset = -88) {
  if (!el) return
  if (lenis) lenis.scrollTo(el, { offset, force: true })
  else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset })
}

// Scroll to a project card and ring it in cobalt for a moment, so the eye lands on it.
export function goToCard(id) {
  const el = document.getElementById(`project-${id}`)
  scrollToEl(el)
  if (!el) return
  el.classList.remove('card-flash')
  void el.offsetWidth // restart the animation if it is already on
  el.classList.add('card-flash')
  setTimeout(() => el.classList.remove('card-flash'), 2000)
}
