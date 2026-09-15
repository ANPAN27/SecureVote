import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Vote as VoteIcon,
  Zap,
  Waves,
  Leaf,
  Sparkles,
  Heart,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
  Lock,
  ShieldAlert,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import PageTransition from '../components/PageTransition'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import { cx } from '../lib/cx'

const ICONS = { zap: Zap, wave: Waves, leaf: Leaf, sparkles: Sparkles, heart: Heart }

export default function VotePage() {
  const { user, election, candidates, receipt, castVote } = useApp()
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)
  const [modal, setModal] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [checked, setChecked] = useState(false)

  if (!user) return <Navigate to="/auth" replace />
  if (user.role !== 'voter') return <Navigate to="/admin" replace />
  if (user.voted && receipt) return <Navigate to="/receipt" replace />
  if (election.status !== 'active') return <Navigate to="/voter" replace />

  const candidate = candidates.find((c) => c.id === selected)

  const handleSubmit = async () => {
    if (!candidate || !checked) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1600))
    castVote(candidate.id)
    setLoading(false)
    setConfirmed(true)
    setTimeout(() => navigate('/receipt'), 3000)
  }

  return (
    <PageTransition>
      {/* header */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <Button to="/voter" variant="ghost" size="xs" className="mb-2">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to dashboard
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Cast your ballot</h1>
          <p className="mt-1 max-w-md text-sm text-slate-400">
            Select a candidate and confirm. Your choice will be sealed in a zero-knowledge envelope and
            anchored to the chain — it <span className="text-rose-300">cannot be changed or deleted</span> after submission.
          </p>
        </div>
        <Badge tone="emerald" dot pulse>
          {election.status === 'active' ? 'ELECTION OPEN' : election.status.toUpperCase()}
        </Badge>
      </div>

      {/* success flash */}
      <AnimatePresence>
        {confirmed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="mb-8 flex items-center gap-4 rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-5"
          >
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            <div>
              <p className="font-display text-sm font-bold text-emerald-300">Vote sealed & anchored to chain</p>
              <p className="mt-0.5 text-xs text-slate-400">Redirecting to your receipt…</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* loading overlay */}
      {loading && (
        <div className="fixed inset-0 z-[70] flex flex-col items-center justify-center gap-4 bg-ink-950/85 backdrop-blur-sm">
          <div className="relative">
            <div className="clip-angled absolute inset-0 animate-pulse-soft bg-gradient-to-br from-violet-500/40 to-cyan-500/20" />
            <div className="clip-angled relative flex h-16 w-16 items-center justify-center border border-white/10 bg-ink-900 shadow-glow-violet">
              <Lock className="h-6 w-6 text-violet-300 animate-spin-slow" />
            </div>
          </div>
          <p className="font-display text-sm font-bold text-white">Sealing your ballot…</p>
          <p className="text-xs text-slate-400">Generating zero-knowledge proof</p>
        </div>
      )}

      {/* candidate grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {candidates.map((c, i) => {
          const Icon = ICONS[c.icon] || VoteIcon
          const isSelected = selected === c.id
          return (
            <motion.button
              key={c.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => setSelected(c.id)}
              disabled={confirmed || loading}
              className={cx(
                'group relative overflow-hidden rounded-2xl border p-5 text-left transition-all duration-200',
                isSelected
                  ? 'border-violet-400/60 bg-violet-500/10 shadow-glow-violet'
                  : 'border-white/[0.08] bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]'
              )}
            >
              {isSelected && (
                <div className="absolute inset-x-0 top-0 h-full overflow-hidden opacity-20">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400 to-transparent animate-scan-y" />
                </div>
              )}

              <div className={cx(
                'clip-angled flex h-14 w-14 items-center justify-center bg-gradient-to-br text-white shadow-lg mb-4',
                c.color
              )}>
                <Icon className="h-6 w-6" />
              </div>

              <h3 className="font-display text-base font-bold text-white group-hover:text-violet-200 transition">
                {c.name}
              </h3>
              <p className="text-xs font-medium text-violet-300/70">{c.party}</p>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">{c.tagline}</p>

              <div className="mt-4 flex items-center justify-between">
                <Badge tone="slate">
                  {isSelected ? 'SELECTED' : 'TAP TO SELECT'}
                </Badge>
                {isSelected && (
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75" />
                    <span className="h-2.5 w-2.5 rounded-full bg-violet-400" />
                  </span>
                )}
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* bottom bar */}
      {selected && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky bottom-0 mt-8 -mx-4 border-t border-white/[0.08] bg-ink-950/80 px-4 py-4 backdrop-blur-xl sm:-mx-6 sm:px-6"
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {candidate && (
                <div className={cx(
                  'clip-angled flex h-10 w-10 items-center justify-center bg-gradient-to-br text-white',
                  candidate.color
                )}>
                  {(() => { const I = ICONS[candidate.icon] || VoteIcon; return <I className="h-4 w-4" /> })()}
                </div>
              )}
              <div>
                <p className="text-sm font-bold text-white">{candidate?.name}</p>
                <p className="text-xs text-slate-500">{candidate?.party}</p>
              </div>
            </div>
            <Button variant="primary" onClick={() => setModal(true)}>
              <ShieldAlert className="h-4 w-4" /> Confirm Vote
            </Button>
          </div>
        </motion.div>
      )}

      {/* confirm modal */}
      <Modal
        open={modal}
        onClose={() => !loading && setModal(false)}
        title="Confirm your vote"
        eyebrow="This action is final"
        icon={<AlertTriangle className="h-5 w-5 text-white" />}
        accent="rose"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => { setModal(false); setChecked(false) }}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              loading={loading}
              disabled={!checked}
            >
              <ShieldAlert className="h-4 w-4" /> Submit ballot
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-rose-200/80 text-xs leading-relaxed">
            Once submitted, your ballot is anchored to the blockchain with a zero-knowledge proof.
            It <span className="text-rose-300 font-semibold">cannot be changed, deleted, or traced back to you</span>.
          </p>

          {candidate && (
            <div className="flex items-center gap-4 rounded-xl border border-white/[0.08] bg-white/[0.04] p-4">
              <div className={cx('clip-angled flex h-11 w-11 items-center justify-center bg-gradient-to-br text-white', candidate.color)}>
                {(() => { const I = ICONS[candidate.icon] || VoteIcon; return <I className="h-5 w-5" /> })()}
              </div>
              <div>
                <p className="font-display text-sm font-bold text-white">{candidate.name}</p>
                <p className="text-xs text-violet-300/70">{candidate.party}</p>
              </div>
            </div>
          )}

          <button
            onClick={() => setChecked((c) => !c)}
            className="flex items-start gap-3 rounded-xl border border-white/[0.08] p-3.5 text-left transition hover:border-white/20"
          >
            <div className={cx(
              'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition',
              checked ? 'border-emerald-400 bg-emerald-500/20 text-emerald-400' : 'border-white/25 text-transparent'
            )}>
              {checked && <CheckCircle2 className="h-3.5 w-3.5" />}
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              I understand this vote is irreversible once sealed on-chain. My choice
              is final and the ballot envelope will be cryptographically destroyed.
            </p>
          </button>
        </div>
      </Modal>
    </PageTransition>
  )
}