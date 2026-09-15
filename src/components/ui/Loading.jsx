import { Loader2 } from 'lucide-react'
import { cx } from '../../lib/cx'

export function Spinner({ className }) {
  return <Loader2 className={cx('h-5 w-5 animate-spin', className)} />
}

export default function Loading({
  label = 'Working…',
  sub,
  className,
  bright = false,
}) {
  return (
    <div className={cx('flex flex-col items-center justify-center gap-3 py-12 text-center', className)}>
      <div className="relative">
        <div className="clip-angled absolute inset-0 animate-pulse-soft bg-gradient-to-br from-violet-500/40 to-cyan-500/20" />
        <div className="clip-angled relative flex h-12 w-12 items-center justify-center border border-white/10 bg-ink-900">
          <Spinner className={bright ? 'text-cyan-300' : 'text-violet-300'} />
        </div>
      </div>
      <div>
        <p className="font-display text-sm font-semibold text-slate-200">{label}</p>
        {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
      </div>
    </div>
  )
}