import { cx } from '../../lib/cx'

export default function SectionHeading({ eyebrow, title, desc, align = 'left', accent = 'violet' }) {
  const accentMap = {
    violet: 'text-violet-300 border-violet-400/30 bg-violet-500/10',
    cyan: 'text-cyan-300 border-cyan-400/30 bg-cyan-500/10',
    amber: 'text-amber-300 border-amber-400/30 bg-amber-500/10',
    rose: 'text-rose-300 border-rose-400/30 bg-rose-500/10',
  }
  return (
    <div className={cx('max-w-2xl', align === 'center' && 'mx-auto text-center')}>
      {eyebrow && (
        <span
          className={cx(
            'mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em]',
            accentMap[accent]
          )}
        >
          {eyebrow}
        </span>
      )}
      <h2 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl">{title}</h2>
      {desc && <p className="mt-3 text-sm leading-relaxed text-slate-400 sm:text-base">{desc}</p>}
    </div>
  )
}