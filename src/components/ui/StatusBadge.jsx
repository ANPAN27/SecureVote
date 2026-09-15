import { cx } from '../../lib/cx'
import Badge from './Badge'

const STATUS_META = {
  active: { tone: 'emerald', dot: true, pulse: true, label: 'Active' },
  upcoming: { tone: 'cyan', dot: true, pulse: true, label: 'Upcoming' },
  closed: { tone: 'slate', dot: false, pulse: false, label: 'Closed' },
}

export default function StatusBadge({ status, theme = 'voter' }) {
  const meta = STATUS_META[status] ?? STATUS_META.closed
  const label = meta.label
  return (
    <Badge
      tone={meta.tone}
      dot={meta.dot}
      pulse={meta.pulse}
      className={cx(theme === 'admin' && 'border-amber-400/30 bg-amber-500/10 text-amber-300')}
    >
      {label}
    </Badge>
  )
}