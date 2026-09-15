import { cx } from '../../lib/cx'

export function CornerFrame({ color = 'violet', className }) {
  const c = {
    violet: 'border-violet-400/60',
    cyan: 'border-cyan-400/60',
    amber: 'border-amber-400/60',
    rose: 'border-rose-400/60',
    emerald: 'border-emerald-400/60',
  }[color]
  return (
    <span aria-hidden className={cx('pointer-events-none absolute inset-0', className)}>
      {[
        'left-0 top-0 border-l-2 border-t-2 rounded-tl-md',
        'right-0 top-0 border-r-2 border-t-2 rounded-tr-md',
        'left-0 bottom-0 border-l-2 border-b-2 rounded-bl-md',
        'right-0 bottom-0 border-r-2 border-b-2 rounded-br-md',
      ].map((pos) => (
        <span key={pos} className={cx('absolute h-3.5 w-3.5', pos, c)} />
      ))}
    </span>
  )
}

export default function Card({ children, className, glow, hover = false, pad = 'p-6', frame, ...props }) {
  const glowMap = {
    violet: 'shadow-glow-violet',
    cyan: 'shadow-glow-cyan',
    amber: 'shadow-glow-amber',
    rose: 'shadow-glow-rose',
    emerald: 'shadow-glow-emerald',
  }
  return (
    <div
      className={cx(
        'glass relative rounded-2xl shadow-card',
        pad,
        glow && glowMap[glow],
        hover &&
          'transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/30 hover:shadow-glow-violet',
        className
      )}
      {...props}
    >
      {frame && <CornerFrame color={frame} className="rounded-2xl" />}
      {children}
    </div>
  )
}