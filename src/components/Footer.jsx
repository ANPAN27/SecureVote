import { Link } from 'react-router-dom'
import { ShieldCheck, Github } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] bg-ink-950/60 backdrop-blur-xl">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-display text-lg font-bold text-white">
            Secure<span className="text-gradient">Vote</span>
          </p>
          <p className="mt-2 max-w-xs text-xs leading-relaxed text-slate-500">
            A blockchain-based secure voting system with AI-driven cyberattack detection.
            Built as a B.Tech final-year project.
          </p>
        </div>
        <div className="text-xs text-slate-500">
          <p className="mb-2 font-semibold uppercase tracking-widest text-slate-400">System</p>
          <ul className="space-y-1.5">
            <li>Zero-knowledge ballot proofs</li>
            <li>Immutable on-chain ledger</li>
            <li>24/7 anomaly &amp; threat monitoring</li>
            <li>End-to-end vote verification</li>
          </ul>
        </div>
        <div className="flex items-start justify-start gap-4 md:justify-end">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-semibold text-emerald-300">
            <ShieldCheck className="h-3.5 w-3.5" /> SECURE CHANNEL
          </span>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Source code on GitHub"
            className="rounded-lg border border-white/10 p-2 text-slate-400 transition hover:border-white/30 hover:text-white"
          >
            <Github className="h-4 w-4" />
          </a>
        </div>
      </div>
      <div className="border-t border-white/[0.05] py-4 text-center text-[11px] text-slate-600">
        © 2026 SecureVote · B.Tech Project · Demo frontend — all data is mocked
      </div>
    </footer>
  )
}