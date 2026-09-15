import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import {
  CANDIDATES,
  ELECTION,
  INITIAL_ALERTS,
  LEDGER,
  ALERT_BANK,
} from '../data/mock'
import { randHex, uid } from '../lib/format'

export const AppCtx = createContext(null)

export function useApp() {
  return useContext(AppCtx)
}

const STATUS_TEXT = {
  active: 'ACTIVE',
  upcoming: 'UPCOMING',
  closed: 'CLOSED',
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(null)
  const [election, setElection] = useState(ELECTION)
  const [candidates, setCandidates] = useState(CANDIDATES)
  const [alerts, setAlerts] = useState(INITIAL_ALERTS)
  const [ledger, setLedger] = useState(LEDGER)
  const [receipt, setReceipt] = useState(null)
  const [toasts, setToasts] = useState([])
  const alertCursor = useRef(0)

  const notify = useCallback((message, tone = 'info') => {
    const id = uid('toast')
    setToasts((t) => [...t, { id, message, tone }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200)
  }, [])

  const register = useCallback(
    ({ name, email }) => {
      const newUser = {
        id: uid('voter'),
        name,
        email,
        role: 'voter',
        vrcId: randHex(10).toLowerCase(),
        eligible: true,
        voted: false,
      }
      setUser(newUser)
      setLedger((l) => [
        {
          hash: randHex(16),
          block: 48214,
          type: 'VOTER_REGISTER',
          from: newUser.vrcId,
          to: 'ROLL.114',
          time: Date.now(),
          status: 'confirmed',
        },
        ...l,
      ])
      notify('Identity registered · proof generated', 'success')
      return newUser
    },
    [notify]
  )

  const login = useCallback(({ name, role }) => {
    const user = {
      id: uid('user'),
      name: name || (role === 'admin' ? 'Admin Operator' : 'Demo Voter'),
      email: name ? `${name.toLowerCase().replace(/\s+/g, '.')}@securevote.dev` : 'demo@securevote.dev',
      role,
      vrcId: randHex(10).toLowerCase(),
      eligible: role === 'voter',
      voted: false,
    }
    setUser(user)
    notify(`Authenticated as ${user.name}`, 'info')
    return user
  }, [notify])

  const logout = useCallback(() => {
    setUser(null)
    setReceipt(null)
    notify('Session ended · keys wiped locally', 'info')
  }, [notify])

  const castVote = useCallback(
    (candidateId) => {
      if (!user || !user.eligible) return null
      const candidate = candidates.find((c) => c.id === candidateId)
      if (!candidate) return null
      const now = Date.now()
      const baseBlock = ledger.length ? 48214 : 48205
      const receipt = {
        txHash: randHex(16),
        blockRef: baseBlock + 1,
        timestamp: now,
        candidateId,
        candidateName: candidate.name,
        party: candidate.party,
        voterVrc: user.vrcId,
        status: 'confirmed',
        confirmations: 1,
        network: 'SecureVote Mainnet',
      }
      setReceipt(receipt)
      setCandidates((cs) =>
        cs.map((c) => (c.id === candidateId ? { ...c, votes: c.votes + 1 } : c))
      )
      setUser((u) => ({ ...u, voted: true }))
      setLedger((l) => [
        {
          hash: receipt.txHash,
          block: receipt.blockRef,
          type: 'VOTE_RECORD',
          from: receipt.voterVrc,
          to: election.id,
          time: now,
          status: 'confirmed',
        },
        ...l,
      ])
      setAlerts((a) => [
        {
          id: uid('alert'),
          severity: 'low',
          type: 'monitor',
          title: 'Vote sealed & anchored to chain',
          detail: `Ballot from ${receipt.voterVrc.slice(0, 6)}… verified by circuit, anchored to block ${receipt.blockRef}.`,
          source: `node-edge · block ${receipt.blockRef}`,
          time: now,
        },
        ...a,
      ])
      notify('Vote cast · sealed on-chain', 'success')
      return receipt
    },
    [user, candidates, ledger, election.id, notify]
  )

  const setStatus = useCallback(
    (status) => {
      setElection((e) => ({ ...e, status }))
      const type = status === 'active' ? 'ELECTION_START' : 'ELECTION_CLOSE'
      setLedger((l) => [
        {
          hash: randHex(16),
          block: 48214,
          type,
          from: 'admin',
          to: election.id,
          time: Date.now(),
          status: 'confirmed',
        },
        ...l,
      ])
      notify(`Election ${STATUS_TEXT[status]}`, 'info')
    },
    [election.id, notify]
  )

  const addCandidate = useCallback(
    ({ name, party, tagline }) => {
      const colors = [
        'from-violet-500 to-fuchsia-500',
        'from-cyan-400 to-teal-500',
        'from-amber-400 to-orange-500',
        'from-emerald-400 to-lime-500',
        'from-rose-400 to-pink-500',
      ]
      const icons = ['zap', 'wave', 'leaf', 'sparkles', 'heart']
      setCandidates((cs) => [
        ...cs,
        {
          id: uid('c'),
          name,
          party: party || 'Independent',
          tagline: tagline || 'New on the ballot',
          color: colors[cs.length % colors.length],
          icon: icons[cs.length % icons.length],
          votes: 0,
        },
      ])
      notify('Candidate added to ballot', 'success')
    },
    [notify]
  )

  const removeCandidate = useCallback(
    (id) => {
      setCandidates((cs) => cs.filter((c) => c.id !== id))
      notify('Candidate removed from ballot', 'info')
    },
    [notify]
  )

  const simulateThreat = useCallback(() => {
    const template = ALERT_BANK[alertCursor.current % ALERT_BANK.length]
    alertCursor.current += 1
    const alert = { id: uid('alert'), ...template, time: Date.now() }
    setAlerts((a) => [alert, ...a])
    notify(`${template.severity === 'critical' ? '🚨' : '⚠️'} ${template.title}`, 'warn')
  }, [notify])

  const activeAlerts = useMemo(
    () => alerts.filter((a) => a.severity !== 'low' || a.type === 'anomaly').length,
    [alerts]
  )
  const votesCast = useMemo(() => candidates.reduce((s, c) => s + c.votes, 0), [candidates])
  const turnout = useMemo(
    () => (votesCast / election.registeredVoters) * 100,
    [votesCast, election.registeredVoters]
  )

  const value = useMemo(
    () => ({
      user,
      election,
      candidates,
      alerts,
      ledger,
      receipt,
      toasts,
      activeAlerts,
      votesCast,
      turnout,
      register,
      login,
      logout,
      castVote,
      setStatus,
      addCandidate,
      removeCandidate,
      simulateThreat,
      notify,
    }),
    [
      user, election, candidates, alerts, ledger, receipt, toasts,
      activeAlerts, votesCast, turnout, register, login, logout,
      castVote, setStatus, addCandidate, removeCandidate, simulateThreat, notify,
    ]
  )

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>
}