// Hand-coded SVG cover art, light-theme. Paper background, ink + cobalt line art.
// viewBox 320x200, fills container. No external assets.
//
// Each cover animates its product's actual motion — the invoice gets scanned,
// the waveform becomes a note, the workflow lights up agent by agent. Motion
// only runs while the card is on screen or hovered (`active`), and never when
// the visitor asks for reduced motion.

const INK = '#191510'
const AC = '#2742D6'
const PAPER = '#EFEBE1'

const MOTION_CSS = `
.pf-anim * { transform-box: fill-box; transform-origin: center; }
.pf-anim .pf-run { animation-play-state: paused; }
.pf-anim.pf-live .pf-run { animation-play-state: running; }

@keyframes pf-scan { 0% { transform: translateY(-52px) } 55%,100% { transform: translateY(58px) } }
@keyframes pf-dash { to { stroke-dashoffset: -32 } }
@keyframes pf-pop { 0%,70%,100% { transform: scale(1); opacity: .9 } 80% { transform: scale(1.06); opacity: 1 } }
@keyframes pf-ink { 0%,15% { transform: scaleX(0) } 45%,100% { transform: scaleX(1) } }
@keyframes pf-bar { 0%,100% { transform: scaleY(.45) } 50% { transform: scaleY(1) } }
@keyframes pf-draw { to { stroke-dashoffset: 0 } }
@keyframes pf-rise { 0% { transform: scaleY(.15); opacity: .35 } 100% { transform: scaleY(1); opacity: 1 } }
@keyframes pf-spin { to { transform: rotate(360deg) } }
@keyframes pf-pulse { 0%,100% { transform: scale(1); opacity: .9 } 50% { transform: scale(1.18); opacity: 1 } }
@keyframes pf-node { 0%,100% { transform: scale(1); opacity: .8 } 50% { transform: scale(1.35); opacity: 1 } }
@keyframes pf-flow { 0% { opacity: .15 } 50% { opacity: 1 } 100% { opacity: .15 } }
@keyframes pf-twinkle { 0%,100% { transform: scale(.6); opacity: .35 } 50% { transform: scale(1.15); opacity: 1 } }
@keyframes pf-deal { 0% { transform: translate(26px, 34px) rotate(14deg); opacity: 0 } 45%,100% { transform: translate(0,0) rotate(0deg); opacity: 1 } }
@keyframes pf-lift { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-4px) } }
@keyframes pf-page { 0%,100% { transform: rotateY(0deg) } 50% { transform: rotateY(-24deg) } }

@media (prefers-reduced-motion: reduce) {
  .pf-anim .pf-run { animation: none !important; }
}
`

function Frame({ children, tint = '#ECE7DB', active = false }) {
  return (
    <svg
      viewBox="0 0 320 200"
      className={`w-full h-full block pf-anim${active ? ' pf-live' : ''}`}
      preserveAspectRatio="xMidYMid slice"
      role="img"
    >
      <style>{MOTION_CSS}</style>
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

function TradingCover({ active }) {
  const bars = [
    [40, 70, 110], [70, 55, 95], [100, 90, 150], [130, 40, 80],
    [160, 60, 120], [190, 100, 160], [220, 50, 130], [250, 80, 150], [280, 110, 175],
  ]
  return (
    <Frame tint="#E9ECFA" active={active}>
      {bars.map(([x, lo, hi], i) => (
        <g key={i}>
          <line x1={x} x2={x} y1={lo - 12} y2={hi + 12} stroke={INK} strokeWidth="1.2" opacity="0.5" />
          <rect
            x={x - 5} y={Math.min(lo, hi)} width="10" height={Math.abs(hi - lo)} rx="2"
            fill={i % 2 ? AC : INK} opacity={i % 2 ? 0.9 : 0.78}
            className="pf-run"
            style={{ animation: `pf-rise 620ms ease-out ${i * 90}ms both` }}
          />
        </g>
      ))}
      {/* the price line draws itself across the bars */}
      <polyline
        points="40,120 70,100 100,130 130,70 160,90 190,60 220,95 250,70 280,45"
        fill="none" stroke={AC} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"
        pathLength="1" strokeDasharray="1" strokeDashoffset="1"
        className="pf-run"
        style={{ animation: 'pf-draw 1500ms ease-out 380ms forwards' }}
      />
    </Frame>
  )
}

function InvoiceCover({ active }) {
  return (
    <Frame active={active}>
      {/* paper invoice */}
      <rect x="48" y="40" width="92" height="120" rx="8" fill="#fff" stroke={INK} strokeOpacity="0.12" />
      {[58, 70, 82, 94, 106, 118, 130].map((y, i) => (
        <rect key={y} x="60" y={y} width={i % 2 ? 56 : 68} height="4" rx="2" fill={INK} opacity="0.28" />
      ))}
      {/* the scanner sweeps the page */}
      <g clipPath="url(#pf-inv-clip)">
        <clipPath id="pf-inv-clip">
          <rect x="48" y="40" width="92" height="120" rx="8" />
        </clipPath>
        <rect
          x="48" y="96" width="92" height="6" fill={AC} opacity="0.9"
          className="pf-run"
          style={{ animation: 'pf-scan 2600ms ease-in-out infinite' }}
        />
      </g>
      {/* read data travels to the EDI doc */}
      <path
        d="M150 100 H188" stroke={AC} strokeWidth="3" strokeDasharray="2 6" strokeLinecap="round"
        className="pf-run"
        style={{ animation: 'pf-dash 900ms linear infinite' }}
      />
      <path d="M182 92 l10 8 l-10 8" fill="none" stroke={AC} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <g className="pf-run" style={{ animation: 'pf-pop 2600ms ease-in-out infinite' }}>
        <rect x="200" y="56" width="80" height="88" rx="10" fill="#fff" stroke={AC} strokeWidth="2" />
        <text x="240" y="94" fontFamily="monospace" fontSize="15" fill={AC} textAnchor="middle" fontWeight="700">EDI</text>
        <text x="240" y="116" fontFamily="monospace" fontSize="15" fill={INK} textAnchor="middle" fontWeight="700">810</text>
      </g>
    </Frame>
  )
}

function StorybookCover({ active }) {
  return (
    <Frame tint="#F2ECE0" active={active}>
      <path d="M160 60 C120 44 80 48 60 58 V150 C80 140 120 138 160 154 Z" fill="#fff" stroke={INK} strokeOpacity="0.1" />
      <g className="pf-run" style={{ animation: 'pf-page 3400ms ease-in-out infinite', transformOrigin: '160px 107px' }}>
        <path d="M160 60 C200 44 240 48 260 58 V150 C240 140 200 138 160 154 Z" fill="#fff" stroke={INK} strokeOpacity="0.1" />
        {[78, 92, 106, 120].map((y) => (
          <rect key={y} x="176" y={y} width="70" height="3.5" rx="2" fill={INK} opacity="0.22" />
        ))}
      </g>
      <line x1="160" y1="60" x2="160" y2="154" stroke={INK} strokeOpacity="0.18" strokeWidth="2" />
      {[78, 92, 106, 120].map((y) => (
        <rect key={y} x="74" y={y} width="70" height="3.5" rx="2" fill={INK} opacity="0.22" />
      ))}
      {[[42, 44], [284, 58], [268, 150]].map(([x, y], i) => (
        <path
          key={i}
          d={`M${x} ${y - 8} l2.5 5.5 l5.5 2.5 l-5.5 2.5 l-2.5 5.5 l-2.5 -5.5 l-5.5 -2.5 l5.5 -2.5 Z`}
          fill={AC}
          className="pf-run"
          style={{ animation: `pf-twinkle 1900ms ease-in-out ${i * 420}ms infinite` }}
        />
      ))}
    </Frame>
  )
}

function GraphCover({ active }) {
  const nodes = [
    [160, 100, 12, AC], [80, 60, 7, INK], [110, 150, 6, INK], [240, 70, 8, INK],
    [255, 140, 6, AC], [60, 120, 5, AC], [205, 42, 5, INK], [292, 102, 5, AC],
  ]
  const edges = [[0, 1], [0, 2], [0, 3], [0, 4], [1, 5], [3, 6], [4, 7], [2, 5]]
  return (
    <Frame tint="#E9ECFA" active={active}>
      {edges.map(([a, b], i) => (
        <line
          key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]}
          stroke={INK} strokeOpacity="0.22" strokeWidth="1.2"
          className="pf-run"
          style={{ animation: `pf-flow 2400ms ease-in-out ${i * 160}ms infinite` }}
        />
      ))}
      {nodes.map(([x, y, r, c], i) => (
        <circle
          key={i} cx={x} cy={y} r={r} fill={c} opacity={i === 0 ? 1 : 0.85}
          className="pf-run"
          style={{ animation: `pf-node 2400ms ease-in-out ${i * 180}ms infinite` }}
        />
      ))}
      <circle
        cx="160" cy="100" r="22" fill="none" stroke={AC} strokeOpacity="0.4" strokeWidth="1.5"
        className="pf-run"
        style={{ animation: 'pf-pulse 2400ms ease-in-out infinite' }}
      />
    </Frame>
  )
}

function InviteCover({ active }) {
  return (
    <Frame tint="#F2ECE0" active={active}>
      <g transform="rotate(-7 160 100)">
        <rect x="92" y="44" width="136" height="116" rx="8" fill="#fff" stroke={INK} strokeOpacity="0.12" />
      </g>
      <g className="pf-run" style={{ animation: 'pf-lift 3000ms ease-in-out infinite' }}>
        <rect x="104" y="50" width="112" height="104" rx="8" fill="#fff" stroke={AC} strokeWidth="1.5" />
        <rect x="116" y="62" width="88" height="80" rx="4" fill="none" stroke={AC} strokeOpacity="0.4" strokeDasharray="1 4" />
        <path
          d="M160 92 c-6 -10 -22 -6 -22 6 c0 9 12 16 22 24 c10 -8 22 -15 22 -24 c0 -12 -16 -16 -22 -6 Z"
          fill={AC} opacity="0.9"
          className="pf-run"
          style={{ animation: 'pf-pulse 1600ms ease-in-out infinite' }}
        />
        <text x="160" y="78" fontFamily="serif" fontSize="9" fill={INK} textAnchor="middle" letterSpacing="2" opacity="0.6">YOU ARE INVITED</text>
        <rect x="132" y="128" width="56" height="3" rx="1.5" fill={INK} opacity="0.25" />
      </g>
    </Frame>
  )
}

function ScribeCover({ active }) {
  const bars = [44, 56, 30, 70, 40, 84, 50, 64, 34, 74, 46]
  return (
    <Frame tint="#E9ECFA" active={active}>
      {/* the consult is heard */}
      <g>
        {bars.map((h, i) => (
          <rect
            key={i} x={40 + i * 9} y={100 - h / 2} width="4" height={h} rx="2"
            fill={i % 3 === 0 ? AC : INK} opacity={i % 3 === 0 ? 0.9 : 0.55}
            className="pf-run"
            style={{ animation: `pf-bar ${820 + (i % 4) * 190}ms ease-in-out ${i * 70}ms infinite` }}
          />
        ))}
      </g>
      <path
        d="M150 100 H184" stroke={AC} strokeWidth="3" strokeDasharray="2 6" strokeLinecap="round"
        className="pf-run"
        style={{ animation: 'pf-dash 900ms linear infinite' }}
      />
      <path d="M178 92 l10 8 l-10 8" fill="none" stroke={AC} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {/* and the note writes itself */}
      <rect x="198" y="50" width="84" height="100" rx="8" fill="#fff" stroke={INK} strokeOpacity="0.12" />
      <circle cx="214" cy="68" r="6" fill="none" stroke={AC} strokeWidth="2" />
      <path d="M211 68 h6 M214 65 v6" stroke={AC} strokeWidth="1.6" strokeLinecap="round" />
      {[86, 98, 110, 122, 134].map((y, i) => (
        <rect
          key={y} x="210" y={y} width={i % 2 ? 44 : 60} height="3.5" rx="2" fill={INK} opacity="0.25"
          className="pf-run"
          style={{ animation: `pf-ink 3200ms ease-out ${i * 260}ms infinite`, transformOrigin: 'left center' }}
        />
      ))}
    </Frame>
  )
}

function LifeOSCover({ active }) {
  const tiles = [
    [52, 44, 70, 48], [52, 108, 70, 48], [198, 44, 70, 30], [198, 90, 70, 30], [198, 136, 70, 20],
  ]
  return (
    <Frame tint="#F2ECE0" active={active}>
      {tiles.map(([x, y, w, h], i) => (
        <rect
          key={i} x={x} y={y} width={w} height={h} rx="8" fill="#fff" stroke={INK} strokeOpacity="0.12"
          className="pf-run"
          style={{ animation: `pf-flow 3200ms ease-in-out ${i * 240}ms infinite` }}
        />
      ))}
      {[[64, 60], [64, 124]].map(([x, y], i) => (
        <g key={i}>
          <rect x={x} y={y} width="46" height="3.5" rx="2" fill={INK} opacity="0.25" />
          <rect x={x} y={y + 10} width="30" height="3.5" rx="2" fill={INK} opacity="0.18" />
        </g>
      ))}
      {[[134, 68], [186, 68], [134, 132], [186, 132]].map(([x, y], i) => (
        <line
          key={i} x1={x} y1={y} x2={160 + (x < 160 ? -18 : 18)} y2={100 + (y < 100 ? -18 : 18)}
          stroke={INK} strokeOpacity="0.25" strokeWidth="1.2"
          className="pf-run"
          style={{ animation: `pf-flow 2600ms ease-in-out ${i * 200}ms infinite` }}
        />
      ))}
      <circle cx="160" cy="100" r="26" fill="none" stroke={AC} strokeWidth="2" />
      <circle
        cx="160" cy="100" r="8" fill={AC}
        className="pf-run"
        style={{ animation: 'pf-pulse 2200ms ease-in-out infinite' }}
      />
      <circle
        cx="160" cy="100" r="36" fill="none" stroke={AC} strokeOpacity="0.3" strokeWidth="1.2" strokeDasharray="2 5"
        className="pf-run"
        style={{ animation: 'pf-spin 14s linear infinite' }}
      />
      <rect x="210" y="55" width="46" height="3.5" rx="2" fill={AC} opacity="0.8" />
      <rect x="210" y="101" width="34" height="3.5" rx="2" fill={INK} opacity="0.25" />
      <rect x="210" y="143" width="40" height="3.5" rx="2" fill={INK} opacity="0.18" />
    </Frame>
  )
}

function BlackjackCover({ active }) {
  return (
    <Frame tint="#E9ECFA" active={active}>
      {/* face-down dealer card */}
      <g transform="rotate(-9 120 96)">
        <rect x="86" y="44" width="70" height="100" rx="9" fill="#fff" stroke={INK} strokeOpacity="0.15" />
        <rect x="94" y="52" width="54" height="84" rx="5" fill="none" stroke={AC} strokeOpacity="0.45" strokeDasharray="1 4" />
      </g>
      {/* the ace is dealt in */}
      <g
        transform="rotate(7 190 104)"
        className="pf-run"
        style={{ animation: 'pf-deal 3200ms ease-out infinite' }}
      >
        <rect x="152" y="56" width="70" height="100" rx="9" fill="#fff" stroke={AC} strokeWidth="2" />
        <text x="163" y="78" fontFamily="serif" fontSize="15" fill={INK} fontWeight="700">A</text>
        <path d="M187 82 c-8 13 -21 17 -21 27 c0 10 13 14 18 6 c-1 7 -4 11 -7 14 h20 c-3 -3 -6 -7 -7 -14 c5 8 18 4 18 -6 c0 -10 -13 -14 -21 -27 Z" fill={INK} />
      </g>
      {/* then the correct play lands */}
      <g className="pf-run" style={{ animation: 'pf-pop 3200ms ease-in-out infinite' }}>
        <rect x="236" y="82" width="52" height="24" rx="12" fill={AC} />
        <text x="262" y="98" fontFamily="monospace" fontSize="11" fill="#fff" textAnchor="middle" fontWeight="700">HIT</text>
      </g>
      <text x="52" y="170" fontFamily="monospace" fontSize="12" fill={AC} fontWeight="700" letterSpacing="3">21</text>
    </Frame>
  )
}

function AgentsCover({ active }) {
  const panels = [[44, 48], [44, 116], [136, 82], [228, 48], [228, 116]]
  const wires = [[0, 2], [1, 2], [2, 3], [2, 4]]
  return (
    <Frame active={active}>
      {wires.map(([a, b], i) => (
        <path
          key={i}
          d={`M${panels[a][0] + 64} ${panels[a][1] + 20} C ${panels[a][0] + 90} ${panels[a][1] + 20}, ${panels[b][0] - 26} ${panels[b][1] + 20}, ${panels[b][0]} ${panels[b][1] + 20}`}
          fill="none" stroke={AC} strokeOpacity="0.55" strokeWidth="1.6"
          strokeDasharray="4 6"
          className="pf-run"
          style={{ animation: `pf-dash 700ms linear ${i * 120}ms infinite` }}
        />
      ))}
      {panels.map(([x, y], i) => (
        <g key={i} className="pf-run" style={{ animation: `pf-flow 2800ms ease-in-out ${i * 320}ms infinite` }}>
          <rect x={x} y={y} width="64" height="40" rx="7" fill="#fff" stroke={i === 2 ? AC : INK} strokeOpacity={i === 2 ? 1 : 0.15} strokeWidth={i === 2 ? 2 : 1} />
          <circle cx={x + 10} cy={y + 10} r="3" fill={i === 2 ? AC : INK} opacity={i === 2 ? 1 : 0.4} />
          <rect x={x + 18} y={y + 8} width="34" height="3" rx="1.5" fill={INK} opacity="0.3" />
          <rect x={x + 8} y={y + 20} width={i % 2 ? 40 : 48} height="3" rx="1.5" fill={AC} opacity="0.55" />
          <rect x={x + 8} y={y + 28} width={i % 2 ? 30 : 24} height="3" rx="1.5" fill={INK} opacity="0.22" />
        </g>
      ))}
    </Frame>
  )
}

function POSCover({ active }) {
  // items scan through, the total ticks up, payment approves
  const rows = [64, 82, 100, 118]
  return (
    <Frame tint="#E9ECFA" active={active}>
      <rect x="40" y="42" width="140" height="116" rx="10" fill="#fff" stroke={INK} strokeOpacity="0.12" />
      <rect x="52" y="52" width="52" height="4" rx="2" fill={INK} opacity="0.3" />
      {rows.map((y, i) => (
        <g key={y} className="pf-run" style={{ animation: `pf-ink 3200ms ease-out ${i * 340}ms infinite`, transformOrigin: 'left center' }}>
          <rect x="52" y={y} width={i % 2 ? 62 : 78} height="4" rx="2" fill={INK} opacity="0.26" />
          <rect x="140" y={y} width="28" height="4" rx="2" fill={AC} opacity="0.6" />
        </g>
      ))}
      <rect x="52" y="136" width="116" height="1.5" fill={INK} opacity="0.2" />
      <text x="52" y="152" fontFamily="monospace" fontSize="11" fill={INK} opacity="0.55">TOTAL</text>
      <text
        x="168" y="152" fontFamily="monospace" fontSize="12" fill={AC} textAnchor="end" fontWeight="700"
        className="pf-run" style={{ animation: 'pf-pop 3200ms ease-in-out infinite' }}
      >48.20</text>
      {/* card terminal approves */}
      <rect x="204" y="62" width="76" height="96" rx="12" fill="#fff" stroke={AC} strokeWidth="2" />
      <rect x="216" y="76" width="52" height="30" rx="5" fill={AC} opacity="0.12" />
      <rect x="222" y="86" width="40" height="4" rx="2" fill={AC} opacity="0.5" />
      <g className="pf-run" style={{ animation: 'pf-pop 3200ms ease-in-out 900ms infinite' }}>
        <circle cx="242" cy="128" r="16" fill={AC} opacity="0.12" />
        <path d="M234 128 l6 6 l12 -13" fill="none" stroke={AC} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </Frame>
  )
}

function LabelCover({ active }) {
  // a shelf label prints and slides out
  return (
    <Frame active={active}>
      <rect x="52" y="48" width="96" height="104" rx="10" fill="#fff" stroke={INK} strokeOpacity="0.14" />
      <rect x="66" y="62" width="68" height="6" rx="3" fill={INK} opacity="0.25" />
      <rect x="66" y="78" width="46" height="6" rx="3" fill={INK} opacity="0.16" />
      <rect x="60" y="122" width="80" height="18" rx="4" fill={AC} opacity="0.12" />
      <path d="M148 100 H186" stroke={AC} strokeWidth="3" strokeDasharray="2 6" strokeLinecap="round"
        className="pf-run" style={{ animation: 'pf-dash 900ms linear infinite' }} />
      <path d="M180 92 l10 8 l-10 8" fill="none" stroke={AC} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <g className="pf-run" style={{ animation: 'pf-pop 2800ms ease-in-out infinite' }}>
        <rect x="200" y="64" width="84" height="72" rx="8" fill="#fff" stroke={AC} strokeWidth="2" />
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
          <rect key={i} x={210 + i * 5.5} y="80" width={i % 3 === 0 ? 3 : 1.6} height="30" fill={INK} opacity="0.8" />
        ))}
        <rect x="210" y="118" width="64" height="4" rx="2" fill={INK} opacity="0.3" />
      </g>
    </Frame>
  )
}

function LoyaltyCover({ active }) {
  // points land, tier ring fills, a coupon pops
  return (
    <Frame tint="#F2ECE0" active={active}>
      <circle cx="108" cy="100" r="42" fill="none" stroke={INK} strokeOpacity="0.14" strokeWidth="9" />
      <circle
        cx="108" cy="100" r="42" fill="none" stroke={AC} strokeWidth="9" strokeLinecap="round"
        pathLength="1" strokeDasharray="1" strokeDashoffset="0.32"
        transform="rotate(-90 108 100)"
        className="pf-run"
        style={{ animation: 'pf-draw 2200ms ease-out infinite' }}
      />
      <text x="108" y="98" fontFamily="monospace" fontSize="17" fill={INK} textAnchor="middle" fontWeight="700">1,240</text>
      <text x="108" y="114" fontFamily="monospace" fontSize="8" fill={INK} textAnchor="middle" opacity="0.5" letterSpacing="2">POINTS</text>
      <g className="pf-run" style={{ animation: 'pf-lift 2600ms ease-in-out infinite' }}>
        <rect x="182" y="66" width="96" height="68" rx="10" fill="#fff" stroke={AC} strokeWidth="2" />
        <text x="230" y="100" fontFamily="monospace" fontSize="18" fill={AC} textAnchor="middle" fontWeight="700">-$5</text>
        <rect x="196" y="112" width="68" height="4" rx="2" fill={INK} opacity="0.22" />
      </g>
      {[[168, 52], [286, 96], [176, 152]].map(([x, y], i) => (
        <path
          key={i} d={`M${x} ${y - 7} l2.2 4.8 l4.8 2.2 l-4.8 2.2 l-2.2 4.8 l-2.2 -4.8 l-4.8 -2.2 l4.8 -2.2 Z`}
          fill={AC}
          className="pf-run"
          style={{ animation: `pf-twinkle 1700ms ease-in-out ${i * 380}ms infinite` }}
        />
      ))}
    </Frame>
  )
}

const COVERS = {
  trading: TradingCover,
  invoice: InvoiceCover,
  storybook: StorybookCover,
  graph: GraphCover,
  invite: InviteCover,
  scribe: ScribeCover,
  lifeos: LifeOSCover,
  blackjack: BlackjackCover,
  agents: AgentsCover,
  pos: POSCover,
  label: LabelCover,
  loyalty: LoyaltyCover,
}

export default function Cover({ variant, active = false }) {
  const C = COVERS[variant] || TradingCover
  return <C active={active} />
}
