import { motion } from 'framer-motion'
import { cx } from '../../lib/cx'

export default function ProgressBar({ value, max = 100, tone = 'violet', className, showLabel }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  const tones = {
    violet: 'from-violet-500 to-fuchsia-500',
    cyan: 'from-cyan-400 to-teal-400',
    amber: 'from-amber-400 to-orange-500',
    emerald: 'from-emerald-400 to-teal-400',
    rose: 'from-rose-500 to-pink-500',
  }
  return (
    <div className={cx('relative', className)}>
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.07]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className={cx('h-full rounded-full bg-gradient-to-r shadow-glow-violet', tones[tone])}
        />
      </div>
      {showLabel && (
        <span className="mt-1.5 block text-right text-xs font-semibold tabular-nums text-slate-400">
          {pct.toFixed(1)}%
        </span>
      )}
    </div>
  )
}