import Cover from './covers'

// Renders a project cover with the right treatment so nothing looks zoomed.
// Fills its parent; parent controls the height.
export default function Media({ cover, alt }) {
  if (cover.type === 'svg') return <Cover variant={cover.variant} />

  if (cover.type === 'icon') {
    return (
      <div className="w-full h-full grid place-items-center bg-[radial-gradient(120%_120%_at_50%_0%,#EEF1FD_0%,#ECE7DB_70%)]">
        <img
          src={cover.src}
          alt={alt}
          loading="lazy"
          className="w-[40%] max-w-[120px] aspect-square object-contain rounded-[22%] shadow-[0_10px_30px_rgba(25,21,16,0.14)] ring-1 ring-black/5 bg-white"
        />
      </div>
    )
  }

  if (cover.type === 'shot' && cover.frame === 'phone') {
    return (
      <div className="w-full h-full grid place-items-center bg-[radial-gradient(120%_120%_at_50%_0%,#EEF1FD_0%,#ECE7DB_70%)] p-4">
        <img
          src={cover.src}
          alt={alt}
          loading="lazy"
          className="h-full w-auto max-w-full object-contain rounded-2xl shadow-[0_12px_34px_rgba(25,21,16,0.18)] ring-1 ring-black/5"
        />
      </div>
    )
  }

  if (cover.type === 'shot') {
    // web / desktop screenshot inside a minimal browser window
    return (
      <div className="w-full h-full flex flex-col bg-paper2">
        <div className="flex items-center gap-1.5 px-3 h-7 shrink-0 border-b border-line bg-paper2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E5705B]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#E8C15B]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#7DBE6A]" />
        </div>
        <div className="relative flex-1 overflow-hidden bg-white">
          <img src={cover.src} alt={alt} loading="lazy" className="w-full h-full object-cover object-top" />
        </div>
      </div>
    )
  }

  if (cover.type === 'video') {
    return <video src={cover.src} muted loop autoPlay playsInline className="w-full h-full object-cover" />
  }

  // photo
  return <img src={cover.src} alt={alt} loading="lazy" className="w-full h-full object-cover" />
}
