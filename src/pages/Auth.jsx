import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ShieldCheck,
  User,
  Mail,
  KeyRound,
  ShieldAlert,
  Zap,
  ArrowRight,
  Lock,
  Fingerprint,
  CheckCircle2,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import PageTransition from '../components/PageTransition'
import Card from '../components/ui/Card'
import Input, { PasswordStrength } from '../components/ui/Input'
import Button from '../components/ui/Button'

const SECURITY_BULLETS = [
  'Credentials hashed with SHA-3-512',
  'Zero-knowledge identity proofs on-chain',
  'AES-256 at rest · TLS 1.3 in transit',
]

export default function Auth() {
  const { register, login } = useApp()
  const navigate = useNavigate()
  const [tab, setTab] = useState('voter')
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const validate = () => {
    const e = {}
    if (mode === 'register' && !form.name.trim()) e.name = 'Name required'
    if (!form.email.includes('@')) e.email = 'Valid email required'
    if (form.password.length < 4) e.password = 'Enter a password'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    if (!validate()) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    if (tab === 'admin') {
      login({ name: 'Admin Operator', role: 'admin' })
      navigate('/admin')
    } else if (mode === 'register') {
      register({ name: form.name, email: form.email })
      navigate('/voter')
    } else {
      login({ name: form.name || 'Demo Voter', role: 'voter' })
      navigate('/voter')
    }
  }

  const quickLogin = (role) => {
    setLoading(true)
    setTimeout(() => {
      login({ name: role === 'admin' ? 'Admin Operator' : 'Demo Voter', role })
      navigate(role === 'admin' ? '/admin' : '/voter')
    }, 600)
  }

  return (
    <PageTransition className="flex min-h-[calc(100vh-12rem)] items-center justify-center pt-4">
      <div className="grid w-full max-w-4xl gap-10 lg:grid-cols-2 lg:items-center">
        {/* left copy */}
        <div className="hidden lg:block">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-300">
              End-to-end encrypted
            </p>
            <h2 className="text-3xl font-bold leading-snug">
              Your ballot, your <span className="text-gradient">identity</span>
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-400">
              Registration creates a zero-knowledge identity proof — your real credentials never leave your device.
              You receive a sealed ballot envelope that can't be traced back to you.
            </p>
            <ul className="mt-6 space-y-2.5">
              {SECURITY_BULLETS.map((b) => (
                <li key={b} className="flex items-center gap-2.5 text-xs text-slate-300">
                  <span className="clip-angled flex h-6 w-6 items-center justify-center bg-emerald-500/15 text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* right form card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
        >
          <Card frame="violet" glow="violet" className="relative overflow-hidden !p-0">
            {/* ambient top gradient */}
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-violet-500/15 to-transparent pointer-events-none" />

            {/* tab switcher */}
            <div className="relative flex border-b border-white/[0.07]">
              {[
                { key: 'voter', label: 'Voter', icon: Fingerprint },
                { key: 'admin', label: 'Administrator', icon: ShieldAlert },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`flex flex-1 items-center justify-center gap-2 py-3.5 text-xs font-semibold uppercase tracking-wider transition ${
                    tab === t.key
                      ? t.key === 'admin'
                        ? 'border-b-2 border-amber-400 bg-amber-500/10 text-amber-300'
                        : 'border-b-2 border-violet-400 bg-violet-500/10 text-violet-300'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <t.icon className="h-3.5 w-3.5" /> {t.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="relative space-y-4 p-6 pt-5">
              {tab === 'voter' && (
                <>
                  <div className="flex gap-2 border-b border-white/[0.06] pb-4">
                    {['login', 'register'].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMode(m)}
                        className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition ${
                          mode === m
                            ? 'border-violet-400/50 bg-violet-500/15 text-violet-300'
                            : 'border-white/10 text-slate-500 hover:border-white/25 hover:text-slate-300'
                        }`}
                      >
                        {m === 'login' ? 'Login' : 'Register'}
                      </button>
                    ))}
                  </div>

                  {mode === 'register' && (
                    <Input
                      label="Full name"
                      icon={User}
                      placeholder="Jane Doe"
                      value={form.name}
                      onChange={(e) => set('name', e.target.value)}
                      error={errors.name}
                    />
                  )}
                  <Input
                    label="Email address"
                    icon={Mail}
                    type="email"
                    placeholder="you@campus.edu"
                    value={form.email}
                    onChange={(e) => set('email', e.target.value)}
                    error={errors.email}
                  />
                  <div>
                    <Input
                      label="Password"
                      icon={KeyRound}
                      type="password"
                      placeholder="••••••••"
                      value={form.password}
                      onChange={(e) => set('password', e.target.value)}
                      error={errors.password}
                    />
                    {mode === 'register' && <PasswordStrength password={form.password} />}
                  </div>
                </>
              )}

              {tab === 'admin' && (
                <div className="mb-1 flex items-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5">
                  <ShieldAlert className="h-5 w-5 shrink-0 text-amber-400" />
                  <p className="text-xs leading-relaxed text-amber-200/70">
                    Admin login is <span className="font-semibold text-amber-300">demo only</span> — in production this would require HSM-backed eID authentication.
                  </p>
                </div>
              )}

              {tab === 'voter' ? (
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={loading}
                  className="w-full"
                >
                  {mode === 'register' ? 'Create Account & Ballot' : 'Login'} <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="amber"
                  size="lg"
                  loading={loading}
                  className="w-full"
                >
                  Open Command Center <ShieldAlert className="h-4 w-4" />
                </Button>
              )}
            </form>

            {/* quick demo */}
            <div className="relative border-t border-white/[0.07] px-6 py-4">
              <p className="mb-2 text-center text-[10px] uppercase tracking-[0.22em] text-slate-500">
                Skip form · Quick demo access
              </p>
              <div className="flex gap-2.5">
                <button
                  onClick={() => quickLogin('voter')}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] py-2.5 text-xs font-semibold text-slate-300 transition hover:border-violet-400/40 hover:text-violet-200"
                >
                  <Zap className="h-3.5 w-3.5 text-violet-400" /> Demo Voter
                </button>
                <button
                  onClick={() => quickLogin('admin')}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] py-2.5 text-xs font-semibold text-slate-300 transition hover:border-amber-400/40 hover:text-amber-200"
                >
                  <ShieldAlert className="h-3.5 w-3.5 text-amber-400" /> Demo Admin
                </button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </PageTransition>
  )
}