import { motion } from 'framer-motion'
import { cx } from '../lib/cx'

export default function PageTransition({ children, className }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={cx('relative mx-auto w-full max-w-7xl px-4 pt-8 pb-24 sm:px-6', className)}
    >
      {children}
    </motion.main>
  )
}