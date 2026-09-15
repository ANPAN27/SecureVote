import { Link } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { cx } from '../../lib/cx'

const base =
  'group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl font-display font-semibold tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 disabled:pointer-events-none disabled:opacity-50'

const variants = {
  primary:
    'text-white bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 bg-[length:200%_auto] shadow-glow-violet hover:bg-right hover:-translate-y-0.5 hover:shadow-[0_0_44px_rgba(139,92,246,0.55)]',
  cyan: 'bg-gradient-to-r from-cyan-400 to-teal-400 text-ink-950 shadow-glow-cyan hover:-translate-y-0.5 hover:brightness-110',
  amber: 'bg-gradient-to-r from-amber-400 to-orange-500 text-ink-950 shadow-glow-amber hover:-translate-y-0.5 hover:brightness-110',
  danger: 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-glow-rose hover:-translate-y-0.5',
  ghost:
    'border border-white/10 bg-white/[0.03] text-slate-200 hover:border-violet-400/50 hover:bg-white/[0.06] hover:text-white',
  outline: 'border border-cyan-400/40 text-cyan-300 hover:border-cyan-300 hover:shadow-glow-cyan',
}

const sizes = {
  xs: 'px-3 py-1.5 text-[11px]',
  sm: 'px-4 py-2 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  loading = false,
  glow = true,
  ...props
}) {
  const cls = cx(base, variants[variant], sizes[size], className)

  const content = (
    <>
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
      {/* hover shimmer */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/20 blur-md transition-transform duration-700 ease-out group-hover:translate-x-[420%]"
      />
    </>
  )

  if (props.to) {
    const { to, ...rest } = props
    return (
      <Link to={to} className={cls} {...rest}>
        {content}
      </Link>
    )
  }
  return (
    <button className={cls} {...props}>
      {content}
    </button>
  )
}