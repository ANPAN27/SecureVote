const MIN = 60 * 1000
const HOUR = 60 * MIN
const DAY = 24 * HOUR
const NOW = Date.now()

export const ELECTION = {
  id: 'ELEC-2026-114',
  title: 'Student Union General Election 2026',
  description:
    'Elect your representatives for the 2026–27 academic term. Every ballot is sealed with a zero-knowledge proof and anchored to the SecureVote chain.',
  status: 'active', // 'active' | 'upcoming' | 'closed'
  start: NOW - 6 * HOUR,
  end: NOW + 2 * DAY + 5 * HOUR,
  organizer: 'Election Commission · Campus',
  registeredVoters: 12480,
}

export const CANDIDATES = [
  {
    id: 'c1',
    name: 'Aarav Mehta',
    party: 'Vertex Alliance',
    tagline: 'Technology for every classroom',
    color: 'from-violet-500 to-fuchsia-500',
    icon: 'zap',
    votes: 3210,
  },
  {
    id: 'c2',
    name: 'Sanya Kapoor',
    party: 'Pulse Party',
    tagline: 'Your voice, amplified',
    color: 'from-cyan-400 to-teal-500',
    icon: 'wave',
    votes: 2845,
  },
  {
    id: 'c3',
    name: 'Rohan Iyer',
    party: 'Green Grid',
    tagline: 'A sustainable campus first',
    color: 'from-emerald-400 to-lime-500',
    icon: 'leaf',
    votes: 1973,
  },
  {
    id: 'c4',
    name: 'Ishita Sharma',
    party: 'Nova Front',
    tagline: 'Radical transparency',
    color: 'from-amber-400 to-orange-500',
    icon: 'sparkles',
    votes: 1522,
  },
  {
    id: 'c5',
    name: 'Kabir Nair',
    party: 'Independent',
    tagline: 'Vote for the real change',
    color: 'from-rose-400 to-pink-500',
    icon: 'heart',
    votes: 1098,
  },
]

export const ALERT_BANK = [
  {
    severity: 'critical',
    type: 'double-vote',
    title: 'Duplicate vote attempt blocked',
    detail:
      'Voter 0x4FA3…91B attempted to submit a second ballot. Rejected — nullifier already consumed on block 48,212.',
    source: '203.0.113.42 · edge-07',
  },
  {
    severity: 'critical',
    type: 'brute-force',
    title: 'Brute-force login wave detected',
    detail:
      '14 rapid login failures against the voter pool in 90s. Rate limiter engaged, shadow honeypot armed.',
    source: '198.51.100.7 · auth-cluster',
  },
  {
    severity: 'critical',
    type: 'replay',
    title: 'Replay attack rejected',
    detail:
      'A stale but cryptographically valid transaction envelope was re-submitted. Nonce check blocked it at consensus.',
    source: 'edge-05 · consensus',
  },
  {
    severity: 'critical',
    type: 'unauthorized',
    title: 'Unauthorized admin route probe',
    detail:
      'Role-restricted endpoint hit without a valid admin proof. ZK identity proof rejected (err: INVALID_ROLE_CLAIM).',
    source: '203.0.113.94 · api-2',
  },
  {
    severity: 'warning',
    type: 'anomaly',
    title: 'Unusual voting cadence in region K-12',
    detail:
      'Ballot burst at 10 votes/min from one ward. Flagged for human review — no rules violated.',
    source: 'node-17 · region K-12',
  },
  {
    severity: 'warning',
    type: 'brute-force',
    title: 'Credential stuffing attempt',
    detail:
      'Reused password patterns detected across 4 accounts. Shadow honeypot captured all attempts.',
    source: '198.51.100.210 · auth',
  },
  {
    severity: 'warning',
    type: 'anomaly',
    title: 'Failed proof ×3 for the same ballot',
    detail:
      'Circuit verification failed repeatedly for one envelope — possible misbehaving botnet client.',
    source: 'edge-09 · warden',
  },
  {
    severity: 'low',
    type: 'monitor',
    title: 'Node sync drift observed → self-healed',
    detail:
      'Fork-point 48,203 momentarily disagreed. Longest-chain rule resolved the split in 2 blocks.',
    source: 'obelisk-3 · consensus',
  },
]

export const INITIAL_ALERTS = ALERT_BANK.map((a, i) => ({
  id: `alert-${Date.now()}-${i}`,
  ...a,
  time: NOW - (i + 1) * 7 * MIN,
}))

export const LEDGER = [
  {
    hash: '0x9F2C71A34D1B48AB',
    block: 48213,
    type: 'VOTE_RECORD',
    from: '0x4FA3…91B',
    to: 'ELEC-2026-114',
    time: NOW - 5 * MIN,
    status: 'confirmed',
  },
  {
    hash: '0x3AC1D9F209C4A2E1',
    block: 48213,
    type: 'VOTER_REGISTER',
    from: '0x88C0…F2E',
    to: 'ROLL.114',
    time: NOW - 9 * MIN,
    status: 'confirmed',
  },
  {
    hash: '0x71B8E44C0AB6D5F3',
    block: 48212,
    type: 'VOTE_RECORD',
    from: '0x1B22…7AD',
    to: 'ELEC-2026-114',
    time: NOW - 12 * MIN,
    status: 'confirmed',
  },
  {
    hash: '0xEC50F82A3B91C746',
    block: 48212,
    type: 'ALERT_FLAG',
    from: 'edge-09',
    to: 'SECURITY.LEDGER',
    time: NOW - 14 * MIN,
    status: 'confirmed',
  },
  {
    hash: '0x5D9F61B820E37A94',
    block: 48211,
    type: 'BLOCK_SEAL',
    from: 'obelisk-3',
    to: 'CHAIN',
    time: NOW - 16 * MIN,
    status: 'confirmed',
  },
  {
    hash: '0xAA1937F25E08C4BD',
    block: 48211,
    type: 'VOTE_RECORD',
    from: '0x0D77…E30',
    to: 'ELEC-2026-114',
    time: NOW - 18 * MIN,
    status: 'confirmed',
  },
  {
    hash: '0x84C2F07B9D5A13E8',
    block: 48211,
    type: 'ELECTION_START',
    from: 'admin',
    to: 'ELEC-2026-114',
    time: NOW - 42 * MIN,
    status: 'confirmed',
  },
  {
    hash: '0xE17B5A30F9D2486C',
    block: 48205,
    type: 'VOTER_REGISTER',
    from: '0x61A4…9C0',
    to: 'ROLL.114',
    time: NOW - 3 * HOUR,
    status: 'confirmed',
  },
]

export const SECURITY_STATS = {
  threatLevel: 'LOW',
  uptime: '99.98%',
  attacksBlocked: 147,
  avgLatency: '210ms',
}

// Human labels for alert types
export const ALERT_TYPES = {
  'double-vote': 'Double-Vote',
  'brute-force': 'Brute-Force',
  replay: 'Replay',
  unauthorized: 'Unauthorized Access',
  anomaly: 'Anomaly',
  monitor: 'System',
}

export const TX_TYPE_META = {
  VOTE_RECORD: { label: 'Vote Record', tone: 'violet' },
  VOTER_REGISTER: { label: 'Voter Register', tone: 'cyan' },
  ALERT_FLAG: { label: 'Alert Flag', tone: 'amber' },
  BLOCK_SEAL: { label: 'Block Seal', tone: 'emerald' },
  ELECTION_START: { label: 'Election Start', tone: 'amber' },
  ELECTION_CLOSE: { label: 'Election Close', tone: 'rose' },
  ELECTION_CREATE: { label: 'Election Create', tone: 'cyan' },
}