import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cx } from '../../lib/cx'

export default function Input({
  label,
  icon: Icon,
  type = 'text',
  error,
  hint,
  className,
  ...props
}) {
  const [show, setShow] = useState(false)
  const isPassword = type === 'password'
  return (
    <label className={cx('block', className)}>
      {label && (
        <span className="mb-1.5 flex items-center justify-between text-xs font-medium tracking-wide text-slate-400 uppercase">
          {label}
          {hint && <span className="normal-case font-normal text-slate-500">{hint}</span>}
        </span>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        )}
        <input
          type={isPassword && show ? 'text' : type}
          className={cx(
            'input-base',
            Icon && 'pl-10',
            isPassword && 'pr-10',
            error && 'input-error'
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? 'Hide password' : 'Show password'}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-slate-500 transition hover:text-slate-300"
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {error && <span className="mt-1.5 block text-xs text-rose-400">{error}</span>}
    </label>
  )
}

const STRENGTH_RULES = [
  { re: /.{8,}/, label: '8+ chars' },
  { re: /[a-z]/, label: 'lowercase' },
  { re: /[A-Z]/, label: 'uppercase' },
  { re: /[0-9]/, label: 'number' },
  { re: /[^A-Za-z0-9]/, label: 'symbol' },
]

export function scorePassword(pw) {
  return pw ? STRENGTH_RULES.reduce((s, r) => s + (r.re.test(pw) ? 1 : 0), 0) : 0
}

const STRENGTH_META = [
  { n: 'Very weak', tone: 'bg-rose-500', text: 'text-rose-400' },
  { n: 'Weak', tone: 'bg-orange-400', text: 'text-orange-400' },
  { n: 'Fair', tone: 'bg-amber-400', text: 'text-amber-300' },
  { n: 'Strong', tone: 'bg-lime-400', text: 'text-lime-300' },
  { n: 'Fortress', tone: 'bg-emerald-400', text: 'text-emerald-300' },
]

export function PasswordStrength({ password }) {
  const score = scorePassword(password)
  const meta = STRENGTH_META[Math.max(0, score - 1)]
  return (
    <div className="space-y-1.5">
      <div className="flex gap-1.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className={cx(
              'h-1 flex-1 rounded-full transition-colors duration-300',
              i < score ? meta.tone : 'bg-white/10'
            )}
          />
        ))}
      </div>
      <div className="flex items-center justify-between text-[11px]">
        <span className={cx('font-medium', meta.text)}>
          {password ? meta.n : 'Enter a password'}
        </span>
        <span className="text-slate-500">{STRENGTH_RULES.filter((r) => r.re.test(password)).length}/5 passes</span>
      </div>
    </div>
  )
}