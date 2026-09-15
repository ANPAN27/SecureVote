import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle2,
  Copy,
  ExternalLink,
  ShieldCheck,
  Fingerprint,
  ArrowRight,
  Lock,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import PageTransition from '../components/PageTransition'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { fmtTime, shortHash } from '../lib/format'
import { cx } from '../lib/cx'

const STEPS = [
  { label: 'Querying chain state', icon: Lock },
  { label: 'Recomputing nullifier proof', icon: Fingerprint },
  { label: 'Verifying chain-of-custody seal', icon: ShieldCheck },
]

export default function Receipt() {
  const { receipt, user } = useApp()
  const [copied, setCopied] = useState(false)
  const [verifyModal, setVerifyModal] = useState(false)
  const [verifyStep, setVerifyStep] = useState(-1)
  const [verifyDone, setVerifyDone] = useState(false)

  if (!receipt) return <Navigate to="/voter" replace />
  if (!user) return <Navigate to="/auth" replace />

  const copy = () => {
    navigator.clipboard?.writeText(receipt.txHash)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  const runVerify = async () => {
    setVerifyModal(true)
    setVerifyStep(-1)
    setVerifyDone(false)
    for (let i = 0; i < STEPS.length; i++) {
      await new Promise((r) => setTimeout(r, 1100))
      setVerifyStep(i)
    }
    await new Promise((r) => setTimeout(r, 600))
    setVerifyDone(true)
  }

  const fields = [
    { label: 'Transaction ID', value: receipt.txHash, mono: true, copy: true },
    { label: 'Block Reference', value: `#${receipt.blockRef.toLocaleString()}`, mono: true },
    { label: 'Timestamp', value: fmtTime(receipt.timestamp) },
    { label: 'Network', value: receipt.network },
    { label: 'Status', value: 'CONFIRMED', tone: 'emerald' },
    { label: 'Confirmations', value: `${receipt.confirmations}` },
    { label: 'Ballot anchor', value: `VOTE〔${receipt.candidateName}〕`, mono: true },
  ]

  return (
    <PageTransition className="mx-auto max-w-2xl pt-10">
      {/* hero check */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 14, stiffness: 180 }}
        className="mb-8 flex flex-col items-center text-center"
      >
        <div className="relative mb-4">
          <div className="absolute inset-0 animate-pulse-ring rounded-full" />
          <div className="clip-angled relative flex h-16 w-16 items-center justify-center bg-gradient-to-br from-emerald-400 to-teal-500 shadow-glow-emerald">
            <CheckCircle2 className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold">Your vote is on the chain</h1>
        <p className="mt-2 max-w-md text-sm text-slate-400">
          Anchored with a zero-knowledge proof. This receipt proves your ballot was accepted without
          revealing your identity or choice publicly.
        </p>
      </motion.div>

      {/* receipt card */}
      <Card frame="violet" glow="violet" className="clip-angled !p-0">
        <div className="border-b border-white/[0.07] px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-sm font-bold uppercase tracking-widest text-slate-300">
              Ballot Receipt
            </h2>
            <Badge tone="emerald" dot pulse>
              <ShieldCheck className="h-3 w-3" /> Verified
            </Badge>
          </div>
        </div>
        <div className="divide-y divide-white/[0.06]">
          {fields.map((f) => (
            <div key={f.label} className="flex items-center gap-4 px-6 py-3.5">
              <span className="w-36 shrink-0 text-xs font-semibold uppercase tracking-wider text-slate-500">
                {f.label}
              </span>
              <span className={cx('min-w-0 flex-1 text-sm text-slate-200', f.mono && 'font-mono text-xs')}>
                {f.tone ? (
                  <Badge tone={f.tone} dot className="ml-0 normal-case tracking-normal">{f.value}</Badge>
                ) : (
                  f.value
                )}
              </span>
              {f.copy && (
                <button
                  onClick={copy}
                  className="rounded-md border border-white/10 p-1.5 text-slate-400 transition hover:border-white/25 hover:text-white"
                  aria-label="Copy transaction ID"
                >
                  {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3 border-t border-white/[0.07] px-6 py-4">
          <Button variant="primary" onClick={runVerify}>
            <ExternalLink className="h-4 w-4" /> Verify on chain
          </Button>
          <Button to="/voter" variant="ghost">
            <ArrowRight className="h-4 w-4" /> Back to Dashboard
          </Button>
        </div>
      </Card>

      {/* verify modal */}
      <AnimatePresence>
        {verifyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-ink-950/85 backdrop-blur-sm" onClick={() => setVerifyDone && setVerifyModal(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass relative w-full max-w-md rounded-2xl p-7 shadow-card"
            >
              <h3 className="mb-6 text-center font-display text-lg font-bold text-white">On-chain Verification</h3>
              <div className="space-y-4">
                {STEPS.map((s, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className={cx(
                      'clip-angled flex h-10 w-10 shrink-0 items-center justify-center border transition-all duration-300',
                      i <= verifyStep
                        ? 'border-emerald-400/50 bg-emerald-500/15 text-emerald-400'
                        : 'border-white/10 bg-white/[0.04] text-slate-500'
                    )}>
                      <s.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className={cx(
                        'text-sm font-semibold transition',
                        i <= verifyStep ? 'text-white' : 'text-slate-500'
                      )}>{s.label}</p>
                      <p className="text-[11px] text-slate-500">
                        {i < verifyStep ? '✓ Passed' : i === verifyStep ? 'Checking…' : 'Waiting…'}
                      </p>
                    </div>
                    {i < verifyStep && <CheckCircle2 className="ml-auto h-4 w-4 text-emerald-400" />}
                  </div>
                ))}
              </div>
              {verifyDone && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 text-center"
                >
                  <p className="mb-4 font-display text-2xl font-bold text-emerald-300">
                    ✓ Ballot verified on-chain
                  </p>
                  <Button variant="primary" onClick={() => setVerifyModal(false)}>
                    Close
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  )
}