import { useMemo } from 'react'
import { cx } from '../lib/cx'

function mulberry32(seed) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function buildNetwork() {
  const rnd = mulberry32(20260915)
  const nodes = []
  const cols = 7
  for (let i = 0; i < 21; i++) {
    const col = i % cols
    const row = Math.floor(i / cols)
    nodes.push({
      x: (col / (cols - 1)) * 1200 + (rnd() * 60 - 30),
      y: row * 200 + 80 + (rnd() * 120 - 60),
      r: 2.5 + rnd() * 3,
      seed: rnd(),
    })
  }
  const edges = []
  for (let i = 0; i < nodes.length; i++) {
    const candidates = nodes
      .map((n, j) => ({ j, d: (n.x - nodes[i].x) ** 2 + (n.y - nodes[i].y) ** 2 }))
      .filter((x) => x.d > 0 && x.d < 200000)
      .sort((a, b) => a.d - b.d)
      .slice(0, 2)
    candidates.forEach((c) => {
      const key = [i, c.j].sort().join('-')
      if (!edges.includes(key)) edges.push(key)
    })
  }
  return { nodes, edges }
}

export default function BlockchainField({ className }) {
  const net = useMemo(buildNetwork, [])
  return (
    <div aria-hidden className={cx('pointer-events-none fixed inset-0 -z-10 overflow-hidden', className)}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_-5%,rgba(139,92,246,0.16),transparent_45%),radial-gradient(circle_at_88%_8%,rgba(34,211,238,0.10),transparent_42%),radial-gradient(circle_at_60%_100%,rgba(245,158,11,0.06),transparent_40%)]" />
      <div className="grid-bg absolute inset-0 opacity-[0.07]" />

      <svg className="absolute inset-0 h-full w-full opacity-[0.18]" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="chainV" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#8b5cf6" />
            <stop offset="1" stopColor="#22d3ee" />
          </linearGradient>
          <radialGradient id="nodeGlow">
            <stop offset="0" stopColor="#a78bfa" stopOpacity="0.9" />
            <stop offset="1" stopColor="#8b5cf6" stopOpacity="0" />
          </radialGradient>
        </defs>

        {net.edges.map((key) => {
          const [a, b] = key.split('-').map(Number)
          const n1 = net.nodes[a]
          const n2 = net.nodes[b]
          return (
            <line
              key={key}
              x1={n1.x}
              y1={n1.y}
              x2={n2.x}
              y2={n2.y}
              stroke="url(#chainV)"
              strokeWidth="0.7"
              strokeDasharray="3 8"
              className="animate-dash-flow"
              opacity="0.6"
            />
          )
        })}

        {net.nodes.map((n, i) => (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r={n.r * 4} fill="url(#nodeGlow)" className="animate-pulse-soft" />
            <circle
              cx={n.x}
              cy={n.y}
              r={n.r}
              fill={i % 3 === 0 ? '#a78bfa' : '#22d3ee'}
              opacity="0.85"
            />
          </g>
        ))}
      </svg>

      <div className="absolute -left-40 top-1/4 h-[26rem] w-[26rem] animate-float rounded-full bg-violet-600/10 blur-3xl" />
      <div className="absolute -right-32 bottom-8 h-80 w-80 animate-float rounded-full bg-cyan-500/10 blur-3xl [animation-delay:1.6s]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
    </div>
  )
}