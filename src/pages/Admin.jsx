import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  Vote,
  ShieldAlert,
  LayoutDashboard,
  Gavel,
  Users2,
  Radar,
  BookOpen,
  Plus,
  Play,
  Square,
  RotateCcw,
  AlertTriangle,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import PageTransition from '../components/PageTransition'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Input from '../components/ui/Input'
import StatusBadge from '../components/ui/StatusBadge'
import AlertsFeed from '../components/AlertsFeed'
import { fmtNumber, fmtTime, shortHash } from '../lib/format'
import { TX_TYPE_META } from '../data/mock'
import { cx } from '../lib/cx'

const TABS = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'elections', label: 'Elections', icon: Gavel },
  { key: 'candidates', label: 'Candidates', icon: Users2 },
  { key: 'threats', label: 'Threat Monitor', icon: Radar },
  { key: 'ledger', label: 'Ledger', icon: BookOpen },
]

export default function Admin() {
  const {
    user, election, candidates, alerts, ledger, votesCast, turnout, activeAlerts,
    setStatus, addCandidate, removeCandidate, simulateThreat,
  } = useApp()
  const [tab, setTab] = useState('overview')
  const [candidateForm, setCandidateForm] = useState({ name: '', party: '', tagline: '' })

  if (!user) return <Navigate to="/auth" replace />

  return (
    <PageTransition>
      {/* amber header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="clip-angled flex h-12 w-12 items-center justify-center bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-glow-amber">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-amber-300/70">Admin Command Center</p>
            <h1 className="text-2xl font-bold tracking-tight">SecureVote Control Panel</h1>
          </div>
        </div>
        <Button variant="amber" onClick={simulateThreat}>
          <AlertTriangle className="h-4 w-4" /> Simulate Attack
        </Button>
      </div>

      {/* stats row */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Total Voters" value={fmtNumber(election.registeredVoters)} sub="98.2% verified" accent="amber" />
        <StatCard icon={Vote} label="Votes Cast" value={fmtNumber(votesCast)} sub={`${turnout.toFixed(1)}% turnout`} accent="violet" />
        <StatCard icon={ShieldAlert} label="Active Alerts" value={activeAlerts} sub="last 24h" accent="rose" pulse />
        <StatCard icon={Gavel} label="Election" value={election.status.toUpperCase()} sub={election.id} accent="cyan" status={election.status} />
      </div>

      {/* tab bar */}
      <div className="mb-6 flex gap-1 overflow-x-auto rounded-xl border border-white/[0.06] bg-white/[0.02] p-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cx(
              'flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition',
              tab === t.key
                ? 'bg-amber-500/15 text-amber-300'
                : 'text-slate-500 hover:bg-white/[0.04] hover:text-slate-300'
            )}
          >
            <t.icon className="h-3.5 w-3.5" /> <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {/* tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {tab === 'overview' && <OverviewTab election={election} candidates={candidates} votesCast={votesCast} alerts={alerts} ledger={ledger} />}
          {tab === 'elections' && <ElectionsTab election={election} setStatus={setStatus} />}
          {tab === 'candidates' && (
            <CandidatesTab
              candidates={candidates}
              form={candidateForm}
              setForm={setCandidateForm}
              addCandidate={addCandidate}
              removeCandidate={removeCandidate}
            />
          )}
          {tab === 'threats' && <ThreatsTab alerts={alerts} simulateThreat={simulateThreat} />}
          {tab === 'ledger' && <LedgerTab ledger={ledger} />}
        </motion.div>
      </AnimatePresence>
    </PageTransition>
  )
}

/* ====== stat card ====== */
function StatCard({ icon: Icon, label, value, sub, accent, pulse, status }) {
  const accents = {
    amber: 'from-amber-400 to-orange-500 shadow-glow-amber',
    violet: 'from-violet-500 to-fuchsia-500 shadow-glow-violet',
    rose: 'from-rose-500 to-red-600 shadow-glow-rose',
    cyan: 'from-cyan-400 to-teal-500 shadow-glow-cyan',
  }
  const tileAccents = {
    amber: 'text-amber-300 bg-amber-500/15',
    violet: 'text-violet-300 bg-violet-500/15',
    rose: 'text-rose-300 bg-rose-500/15',
    cyan: 'text-cyan-300 bg-cyan-500/15',
  }
  return (
    <Card className="clip-angled relative overflow-hidden !p-0">
      <div className="p-5">
        <div className="mb-3 flex items-center justify-between">
          <div className={cx('clip-angled flex h-10 w-10 items-center justify-center text-white bg-gradient-to-br', accents[accent])}>
            <Icon className="h-4.5 w-4.5 h-4 w-4" />
          </div>
          {pulse && (
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute h-full w-full animate-ping rounded-full bg-rose-500 opacity-75" />
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
            </span>
          )}
          {status && <StatusBadge status={status} theme="admin" />}
        </div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">{label}</p>
        <p className="mt-0.5 font-display text-2xl font-bold text-white tabular-nums">{value}</p>
        <p className="mt-0.5 text-xs text-slate-500">{sub}</p>
      </div>
      <div className={cx('h-1 w-full bg-gradient-to-r', accents[accent])} />
    </Card>
  )
}

/* ====== overview tab ====== */
function OverviewTab({ election, candidates, votesCast, alerts, ledger }) {
  const top3 = [...candidates].sort((a, b) => b.votes - a.votes).slice(0, 3)
  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      {/* charts */}
      <div className="space-y-6">
        {/* results bar */}
        <Card frame="violet" glow="violet" className="clip-angled">
          <h3 className="mb-5 font-display text-sm font-bold uppercase tracking-widest text-slate-300">
            Live Results
          </h3>
          <div className="space-y-4">
            {candidates.map((c) => {
              const pct = votesCast ? (c.votes / votesCast) * 100 : 0
              return (
                <div key={c.id}>
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2.5">
                      <span className={cx('clip-angled h-2.5 w-2.5 bg-gradient-to-r', c.color)} />
                      <span className="font-semibold text-slate-200">{c.name}</span>
                      <span className="text-slate-500">{c.party}</span>
                    </span>
                    <span className="tabular-nums font-bold text-white">{pct.toFixed(1)}%</span>
                  </div>
                  <div className="relative h-8 overflow-hidden rounded-lg bg-white/[0.04]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                      className={cx('absolute inset-y-0 left-0 rounded-lg bg-gradient-to-r', c.color)}
                    />
                    <span className="absolute inset-y-0 flex items-center pl-3 text-xs font-bold tabular-nums text-white drop-shadow-md">
                      {fmtNumber(c.votes)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* donut chart */}
        <Card frame="violet" className="clip-angled">
          <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-widest text-slate-300">
            Share Distribution
          </h3>
          <div className="flex items-center gap-8">
            <DonutChart candidates={candidates} total={votesCast} />
            <ul className="space-y-2 text-xs">
              {candidates.map((c) => {
                const pct = votesCast ? (c.votes / votesCast) * 100 : 0
                return (
                  <li key={c.id} className="flex items-center gap-2.5">
                    <span className={cx('h-2 w-2 rounded-full bg-gradient-to-r', c.color)} />
                    <span className="text-slate-300">{c.name}</span>
                    <span className="ml-auto tabular-nums font-semibold text-white">{pct.toFixed(1)}%</span>
                  </li>
                )
              })}
            </ul>
          </div>
        </Card>
      </div>

      {/* right column: alerts preview + recent ledger */}
      <div className="space-y-6">
        <Card className="!p-0">
          <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3.5">
            <h3 className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-widest text-slate-300">
              <Radar className="h-4 w-4 text-amber-400" /> Live Security Feed
            </h3>
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-rose-400">
              <span className="relative flex h-1.5 w-1.5"><span className="absolute h-full w-full animate-ping rounded-full bg-rose-500 opacity-75" /><span className="h-1.5 w-1.5 rounded-full bg-rose-500" /></span>
              live
            </span>
          </div>
          <div className="max-h-[360px] overflow-y-auto p-4">
            <AlertsFeed alerts={alerts} limit={5} live />
          </div>
        </Card>
        <Card className="!p-0">
          <div className="border-b border-white/[0.06] px-5 py-3.5">
            <h3 className="font-display text-sm font-bold uppercase tracking-widest text-slate-300">
              Recent Transactions
            </h3>
          </div>
          <ul className="divide-y divide-white/[0.05]">
            {ledger.slice(0, 6).map((l) => {
              const m = TX_TYPE_META[l.type] || TX_TYPE_META.VOTE_RECORD
              return (
                <li key={l.hash} className="flex items-center gap-3 px-5 py-3 text-xs">
                  <Badge tone={m.tone} className="shrink-0 normal-case tracking-normal">{m.label}</Badge>
                  <span className="truncate font-mono text-slate-400">{shortHash(l.hash, 6, 4)}</span>
                  <span className="ml-auto whitespace-nowrap tabular-nums text-slate-500">{fmtTime(l.time)}</span>
                </li>
              )
            })}
          </ul>
        </Card>
      </div>
    </div>
  )
}

/* ====== donut chart ====== */
function DonutChart({ candidates, total }) {
  const R = 54
  const C = 2 * Math.PI * R
  let acc = 0
  const colors = ['#8b5cf6', '#22d3ee', '#34d399', '#f59e0b', '#f43f5e']
  return (
    <div className="relative h-32 w-32 shrink-0">
      <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
        {candidates.map((c, i) => {
          const frac = total ? c.votes / total : 1 / candidates.length
          const dash = `${frac * C} ${C}`
          const offset = acc * C
          acc += frac
          return (
            <circle
              key={c.id}
              cx="70" cy="70" r={R}
              fill="none"
              stroke={colors[i % colors.length]}
              strokeDasharray={dash}
              strokeDashoffset={-offset}
              strokeWidth="12"
              opacity="0.8"
            />
          )
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="font-display text-lg font-bold text-white tabular-nums">{fmtNumber(total)}</span>
        <span className="text-[9px] font-semibold uppercase tracking-widest text-slate-500">votes</span>
      </div>
    </div>
  )
}

/* ====== elections tab ====== */
function ElectionsTab({ election, setStatus }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
      <Card frame="amber" glow="amber" className="clip-angled">
        <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-widest text-slate-300">
          Current Election
        </h3>
        <div className="space-y-4">
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-4">
            <div className="mb-3 flex items-center justify-between">
              <StatusBadge status={election.status} theme="admin" />
              <span className="text-xs font-semibold text-slate-500">{election.id}</span>
            </div>
            <h4 className="font-display text-base font-bold text-white">{election.title}</h4>
            <p className="mt-1 text-xs text-slate-400">{election.description}</p>
            <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.03] p-3">
                <p className="text-[10px] uppercase tracking-widest text-slate-500">Start</p>
                <p className="mt-0.5 font-semibold text-white">{fmtTime(election.start)}</p>
              </div>
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.03] p-3">
                <p className="text-[10px] uppercase tracking-widest text-slate-500">End</p>
                <p className="mt-0.5 font-semibold text-white">{fmtTime(election.end)}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {election.status === 'upcoming' && (
              <Button variant="amber" onClick={() => setStatus('active')}>
                <Play className="h-4 w-4" /> Start Election
              </Button>
            )}
            {election.status === 'active' && (
              <Button variant="danger" onClick={() => setStatus('closed')}>
                <Square className="h-4 w-4" /> Close Election
              </Button>
            )}
            {election.status === 'closed' && (
              <Button variant="amber" onClick={() => setStatus('active')}>
                <RotateCcw className="h-4 w-4" /> Restart Election
              </Button>
            )}
          </div>
        </div>
      </Card>

      <Card className="!p-0">
        <div className="border-b border-white/[0.06] px-5 py-3.5">
          <h3 className="font-display text-sm font-bold uppercase tracking-widest text-slate-300">
            Election History
          </h3>
        </div>
        <ul className="divide-y divide-white/[0.05]">
          {[
            { id: election.id, title: election.title, status: election.status, year: '2026' },
            { id: 'ELEC-2025-098', title: 'CS Department Rep', status: 'closed', year: '2025' },
            { id: 'ELEC-2025-077', title: 'Spring Ballot', status: 'closed', year: '2025' },
          ].map((el) => (
            <li key={el.id} className="flex items-center gap-4 px-5 py-3.5 transition hover:bg-white/[0.02]">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-200">{el.title}</p>
                <p className="text-xs text-slate-500">{el.id} · {el.year}</p>
              </div>
              <StatusBadge status={el.status} theme="admin" />
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}

/* ====== candidates tab ====== */
function CandidatesTab({ candidates, form, setForm, addCandidate, removeCandidate }) {
  const sorted = [...candidates].sort((a, b) => b.votes - a.votes)
  const totalVotes = candidates.reduce((s, c) => s + c.votes, 0)

  const handleAdd = (ev) => {
    ev.preventDefault()
    if (!form.name.trim()) return
    addCandidate(form)
    setForm({ name: '', party: '', tagline: '' })
  }

  return (
    <div className="space-y-6">
      <Card frame="amber" className="clip-angled">
        <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-widest text-slate-300">
          Add Candidate to Ballot
        </h3>
        <form onSubmit={handleAdd} className="flex flex-wrap items-end gap-3">
          <Input label="Full name" placeholder="Jane Doe" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="flex-1 min-w-[200px]" />
          <Input label="Party" placeholder="Independent" value={form.party} onChange={(e) => setForm((f) => ({ ...f, party: e.target.value }))} className="flex-1 min-w-[160px]" />
          <Input label="Tagline" placeholder="Optional tagline" value={form.tagline} onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))} className="flex-1 min-w-[200px]" />
          <Button type="submit" variant="amber" size="md"><Plus className="h-4 w-4" /> Add</Button>
        </form>
      </Card>

      <Card className="overflow-x-auto !p-0">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-white/[0.07] bg-white/[0.02] uppercase tracking-wider text-slate-500">
              <th className="px-5 py-3.5 font-semibold">Rank</th>
              <th className="px-5 py-3.5 font-semibold">Candidate</th>
              <th className="px-5 py-3.5 font-semibold">Party</th>
              <th className="px-5 py-3.5 font-semibold text-right">Votes</th>
              <th className="px-5 py-3.5 font-semibold text-right">Share</th>
              <th className="px-5 py-3.5 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05]">
            {sorted.map((c, i) => {
              const pct = totalVotes ? (c.votes / totalVotes) * 100 : 0
              return (
                <tr key={c.id} className="transition hover:bg-white/[0.02]">
                  <td className="px-5 py-3.5">
                    <span className={cx(
                      'inline-flex h-6 w-6 items-center justify-center rounded-md text-[10px] font-bold',
                      i === 0 ? 'bg-amber-500/20 text-amber-300' : 'bg-white/[0.05] text-slate-400'
                    )}>{i + 1}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-semibold text-slate-200">{c.name}</span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-400">{c.party}</td>
                  <td className="px-5 py-3.5 text-right font-bold tabular-nums text-white">{fmtNumber(c.votes)}</td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="inline-flex items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/[0.06]">
                        <div className={cx('h-full rounded-full bg-gradient-to-r', c.color)} style={{ width: `${pct}%` }} />
                      </div>
                      <span className="tabular-nums text-slate-400">{pct.toFixed(1)}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button onClick={() => removeCandidate(c.id)} className="rounded-lg border border-white/10 p-1.5 text-slate-500 transition hover:border-rose-400/50 hover:text-rose-300" aria-label="Remove candidate">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </Card>
    </div>
  )
}

/* ====== threats tab ====== */
function ThreatsTab({ alerts, simulateThreat }) {
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 font-display text-base font-bold">
          <Radar className="h-5 w-5 text-amber-400" /> Security Alert Feed
        </h3>
        <div className="flex gap-2.5">
          <Button variant="amber" onClick={simulateThreat} size="sm">
            <AlertTriangle className="h-3.5 w-3.5" /> Simulate Threat
          </Button>
        </div>
      </div>
      <AlertsFeed alerts={alerts} live />
    </div>
  )
}

/* ====== ledger tab ====== */
function LedgerTab({ ledger }) {
  return (
    <Card frame="violet" glow="violet" className="clip-angled overflow-x-auto !p-0">
      <div className="px-6 py-4">
        <h3 className="font-display text-sm font-bold uppercase tracking-widest text-slate-300">
          Blockchain Transaction Ledger
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Every transaction on the SecureVote chain is cryptographically sealed and publicly auditable.
        </p>
      </div>
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="border-b border-white/[0.07] bg-white/[0.02] uppercase tracking-wider text-slate-500">
            <th className="px-5 py-3.5 font-semibold">TX Hash</th>
            <th className="px-5 py-3.5 font-semibold">Block</th>
            <th className="px-5 py-3.5 font-semibold">Type</th>
            <th className="px-5 py-3.5 font-semibold">From</th>
            <th className="px-5 py-3.5 font-semibold">To</th>
            <th className="px-5 py-3.5 font-semibold text-right">Time</th>
            <th className="px-5 py-3.5 font-semibold text-right">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.05]">
          {ledger.map((l) => {
            const m = TX_TYPE_META[l.type] || TX_TYPE_META.VOTE_RECORD
            return (
              <tr key={l.hash} className="transition hover:bg-white/[0.02]">
                <td className="px-5 py-3.5 font-mono text-slate-400">{shortHash(l.hash, 8, 4)}</td>
                <td className="px-5 py-3.5 font-mono tabular-nums text-slate-300">#{l.block.toLocaleString()}</td>
                <td className="px-5 py-3.5">
                  <Badge tone={m.tone} className="normal-case tracking-normal">{m.label}</Badge>
                </td>
                <td className="px-5 py-3.5 font-mono text-slate-400">{l.from}</td>
                <td className="px-5 py-3.5 font-mono text-slate-400">{l.to}</td>
                <td className="px-5 py-3.5 text-right tabular-nums text-slate-500">{fmtTime(l.time)}</td>
                <td className="px-5 py-3.5 text-right">
                  <Badge tone="emerald" className="normal-case tracking-normal">{l.status}</Badge>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </Card>
  )
}