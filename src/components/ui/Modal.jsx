import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { cx } from '../../lib/cx'

export const modalAccent = {
  violet: 'from-violet-500/30 via-fuchsia-500/10 to-transparent',
  amber: 'from-amber-500/30 via-orange-500/10 to-transparent',
  rose: 'from-rose-500/30 via-red-500/10 to-transparent',
  cyan: 'from-cyan-500/30 via-teal-500/10 to-transparent',
  emerald: 'from-emerald-500/30 via-teal-500/10 to-transparent',
}

export default function Modal({
  open,
  onClose,
  title,
  eyebrow,
  icon,
  accent = 'violet',
  children,
  footer,
  size = 'md',
}) {
  const ref = useRef(null)
  if (typeof document === 'undefined') return <>{children}</>

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    window.addEventListener('keydown', onKey)
    ref.current?.querySelector('button, [href], input, [tabindex]')?.focus()
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl' }

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center p-4 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <div
            className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className={cx(
              'glass relative w-full overflow-hidden rounded-2xl shadow-card',
              sizes[size]
            )}
          >
            <div
              aria-hidden
              className={cx(
                'pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b',
                modalAccent[accent]
              )}
            />
            <div className="relative p-6 sm:p-7">
              <div className="mb-5 flex items-start gap-4">
                {icon && (
                  <div className="clip-angled flex h-11 w-11 shrink-0 items-center justify-center bg-gradient-to-br from-violet-600/80 to-fuchsia-600/60 text-white shadow-glow-violet">
                    {icon}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  {eyebrow && (
                    <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-300">
                      {eyebrow}
                    </p>
                  )}
                  <h3 className="text-lg font-semibold leading-snug">{title}</h3>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close dialog"
                  className="rounded-lg border border-white/10 p-1.5 text-slate-400 transition hover:border-white/25 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="text-sm leading-relaxed text-slate-300">{children}</div>
              {footer && <div className="mt-6 flex flex-wrap items-center justify-end gap-3">{footer}</div>}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}