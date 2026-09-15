/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#04060D',
          900: '#060A15',
          850: '#090F20',
          800: '#0C1327',
          700: '#111A34',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'glow-violet': '0 0 24px rgba(139,92,246,0.35), 0 0 64px rgba(139,92,246,0.12)',
        'glow-cyan': '0 0 24px rgba(34,211,238,0.30), 0 0 64px rgba(34,211,238,0.10)',
        'glow-amber': '0 0 24px rgba(245,158,11,0.30), 0 0 64px rgba(245,158,11,0.10)',
        'glow-rose': '0 0 24px rgba(244,63,94,0.30), 0 0 64px rgba(244,63,94,0.10)',
        'glow-emerald': '0 0 24px rgba(52,211,153,0.30)',
        card: '0 24px 70px -24px rgba(0,0,0,0.65)',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'pulse-soft': {
          '0%,100%': { opacity: '0.45' },
          '50%': { opacity: '1' },
        },
        'dash-flow': {
          to: { strokeDashoffset: '-240' },
        },
        'pulse-ring': {
          '0%': { boxShadow: '0 0 0 0 rgba(52,211,153,0.45)' },
          '70%': { boxShadow: '0 0 0 9px rgba(52,211,153,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(52,211,153,0)' },
        },
        'pulse-ring-rose': {
          '0%': { boxShadow: '0 0 0 0 rgba(244,63,94,0.5)' },
          '70%': { boxShadow: '0 0 0 9px rgba(244,63,94,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(244,63,94,0)' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        'scan-y': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(900%)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(200%)' },
        },
        'spin-slow': {
          to: { transform: 'rotate(360deg)' },
        },
        ping: {
          '75%,100%': { transform: 'scale(2)', opacity: '0' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 2.4s ease-in-out infinite',
        'dash-flow': 'dash-flow 7s linear infinite',
        'pulse-ring': 'pulse-ring 2s cubic-bezier(0.4,0,0.6,1) infinite',
        'pulse-ring-rose': 'pulse-ring-rose 1.6s cubic-bezier(0.4,0,0.6,1) infinite',
        marquee: 'marquee 42s linear infinite',
        'scan-y': 'scan-y 3.6s linear infinite',
        shimmer: 'shimmer 1.4s ease-in-out infinite',
        'spin-slow': 'spin-slow 16s linear infinite',
      },
    },
  },
  plugins: [],
}