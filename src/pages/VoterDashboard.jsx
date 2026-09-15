import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Vote,
  BadgeCheck,
  CalendarClock,
  Radar,
  ArrowRight,
  Fingerprint,
  ShieldCheck,
  FileCheck2,
  Gavel,
  History,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import PageTransition from '../components/PageTransition'
import Card, { CornerFrame } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import StatusBadge from '../components/ui/StatusBadge'
import Countdown from '../components/ui/Countdown'
import ProgressBar from '../components/ui/ProgressBar'
import { fmtTime, fmtNumber, shortHash } from '../lib/format'
import { cx } from '../lib/cx'

export default function VoterDashboard() {
  const { user, election, votesCast, turnout, receipt, ledger } = useApp()
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setElapsed(Math.min(100, ((Date.now() - election.start) / (election.end - election.start)) * 100)), 60000)
    return () => clearInterval(id)
  }, [election])

  if (!user) return <Navigate to="/auth" replace />
  if (user.role !== 'voter') return <Navigate to="/admin" replace />

  const countdownTarget = election.status === 'upcoming' ? election.start : election.end

  return (
    <PageTransition>
      {/* greeting */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-wrap items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="clip-angled flex h-12 w-12 items-center justify-center bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white shadow-glow-violet">
            <Fingerprint className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
              Verified voter · {shortHash(user.vrcId, 6, 4)}
            </p>
            <h1 className="text-2xl font-bold tracking-tight">Welcome back, {user.name.split(' ')[0]}</h1>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {user.eligible && (
            <Badge tone="emerald" dot pulse>
              <BadgeCheck className="h-3 w-3" /> Eligible
            </Badge>
          )}
          <Badge tone={user.voted ? 'cyan' : 'slate'} dot>
            {user.voted ? 'Ballot sealed' : 'Ballot not yet sealed'}
          </Badge>
        </div>
      </motion.div>

      {/* mini stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            label: 'Voting status',
            value: user.voted ? 'Vote recorded' : 'Pending',
            sub: user.voted ? 'Await receipt in your vault' : 'One ballot left to cast',
            icon: Vote,
            tone: user.voted ? 'emerald' : 'violet',
          },
          {
            label: 'Election window',
            value: election.active ? 'Open now' : 'Closed',
            sub: `${fmtTime(election.start)} → ${fmtTime(election.end)}`,
            icon: CalendarClock,
            tone: 'cyan',
          },
          {
            label: 'Threat level',
            value: 'Low · monitored',
            sub: 'Warden watching every packet',
            icon: Radar,
            tone: 'amber',
          },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
            <Card className="flex items-center gap-4 !p-5">
              <div className={cx('clip-angled flex h-11 w-11 shrink-0 items-center justify-center', {
                violet: 'bg-violet-500/15 text-violet-300',
                emerald: 'bg-emerald-500/15 text-emerald-300',
                cyan: 'bg-cyan-500/15 text-cyan-300',
                amber: 'bg-amber-500/15 text-amber-300',
              }[s.tone])}>
                <s.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">{s.label}</p>
                <p className="truncate font-display text-base font-bold text-white">{s.value}</p>
                <p className="truncate text-xs text-slate-500">{s.sub}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* main election card */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card frame="violet" glow="violet" className="clip-angled relative overflow-hidden !p-0">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-full overflow-hidden opacity-15">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400 to-transparent animate-scan-y [animation-duration:4s]" />
          </div>

          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <StatusBadge status={election.status} />
                <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                  {election.id} · {election.organizer}
                </span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{election.title}</h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-400">{election.description}</p>

              <div className="mt-7">
                {election.status === 'active' && <Countdown target={countdownTarget} />}
                {election.status === 'upcoming' && (
                  <p className="flex items-center gap-2 text-sm text-cyan-300">
                    <CalendarClock className="h-4 w-4" /> Voting opens {fmtTime(election.start)}
                  </p>
                )}
                {election.status === 'closed' && (
                  <p className="flex items-center gap-2 text-sm text-slate-400">
                    <Gavel className="h-4 w-4" /> This election has closed. Results were sealed at {fmtTime(election.end)}.
                  </p>
                )}
              </div>

              <div className="mt-8">
                {user.voted ? (
                  <div className="flex flex-wrap items-center gap-3">
                    <Button to="/receipt" variant="cyan">
                      <FileCheck2 className="h-4 w-4" /> View My Receipt
                    </Button>
                    <Button to="/vote" variant="ghost">
                      Review Ballot
                    </Button>
                  </div>
                ) : election.status === 'active' ? (
                  <Button to="/vote" variant="primary" size="lg">
                    <Vote className="h-5 w-5" /> Cast Your Vote
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button disabled variant="ghost" size="lg">
                    Voting unavailable
                  </Button>
                )}
              </div>
            </div>

            {/* right rail */}
            <div className="flex flex-col gap-5 rounded-xl border border-white/[0.06] bg-ink-900/50 p-5">
              <div>
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-slate-400">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Turnout
                  </span>
                  <span className="font-bold tabular-nums text-white">{turnout.toFixed(1)}%</span>
                </div>
                <ProgressBar value={turnout} tone="violet" />
                <p className="mt-2 text-[11px] text-slate-500">
                  {fmtNumber(votesCast)} ballots sealed of {fmtNumber(election.registeredVoters)} registered
                </p>
              </div>
              <div className="space-y-1.5 border-t border-white/[0.06] pt-4 text-xs text-slate-500">
                <p className="flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> One voter = one nullifier</p>
                <p className="flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Ballots sealed in ZK envelopes</p>
                <p className="flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Tally verified at close</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* recent chain activity */}
      <div className="mt-8">
        <h3 className="mb-4 flex items-center gap-2 font-display text-sm font-bold uppercase tracking-widest text-slate-400">
          <History className="h-4 w-4" /> Your recent chain activity
        </h3>
        <Card className="overflow-hidden !p-0">
          <ul className="divide-y divide-white/[0.05]">
            {receipt && (
              <ActivityRow
                icon={Vote}
                title="Ballot anchored"
                sub={`TX ${shortHash(receipt.txHash, 8, 4)} · block ${receipt.blockRef} · ${receipt.candidateName}`}
                time={receipt.timestamp}
                tone="violet"
              />
            )}
            {ledger.filter((l) => l.type === 'VOTER_REGISTER' && l.from === user.vrcId).map((l) => (
              <ActivityRow
                key={l.hash}
                icon={Fingerprint}
                title="Identity proof issued"
                sub={`TX ${shortHash(l.hash, 8, 4)} · anchored to ${l.to} · registered on-chain`}
                time={l.time}
                tone="emerald"
              />
            ))}
            {!receipt && <ActivityRow icon={ShieldCheck} title="Watchdog onboarded" sub="Anomaly monitor attached to your session" time={Date.now()} tone="cyan" />}
          </ul>
        </Card>
      </div>
    </PageTransition>
  )
}

function ActivityRow({ icon: Icon, title, sub, time, tone }) {
  const tones = {
    violet: 'text-violet-300',
    emerald: 'text-emerald-300',
    cyan: 'text-cyan-300',
  }
  return (
    <li className="flex items-center gap-4 p-4 transition hover:bg-white/[0.02]">
      <div className={cx('clip-angled flex h-9 w-9 shrink-0 items-center justify-center border border-white/10 bg-white/[0.04]', tones[tone])}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-200">{title}</p>
        <p className="truncate font-mono text-xs text-slate-500">{sub}</p>
      </div>
      <span className="text-xs text-slate-500">{new Date(time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
    </li>
  )
}