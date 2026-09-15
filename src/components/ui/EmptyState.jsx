import { cx } from '../../lib/cx'

export default function EmptyState({ icon: Icon, title, hint, children, className }) {
  return (
    <div
      className={cx(
        'flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/10 px-6 py-12 text-center',
        className
      )}
    >
      {Icon && (
        <div className="clip-angled flex h-12 w-12 items-center justify-center border border-white/10 bg-white/[0.04] text-slate-400">
          <Icon className="h-5 w-5" />
        </div>
      )}
      <p className="font-display text-sm font-semibold text-slate-300">{title}</p>
      {hint && <p className="max-w-sm text-xs leading-relaxed text-slate-500">{hint}</p>}
      {children}
    </div>
  )
}