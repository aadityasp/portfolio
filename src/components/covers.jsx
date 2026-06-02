// Hand-coded SVG cover art, light-theme. Paper background, ink + cobalt line art.
// viewBox 320x200, fills container. No external assets.

const INK = '#191510'
const AC = '#2742D6'
const PAPER = '#EFEBE1'

function Frame({ children, tint = '#ECE7DB' }) {
  return (
    <svg viewBox="0 0 320 200" className="w-full h-full block" preserveAspectRatio="xMidYMid slice" role="img">
      <rect width="320" height="200" fill={tint} />
      {/* faint dot grid */}
      <g fill={INK} opacity="0.06">
        {Array.from({ length: 8 }).map((_, r) =>
          Array.from({ length: 13 }).map((__, c) => (
            <circle key={`${r}-${c}`} cx={12 + c * 25} cy={14 + r * 25} r="1.1" />
          )),
        )}
      </g>
      {children}
    </svg>
  )
}

function TradingCover() {
  const bars = [
    [40, 70, 110], [70, 55, 95], [100, 90, 150], [130, 40, 80],
    [160, 60, 120], [190, 100, 160], [220, 50, 130], [250, 80, 150], [280, 110, 175],
  ]
  return (
    <Frame tint="#E9ECFA">
      <polyline points="40,120 70,100 100,130 130,70 160,90 190,60 220,95 250,70 280,45"
        fill="none" stroke={AC} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {bars.map(([x, lo, hi], i) => (
        <g key={i}>
          <line x1={x} x2={x} y1={lo - 12} y2={hi + 12} stroke={INK} strokeWidth="1.2" opacity="0.5" />
          <rect x={x - 5} y={Math.min(lo, hi)} width="10" height={Math.abs(hi - lo)} rx="2"
            fill={i % 2 ? AC : INK} opacity={i % 2 ? 0.9 : 0.78} />
        </g>
      ))}
    </Frame>
  )
}

function InvoiceCover() {
  return (
    <Frame>
      <rect x="48" y="40" width="92" height="120" rx="8" fill="#fff" stroke={INK} strokeOpacity="0.12" />
      {[58, 70, 82, 94, 106, 118, 130].map((y, i) => (
        <rect key={y} x="60" y={y} width={i % 2 ? 56 : 68} height="4" rx="2" fill={INK} opacity="0.28" />
      ))}
      <rect x="48" y="92" width="92" height="6" fill={AC} opacity="0.9" />
      <path d="M150 100 H188" stroke={AC} strokeWidth="3" strokeDasharray="2 6" strokeLinecap="round" />
      <path d="M182 92 l10 8 l-10 8" fill="none" stroke={AC} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="200" y="56" width="80" height="88" rx="10" fill="#fff" stroke={AC} strokeWidth="2" />
      <text x="240" y="94" fontFamily="monospace" fontSize="15" fill={AC} textAnchor="middle" fontWeight="700">EDI</text>
      <text x="240" y="116" fontFamily="monospace" fontSize="15" fill={INK} textAnchor="middle" fontWeight="700">810</text>
    </Frame>
  )
}

function StorybookCover() {
  return (
    <Frame tint="#F2ECE0">
      <path d="M160 60 C120 44 80 48 60 58 V150 C80 140 120 138 160 154 Z" fill="#fff" stroke={INK} strokeOpacity="0.1" />
      <path d="M160 60 C200 44 240 48 260 58 V150 C240 140 200 138 160 154 Z" fill="#fff" stroke={INK} strokeOpacity="0.1" />
      <line x1="160" y1="60" x2="160" y2="154" stroke={INK} strokeOpacity="0.18" strokeWidth="2" />
      {[78, 92, 106, 120].map((y) => (
        <g key={y}>
          <rect x="74" y={y} width="70" height="3.5" rx="2" fill={INK} opacity="0.22" />
          <rect x="176" y={y} width="70" height="3.5" rx="2" fill={INK} opacity="0.22" />
        </g>
      ))}
      {[[42, 44], [284, 58], [268, 150]].map(([x, y], i) => (
        <path key={i} d={`M${x} ${y - 8} l2.5 5.5 l5.5 2.5 l-5.5 2.5 l-2.5 5.5 l-2.5 -5.5 l-5.5 -2.5 l5.5 -2.5 Z`} fill={AC} />
      ))}
    </Frame>
  )
}

function GraphCover() {
  const nodes = [
    [160, 100, 12, AC], [80, 60, 7, INK], [110, 150, 6, INK], [240, 70, 8, INK],
    [255, 140, 6, AC], [60, 120, 5, AC], [205, 42, 5, INK], [292, 102, 5, AC],
  ]
  const edges = [[0, 1], [0, 2], [0, 3], [0, 4], [1, 5], [3, 6], [4, 7], [2, 5]]
  return (
    <Frame tint="#E9ECFA">
      {edges.map(([a, b], i) => (
        <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]}
          stroke={INK} strokeOpacity="0.22" strokeWidth="1.2" />
      ))}
      {nodes.map(([x, y, r, c], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill={c} opacity={i === 0 ? 1 : 0.85} />
      ))}
      <circle cx="160" cy="100" r="22" fill="none" stroke={AC} strokeOpacity="0.4" strokeWidth="1.5" />
    </Frame>
  )
}

function InviteCover() {
  return (
    <Frame tint="#F2ECE0">
      {/* layered invitation cards */}
      <g transform="rotate(-7 160 100)">
        <rect x="92" y="44" width="136" height="116" rx="8" fill="#fff" stroke={INK} strokeOpacity="0.12" />
      </g>
      <rect x="104" y="50" width="112" height="104" rx="8" fill="#fff" stroke={AC} strokeWidth="1.5" />
      <rect x="116" y="62" width="88" height="80" rx="4" fill="none" stroke={AC} strokeOpacity="0.4" strokeDasharray="1 4" />
      <path d="M160 92 c-6 -10 -22 -6 -22 6 c0 9 12 16 22 24 c10 -8 22 -15 22 -24 c0 -12 -16 -16 -22 -6 Z" fill={AC} opacity="0.9" />
      <text x="160" y="78" fontFamily="serif" fontSize="9" fill={INK} textAnchor="middle" letterSpacing="2" opacity="0.6">YOU ARE INVITED</text>
      <rect x="132" y="128" width="56" height="3" rx="1.5" fill={INK} opacity="0.25" />
    </Frame>
  )
}

const COVERS = { trading: TradingCover, invoice: InvoiceCover, storybook: StorybookCover, graph: GraphCover, invite: InviteCover }

export default function Cover({ variant }) {
  const C = COVERS[variant] || TradingCover
  return <C />
}
