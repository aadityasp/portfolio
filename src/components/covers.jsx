// Hand-coded SVG cover art. Consistent palette, abstract motif per project.
// Each cover fills its container (viewBox 16:10). No external assets.

const A = '#7c5cff' // accent
const G = '#33e6c0' // glow
const D = '#15151f' // card

function Frame({ children, from = A, to = G }) {
  const id = Math.abs(hashStr(from + to)).toString(36)
  return (
    <svg viewBox="0 0 320 200" className="w-full h-full block" preserveAspectRatio="xMidYMid slice" role="img">
      <defs>
        <linearGradient id={`bg-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0e0e16" />
          <stop offset="1" stopColor="#171723" />
        </linearGradient>
        <linearGradient id={`ac-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
        <radialGradient id={`gl-${id}`} cx="0.5" cy="0.4" r="0.7">
          <stop offset="0" stopColor={from} stopOpacity="0.35" />
          <stop offset="1" stopColor={from} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="320" height="200" fill={`url(#bg-${id})`} />
      <rect width="320" height="200" fill={`url(#gl-${id})`} />
      {children({ ac: `url(#ac-${id})`, from, to })}
    </svg>
  )
}

function hashStr(s) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i)
  return h
}

// Candlestick trading chart
function TradingCover() {
  const bars = [
    [40, 70, 110], [70, 55, 95], [100, 90, 150], [130, 40, 80],
    [160, 60, 120], [190, 100, 160], [220, 50, 130], [250, 80, 150], [280, 110, 175],
  ]
  return (
    <Frame from={G} to={A}>
      {({ ac, from }) => (
        <g>
          {[40, 80, 120, 160].map((y) => (
            <line key={y} x1="20" x2="300" y1={y} y2={y} stroke="#ffffff" strokeOpacity="0.05" />
          ))}
          <polyline points="40,120 70,100 100,130 130,70 160,90 190,60 220,95 250,70 280,45"
            fill="none" stroke={ac} strokeWidth="2.5" strokeLinejoin="round" opacity="0.9" />
          {bars.map(([x, lo, hi], i) => (
            <g key={i}>
              <line x1={x} x2={x} y1={lo - 12} y2={hi + 12} stroke={i % 2 ? G : from} strokeWidth="1.5" />
              <rect x={x - 5} y={Math.min(lo, hi)} width="10" height={Math.abs(hi - lo)} rx="2"
                fill={i % 2 ? G : from} opacity="0.85" />
            </g>
          ))}
        </g>
      )}
    </Frame>
  )
}

// Invoice paper -> digital EDI with scan line
function InvoiceCover() {
  return (
    <Frame from={A} to={G}>
      {({ ac, to }) => (
        <g>
          <rect x="48" y="40" width="92" height="120" rx="8" fill="#ffffff" opacity="0.9" />
          {[58, 70, 82, 94, 106, 118, 130].map((y, i) => (
            <rect key={y} x="60" y={y} width={i % 2 ? 56 : 68} height="4" rx="2" fill="#0e0e16" opacity="0.35" />
          ))}
          <rect x="48" y="92" width="92" height="6" fill={to} opacity="0.9" />
          <path d="M150 100 H190" stroke={ac} strokeWidth="3" strokeDasharray="2 6" strokeLinecap="round" />
          <path d="M184 92 l10 8 l-10 8" fill="none" stroke={to} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="200" y="56" width="80" height="88" rx="10" fill="none" stroke={ac} strokeWidth="2" />
          <text x="240" y="92" fontFamily="monospace" fontSize="13" fill={to} textAnchor="middle" fontWeight="700">EDI</text>
          <text x="240" y="112" fontFamily="monospace" fontSize="13" fill="#fff" textAnchor="middle" fontWeight="700">810</text>
          <circle cx="240" cy="128" r="3" fill={to} />
        </g>
      )}
    </Frame>
  )
}

// Open storybook with sparkles
function StorybookCover() {
  return (
    <Frame from="#ff7eb6" to={A}>
      {({ ac, from, to }) => (
        <g>
          <path d="M160 60 C120 44 80 48 60 58 V150 C80 140 120 138 160 154 Z" fill="#fff" opacity="0.92" />
          <path d="M160 60 C200 44 240 48 260 58 V150 C240 140 200 138 160 154 Z" fill="#e9e6ff" opacity="0.92" />
          <line x1="160" y1="60" x2="160" y2="154" stroke="#0e0e16" strokeOpacity="0.2" strokeWidth="2" />
          {[78, 92, 106, 120].map((y) => (
            <g key={y}>
              <rect x="74" y={y} width="70" height="3.5" rx="2" fill="#0e0e16" opacity="0.25" />
              <rect x="176" y={y} width="70" height="3.5" rx="2" fill="#0e0e16" opacity="0.25" />
            </g>
          ))}
          {[[40, 40], [285, 60], [270, 150], [50, 150]].map(([x, y], i) => (
            <path key={i} d={`M${x} ${y - 7} l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 Z`}
              fill={i % 2 ? from : to} />
          ))}
        </g>
      )}
    </Frame>
  )
}

// Node graph (email -> clusters)
function GraphCover() {
  const nodes = [
    [160, 100, 11, A], [80, 60, 7, G], [110, 150, 6, G], [240, 70, 8, G],
    [255, 140, 6, A], [60, 120, 5, A], [200, 40, 5, G], [290, 100, 5, A],
  ]
  const edges = [[0, 1], [0, 2], [0, 3], [0, 4], [1, 5], [3, 6], [4, 7], [2, 5]]
  return (
    <Frame from={A} to={G}>
      {() => (
        <g>
          {edges.map(([a, b], i) => (
            <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]}
              stroke="#fff" strokeOpacity="0.18" strokeWidth="1.2" />
          ))}
          {nodes.map(([x, y, r, c], i) => (
            <circle key={i} cx={x} cy={y} r={r} fill={c} opacity={i === 0 ? 1 : 0.85} />
          ))}
          <circle cx="160" cy="100" r="20" fill="none" stroke={A} strokeOpacity="0.4" strokeWidth="1.5" />
        </g>
      )}
    </Frame>
  )
}

// POS terminal + receipt (fallback if no screenshot)
function PosCover() {
  return (
    <Frame from={G} to={A}>
      {({ ac, to }) => (
        <g>
          <rect x="70" y="50" width="120" height="84" rx="8" fill="#0e0e16" stroke={ac} strokeWidth="2" />
          <rect x="80" y="60" width="100" height="50" rx="4" fill={to} opacity="0.18" />
          {[68, 80, 92].map((y) => <rect key={y} x="88" y={y} width="60" height="4" rx="2" fill={to} opacity="0.6" />)}
          <rect x="92" y="118" width="76" height="8" rx="3" fill={ac} />
          <rect x="120" y="134" width="20" height="14" fill="#0e0e16" stroke={ac} strokeWidth="2" />
          <rect x="100" y="148" width="60" height="6" rx="2" fill="#1b1b27" />
          <g>
            <rect x="210" y="44" width="60" height="110" rx="4" fill="#fff" opacity="0.92" />
            {[58, 70, 82, 94, 106, 118].map((y, i) => (
              <rect key={y} x="220" y={y} width={i % 2 ? 30 : 40} height="3.5" rx="2" fill="#0e0e16" opacity="0.4" />
            ))}
            <path d="M210 154 l8 -8 l8 8 l8 -8 l8 8 l8 -8 l8 8 l4 -4 V154 Z" fill="#fff" opacity="0.92" />
          </g>
        </g>
      )}
    </Frame>
  )
}

// Generic / promo (percent tag)
function PromoCover() {
  return (
    <Frame from="#ffb454" to={A}>
      {({ ac, from }) => (
        <g>
          <g transform="rotate(-12 160 100)">
            <path d="M120 60 H210 a14 14 0 0 1 14 14 v40 l-30 26 H120 a14 14 0 0 1 -14 -14 V74 a14 14 0 0 1 14 -14 Z"
              fill={ac} opacity="0.9" />
            <circle cx="132" cy="80" r="7" fill="#0e0e16" />
            <line x1="130" y1="118" x2="190" y2="74" stroke="#0e0e16" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
            <circle cx="132" cy="80" r="3" fill={from} />
            <circle cx="188" cy="112" r="3" fill={from} />
          </g>
          <text x="160" y="108" fontFamily="monospace" fontSize="34" fontWeight="700" fill="#0e0e16" textAnchor="middle" transform="rotate(-12 160 100)">%</text>
        </g>
      )}
    </Frame>
  )
}

const COVERS = {
  trading: TradingCover,
  invoice: InvoiceCover,
  storybook: StorybookCover,
  graph: GraphCover,
  pos: PosCover,
  promo: PromoCover,
}

export default function Cover({ variant }) {
  const C = COVERS[variant] || TradingCover
  return <C />
}
