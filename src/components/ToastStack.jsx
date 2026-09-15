import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ShieldCheck, Info, AlertTriangle, XCircle } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { cx } from '../lib/cx'

const toneMap = {
  success: { icon: ShieldCheck, ring: 'border-emerald-400/40', text: 'text-emerald-300', bar: 'bg-emerald-400' },
  info: { icon: Info, ring: 'border-cyan-400/40', text: 'text-cyan-300', bar: 'bg-cyan-400' },
  warn: { icon: AlertTriangle, ring: 'border-amber-400/40', text: 'text-amber-300', bar: 'bg-amber-400' },
  danger: { icon: XCircle, ring: 'border-rose-400/40', text: 'text-rose-300', bar: 'bg-rose-400' },
}

export default function ToastStack() {
  const { toasts } = useApp()
  return createPortal(
    <div className="pointer-events-none fixed bottom-5 right-5 z-[90] flex w-[calc(100vw-2.5rem)] max-w-sm flex-col gap-2.5">
      <AnimatePresence>
        {toasts.map((t) => {
          const m = toneMap[t.tone] ?? toneMap.info
          const Icon = m.icon
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, x: 40, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.95 }}
              transition={{ type: 'spring', damping: 24, stiffness: 300 }}
              className={cx(
                'glass pointer-events-auto relative flex items-start gap-3 overflow-hidden rounded-xl border-l-4 p-3.5 shadow-card',
                m.ring
              )}
            >
              <span className={cx('absolute inset-y-0 left-0 w-1', m.bar)} />
              <Icon className={cx('mt-0.5 h-4.5 w-4.5 shrink-0 h-[18px] w-[18px]', m.text)} />
              <p className="pt-0.5 text-xs font-medium leading-relaxed text-slate-200">{t.message}</p>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>,
    document.body
  )
}