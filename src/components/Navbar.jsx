import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShieldCheck, LogOut, ShieldAlert, Fingerprint } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { cx } from '../lib/cx'
import Button from './ui/Button'

export function Brand({ compact = false, tag = 'voter' }) {
  const tagColor =
    tag === 'admin'
      ? 'from-amber-400 to-orange-600'
      : 'from-violet-600 to-fuchsia-600'
  return (
    <Link to="/" className="group flex items-center gap-3">
      <div className={cx('clip-angled relative flex h-10 w-10 items-center justify-center bg-gradient-to-br text-white shadow-glow-violet', tagColor)}>
        <ShieldCheck className="h-5 w-5" strokeWidth={2.4} />
        <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-cyan-400 shadow-glow-cyan" />
      </div>
      {!compact && (
        <span className="leading-none">
          <span className="block font-display text-lg font-bold tracking-tight text-white">
            Secure<span className="text-gradient">Vote</span>
          </span>
          <span className="mt-0.5 block text-[9px] font-semibold uppercase tracking-[0.28em] text-slate-500">
            {tag === 'admin' ? 'Admin Command Center' : 'Blockchain Voting System'}
          </span>
        </span>
      )}
    </Link>
  )
}

export default function Navbar() {
  const { user, logout } = useApp()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const isAdmin = user?.role === 'admin'

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-ink-950/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Brand tag={isAdmin ? 'admin' : 'voter'} />

        <nav className="hidden items-center gap-1 md:flex">
          {user ? (
            <>
              <NavLink to="/voter" label="Voter Dashboard" active={pathname.startsWith('/voter')} />
              <NavLink to="/admin" label="Admin Console" active={pathname.startsWith('/admin')} admin />
            </>
          ) : (
            <p className="flex items-center gap-2 text-xs text-slate-500">
              <span className="relative flex h-2 w-2">
                <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              All systems operational · threat level low
            </p>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] py-1 pl-1 pr-3 sm:flex">
                <span className={cx(
                  'flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold text-white',
                  isAdmin ? 'bg-gradient-to-br from-amber-500 to-orange-600' : 'bg-gradient-to-br from-violet-500 to-fuchsia-600'
                )}>
                  {user.name.slice(0, 2).toUpperCase()}
                </span>
                <span className="leading-none">
                  <span className="block max-w-[9rem] truncate text-xs font-semibold text-slate-200">
                    {user.name}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-slate-500">
                    {user.role === 'admin' ? <ShieldAlert className="h-3 w-3 text-amber-400" /> : <Fingerprint className="h-3 w-3 text-violet-400" />}
                    {isAdmin ? 'super-admin' : 'verified voter'}
                  </span>
                </span>
              </div>
              <button
                onClick={handleLogout}
                aria-label="Log out"
                className="rounded-xl border border-white/10 p-2.5 text-slate-400 transition hover:border-rose-400/40 hover:text-rose-300"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" to="/auth" className="hidden sm:inline-flex">
                Login
              </Button>
              <Button variant="primary" size="sm" to="/auth">
                Register to Vote
              </Button>
            </>
          )}
        </div>
      </div>

      {/* mobile nav */}
      {user && (
        <div className="flex items-center gap-1 overflow-x-auto px-4 pb-2 md:hidden">
          <NavLink to="/voter" label="Voter" active={pathname.startsWith('/voter')} mobile />
          <NavLink to="/admin" label="Admin" active={pathname.startsWith('/admin')} admin mobile />
        </div>
      )}
    </header>
  )
}

function NavLink({ to, label, active, admin, mobile }) {
  return (
    <motion.span whileTap={{ scale: 0.96 }}>
      <Link
        to={to}
        className={cx(
          'whitespace-nowrap rounded-lg px-3.5 py-2 text-xs font-semibold transition',
          active
            ? admin
              ? 'bg-amber-500/15 text-amber-300'
              : 'bg-violet-500/15 text-violet-300'
            : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200',
          mobile && 'text-[11px]'
        )}
      >
        {label}
      </Link>
    </motion.span>
  )
}