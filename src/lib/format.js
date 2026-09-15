const HEX = '0123456789abcdef'

export function randHex(len = 16, prefix = '0x') {
  let out = ''
  for (let i = 0; i < len; i++) {
    out += HEX[Math.floor(Math.random() * 16)]
  }
  return prefix + out.toUpperCase()
}

export function shortHash(hash, head = 6, tail = 4) {
  if (!hash || hash.length <= head + tail + 1) return hash ?? ''
  return `${hash.slice(0, head + 2)}…${hash.slice(-tail)}`
}

export function timeAgo(ts) {
  const s = Math.max(1, Math.floor((Date.now() - ts) / 1000))
  if (s < 60) return `${s}s ago`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export function fmtTime(ts) {
  return new Date(ts).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export function fmtNumber(n) {
  return n.toLocaleString('en-IN')
}

export function uid(prefix = 'id') {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}