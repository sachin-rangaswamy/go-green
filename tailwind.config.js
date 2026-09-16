/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        forest: '#265832',
        paper: '#E5E4E0',
        earth: '#94755C',
        sand: '#BE9F87',
        accent: '#4CAF50',
        alert: '#E53935',
        warn: '#FFC107',
        scoreA: '#1B5E20',
        scoreB: '#4CAF50',
        scoreC: '#FFC107',
        scoreD: '#FF9800',
        scoreE: '#E53935',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Londrina Solid"', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      keyframes: {
        'scan-line': {
          '0%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(220px)' },
          '100%': { transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'float-up': {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '1' },
          '100%': { transform: 'translateY(-80px) scale(1.3)', opacity: '0' },
        },
        'score-pop': {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '60%': { transform: 'scale(1.15)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'confetti-fall': {
          '0%': { transform: 'translateY(-10vh) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(110vh) rotate(720deg)', opacity: '0' },
        },
        'badge-glow': {
          '0%,100%': { boxShadow: '0 0 20px 4px rgba(76,175,80,0.5)' },
          '50%': { boxShadow: '0 0 40px 12px rgba(76,175,80,0.9)' },
        },
        'pulse-red': {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(229,57,53,0.5)' },
          '50%': { boxShadow: '0 0 0 6px rgba(229,57,53,0)' },
        },
      },
      animation: {
        'scan-line': 'scan-line 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.4s ease-out',
        'float-up': 'float-up 1.2s ease-out forwards',
        'score-pop': 'score-pop 0.5s cubic-bezier(0.34,1.56,0.64,1)',
        'fade-in': 'fade-in 0.35s ease-out',
        'confetti-fall': 'confetti-fall 2.5s linear forwards',
        'badge-glow': 'badge-glow 1.5s ease-in-out infinite',
        'pulse-red': 'pulse-red 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
