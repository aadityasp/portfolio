// The page scrolls through Lenis (smooth wheel), which captures wheel events
// globally, so `body { overflow: hidden }` alone does not stop the page moving
// behind an overlay. App.jsx registers the instance here; overlays call
// getLenis()?.stop() while open and start() on close.
let lenis = null
export const setLenis = (l) => { lenis = l }
export const getLenis = () => lenis
