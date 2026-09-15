import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Radar, ShieldAlert, Activity, Info, Server, Ghost } from 'lucide-react'
import Badge from './ui/Badge'
import EmptyState from './ui/EmptyState'
import { timeAgo } from '../lib/format'
import { cx } from '../lib/cx'

export const SEVERITY_META = {
  critical: { tone: 'rose', label: 'Critical', bar: 'from-rose-500 to-red-600', text: 'text-rose-300' },
  warning: { tone: 'amber', label: 'Warning', bar: 'from-amber-400 to-orange-500', text: 'text-amber-300' },
  low: { tone: 'cyan', label: 'Low', bar: 'from-cyan-400 to-teal-500', text: 'text-cyan-300' },
}

const TYPE_ICONS = {
  'double-vote': ShieldAlert,
  'brute-force': Radar,
  replay: Server,
  unauthorized: Activity,
  anomaly: Activity,
  monitor: Info,
}

export function AlertRow({ alert, index = 0 }) {
  const meta = SEVERITY_META[alert.severity]
  const Icon = TYPE_ICONS[alert.type] ?? Activity
  return (
    <motion.li
      layout
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16, transition: { duration: 0.15 } }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.3) }}
      className="group relative overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 transition hover:border-white/[0.16]"
    >
      <div className={cx('absolute inset-y-0 left-0 w-1 bg-gradient-to-b', meta.bar)} />
      <div className="flex items-start gap-3.5">
        <div className={cx('clip-angled mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center border border-white/10 bg-white/[0.04]', meta.text)}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-display text-sm font-semibold text-slate-100">{alert.title}</p>
            {alert.severity === 'critical' && (
              <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-rose-400">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute h-full w-full animate-ping rounded-full bg-rose-500 opacity-75" />
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                </span>
                live
              </span>
            )}
          </div>
          <p className="mt-1 text-xs leading-relaxed text-slate-400">{alert.detail}</p>
          <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[10px] text-slate-500">
            <Badge tone={meta.tone} className="normal-case tracking-normal">
              {meta.label}
            </Badge>
            <Badge tone="slate" className="normal-case tracking-normal">
              {alert.type?.replace('-', ' ')}
            </Badge>
            <span>·</span>
            <span>{alert.source}</span>
            <span className="ml-auto tabular-nums">{timeAgo(alert.time)}</span>
          </div>
        </div>
      </div>
    </motion.li>
  )
}

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'critical', label: 'Critical' },
  { key: 'warning', label: 'Warning' },
  { key: 'low', label: 'Low' },
]

export default function AlertsFeed({ alerts, className, live = false, limit }) {
  const [filter, setFilter] = useState('all')
  const filtered = alerts.filter((a) => filter === 'all' || a.severity === filter).slice(0, limit ?? alerts.length)

  return (
    <div className={className}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cx(
                'rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wider transition',
                filter === f.key
                  ? 'border-amber-400/50 bg-amber-500/15 text-amber-300'
                  : 'border-white/10 text-slate-500 hover:border-white/25 hover:text-slate-300'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        {live && (
          <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-rose-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute h-full w-full animate-ping rounded-full bg-rose-500 opacity-75" />
              <span className="h-2 w-2 rounded-full bg-rose-500" />
            </span>
            live feed
          </span>
        )}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Ghost}
          title="No alerts in this bucket"
          hint="Nothing suspicious here. The watchdog is calm — for now."
        />
      ) : (
        <ul className="space-y-2.5">
          <AnimatePresence initial={false}>
            {filtered.map((a, i) => (
              <AlertRow key={a.id} alert={a} index={i} />
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  )
}