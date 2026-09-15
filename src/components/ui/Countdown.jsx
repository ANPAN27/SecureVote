import { useEffect, useState } from 'react'
import { cx } from '../../lib/cx'

function partsOf(target) {
  const diff = Math.max(0, target - Date.now())
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff % 86400000) / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
    s: Math.floor((diff % 60000) / 1000),
  }
}

export default function Countdown({ target, labels = true, className }) {
  const [t, setT] = useState(() => partsOf(target))
  useEffect(() => {
    const id = setInterval(() => setT(partsOf(target)), 1000)
    return () => clearInterval(id)
  }, [target])

  const cells = [
    { v: String(t.d).padStart(2, '0'), l: 'Days' },
    { v: String(t.h).padStart(2, '0'), l: 'Hrs' },
    { v: String(t.m).padStart(2, '0'), l: 'Min' },
    { v: String(t.s).padStart(2, '0'), l: 'Sec' },
  ]

  return (
    <div className={cx('flex items-center gap-2 sm:gap-3', className)}>
      {cells.map((c, i) => (
        <div key={c.l} className="flex items-center gap-2 sm:gap-3">
          <div className="clip-angled relative flex min-w-[52px] flex-col items-center justify-center border border-white/10 bg-ink-900/80 px-2 py-2 text-center shadow-card sm:min-w-[60px] sm:py-2.5">
            <span className="relative block overflow-hidden">
              <span className="text-lg font-bold text-slate-50 tabular-nums sm:text-xl">
                {c.v}
              </span>
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              {c.l}
            </span>
            {i < cells.length - 1 && (
              <span className="pointer-events-none absolute inset-1/2" />
            )}
          </div>
          {i < cells.length - 1 && (
            <span className="animate-pulse-soft text-sm font-bold text-violet-400">:</span>
          )}
        </div>
      ))}
      {labels && (
        <p className="ml-2 text-[11px] font-medium uppercase tracking-widest text-slate-500">
          remaining
        </p>
      )}
    </div>
  )
}