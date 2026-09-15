import { cx } from '../../lib/cx'

const tones = {
  violet: 'border-violet-400/30 bg-violet-500/10 text-violet-300',
  cyan: 'border-cyan-400/30 bg-cyan-500/10 text-cyan-300',
  amber: 'border-amber-400/30 bg-amber-500/10 text-amber-300',
  rose: 'border-rose-400/30 bg-rose-500/10 text-rose-300',
  emerald: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-300',
  slate: 'border-white/10 bg-white/[0.05] text-slate-300',
}

const dotTones = {
  violet: 'bg-violet-400',
  cyan: 'bg-cyan-400',
  amber: 'bg-amber-400',
  rose: 'bg-rose-400',
  emerald: 'bg-emerald-400',
  slate: 'bg-slate-400',
}

export default function Badge({
  children,
  tone = 'slate',
  dot = false,
  pulse = false,
  className,
  ...props
}) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider',
        tones[tone],
        className
      )}
      {...props}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5">
          {pulse && (
            <span className={cx('absolute inline-flex h-full w-full animate-ping rounded-full opacity-75', dotTones[tone])} />
          )}
          <span className={cx('relative inline-flex h-1.5 w-1.5 rounded-full', dotTones[tone])} />
        </span>
      )}
      {children}
    </span>
  )
}