const words = [
  'Product Strategy', 'AI-first Development', 'POS & Retail', 'Computer Vision',
  'Full-stack', 'Flutter', 'Next.js', 'FastAPI', 'Healthcare AI', 'Fintech',
  'Rapid Prototyping', 'Kotlin', 'LLMs',
]

export default function Marquee() {
  const row = [...words, ...words]
  return (
    <div className="relative py-6 border-y border-line overflow-hidden bg-paper2/50">
      <div className="flex w-max animate-marquee whitespace-nowrap will-change-transform">
        {row.map((w, i) => (
          <span key={i} className="flex items-center font-display text-2xl sm:text-3xl text-ink/80">
            <span className="px-6">{w}</span>
            <span className="text-accent text-base">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
