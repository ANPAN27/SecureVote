import { motion } from 'framer-motion'
import {
  ShieldCheck,
  Lock,
  Vote,
  ArrowRight,
  Radar,
  CheckCircle2,
  ShieldAlert,
  AlertTriangle,
  Radio,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import PageTransition from '../components/PageTransition'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import SectionHeading from '../components/ui/SectionHeading'
import { ALERT_BANK } from '../data/mock'
import { fmtNumber } from '../lib/format'
import { cx } from '../lib/cx'

const PILLARS = [
  {
    icon: ShieldCheck,
    color: 'from-violet-500 to-fuchsia-600',
    glow: 'shadow-glow-violet',
    title: 'Blockchain Integrity',
    desc: 'Every ballot is sealed as a zero-knowledge proof and written to an immutable ledger. Votes cannot be altered, replayed, or deleted once anchored.',
    bullets: ['Zero-knowledge proofs', 'Immutable append-only ledger', 'Publicly verifiable transcript'],
  },
  {
    icon: Lock,
    color: 'from-cyan-400 to-teal-500',
    glow: 'shadow-glow-cyan',
    title: 'Smart Contract Rules',
    desc: 'Voting rules are enforced by verifiable on-chain logic — eligibility, one-vote-per-voter, and deadline windows are all encoded into the contract itself.',
    bullets: ['Nullifier-based dedup', 'Encrypted ballot envelopes', 'Transparent tally commits'],
  },
  {
    icon: Radar,
    color: 'from-amber-400 to-orange-500',
    glow: 'shadow-glow-amber',
    title: 'Cyberattack Detection',
    desc: 'An AI-driven Warden layer monitors every packet in real time — catching double-vote attacks, replay storms, brute-force waves, and anomalous region behaviour as they happen.',
    bullets: ['Real-time anomaly detection', 'Replay-attack protection', 'Geofenced anomaly scans'],
  },
]

const TRUST_STATS = [
  { n: '12,480', l: 'Voters enrolled', icon: Vote },
  { n: '10,648', l: 'Votes sealed on-chain', icon: ShieldCheck },
  { n: '147', l: 'Attacks blocked', icon: ShieldAlert },
  { n: '0', l: 'Confirmed compromises', icon: CheckCircle2 },
]

const MINI_ALERTS = ALERT_BANK.slice(0, 4)

export default function Landing() {
  const { election } = useApp()
  return (
    <PageTransition className="pt-10 sm:pt-16">
      {/* ======================== HERO ======================== */}
      <section className="relative grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* copy */}
        <div className="relative z-10 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-300">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute h-full w-full animate-ping rounded-full bg-violet-400 opacity-70" />
                <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
              </span>
              Secured by zero-knowledge cryptography
            </span>
            <h1 className="text-4xl font-bold leading-[1.12] tracking-tight sm:text-5xl lg:text-[3.5rem]">
              Cast your vote on a chain{' '}
              <span className="text-gradient">that can't be cheated</span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-400 sm:text-lg">
              SecureVote fuses immutable blockchain voting with AI-driven cyberattack detection —
              every ballot sealed, every anomaly caught in real time.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Button to="/auth" variant="primary" size="lg">
              Login to Vote <ArrowRight className="h-4 w-4" />
            </Button>
            <Button to="/auth" variant="outline" size="lg">
              Register to Vote
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-10 flex flex-wrap items-center gap-6 border-t border-white/[0.07] pt-6"
          >
            {TRUST_STATS.map((s, i) => (
              <div key={i} className="flex items-center gap-2.5 text-xs text-slate-400">
                <s.icon className="h-4 w-4 text-violet-400" />
                <span className="font-semibold text-white">{s.n}</span>
                <span className="hidden sm:inline">{s.l}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* hero right — live election card */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.18 }}
          className="relative z-10 mx-auto w-full max-w-md"
        >
          <div className="animate-float">
            <Card glow="violet" className="clip-angled overflow-hidden !p-0">
              {/* scan line */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-full overflow-hidden opacity-20">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400 to-transparent animate-scan-y [animation-duration:3s]" />
              </div>
              <div className="p-5">
                <div className="mb-4 flex items-center justify-between">
                  <Badge tone="emerald" dot pulse>
                    {election.status === 'active' ? 'LIVE ELECTION' : election.status.toUpperCase()}
                  </Badge>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    {election.id}
                  </span>
                </div>
                <h3 className="mb-1 font-display text-lg font-bold text-white">{election.title}</h3>
                <p className="mb-5 text-xs text-slate-500">{election.description.slice(0, 72)}…</p>
                <div className="space-y-2.5">
                  {[
                    { n: 'Aarav Mehta', p: 'Vertex Alliance', pct: 30, color: 'from-violet-500 to-fuchsia-500' },
                    { n: 'Sanya Kapoor', p: 'Pulse Party', pct: 27, color: 'from-cyan-400 to-teal-500' },
                    { n: 'Rohan Iyer', p: 'Green Grid', pct: 19, color: 'from-emerald-400 to-lime-500' },
                  ].map((c) => (
                    <div key={c.n}>
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-200">{c.n}</span>
                        <span className="tabular-nums text-slate-500">{c.pct}%</span>
                      </div>
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/[0.07]">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${c.pct}%` }}
                          transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                          className={`h-full rounded-full bg-gradient-to-r ${c.color}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex items-center gap-2 border-t border-white/[0.08] pt-4 text-[10px] uppercase tracking-widest text-slate-500">
                  <Radio className="h-3.5 w-3.5 animate-pulse-soft text-emerald-400" />
                  {fmtNumber(10648)} votes sealed · zero-knowledge proof
                </div>
              </div>
            </Card>
          </div>
          <div className="pointer-events-none absolute -bottom-8 -left-6 h-40 w-40 rounded-full bg-violet-600/20 blur-3xl" />
          <div className="pointer-events-none absolute -right-8 top-10 h-32 w-32 rounded-full bg-cyan-500/15 blur-3xl" />
        </motion.div>
      </section>

      {/* ======================== SECURITY TICKER ======================== */}
      <section className="relative my-24 overflow-hidden rounded-xl border border-white/[0.06] bg-ink-900/50 py-3">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-ink-950 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-ink-950 to-transparent z-10" />
        <div className="flex animate-marquee whitespace-nowrap">
          {[...MINI_ALERTS, ...MINI_ALERTS].map((a, i) => (
            <span
              key={i}
              className="mx-6 inline-flex items-center gap-3 text-xs"
            >
              {a.severity === 'critical' ? (
                <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
              ) : (
                <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
              )}
              <span className="font-semibold text-slate-300">{a.title}</span>
              <span className="text-slate-600">·</span>
            </span>
          ))}
        </div>
      </section>

      {/* ======================== PILLARS ======================== */}
      <section className="py-12">
        <SectionHeading
          eyebrow="Security Pillars"
          title="Three layers, zero compromises"
          desc="Every layer is independently verifiable, end-to-end auditable, and hardened against the most common attack vectors in modern e-voting."
          align="center"
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {PILLARS.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
            >
              <Card frame="violet" hover className="h-full clip-angled !p-0">
                {/* top scan area */}
                <div className="relative overflow-hidden border-b border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-transparent px-6 pt-6 pb-5">
                  <div className={cx('clip-angled absolute left-4 top-4 flex h-12 w-12 items-center justify-center bg-gradient-to-br text-white', p.color)}>
                    <p.icon className="h-5 w-5" strokeWidth={2.2} />
                  </div>
                  <p className="mt-14 font-display text-lg font-bold text-white">{p.title}</p>
                </div>
                <div className="p-6">
                  <p className="text-sm leading-relaxed text-slate-400">{p.desc}</p>
                  <ul className="mt-4 space-y-2">
                    {p.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ======================== CTA ======================== */}
      <section className="relative mt-12 overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-violet-600/10 via-fuchsia-600/5 to-cyan-600/10 p-10 sm:p-14 text-center">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-[0.05]" />
        <div className="relative z-10 mx-auto max-w-lg">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Ready to make your vote <span className="text-gradient">count</span>?
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            Register with a government ID, receive your cryptographic ballot envelope,
            and vote — all sealed in under two minutes.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Button to="/auth" variant="primary" size="lg">
              Register to Vote <ArrowRight className="h-4 w-4" />
            </Button>
            <Button to="/auth" variant="outline" size="lg">
              <Lock className="h-4 w-4" /> Login
            </Button>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}