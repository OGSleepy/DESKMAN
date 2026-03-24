/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"Share Tech Mono"', '"IBM Plex Mono"', 'monospace'],
        display: ['"VT323"', 'monospace'],
        body: ['"IBM Plex Mono"', 'monospace'],
      },
      colors: {
        deskman: {
          bg: '#050908',
          body: '#0d1f1a',
          glass: '#0a1f18',
          green: '#00ffb3',
          'green-dim': '#7fffcc',
          'green-muted': '#4a9e80',
          red: '#ff3b1f',
          text: '#e8fff7',
          'text-secondary': '#4a9e80',
          border: '#1a3d30',
          ruler: '#0f2e24',
        },
      },
      animation: {
        'disc-spin': 'discSpin 4s linear infinite',
        'disc-decel': 'discSpin 1.5s cubic-bezier(0.25,0.46,0.45,0.94) forwards',
        'cassette-scroll': 'cassetteScroll 20s linear infinite',
        'phosphor-pulse': 'phosphorPulse 3s ease-in-out infinite',
        'pixel-reveal': 'pixelReveal 0.6s steps(8) forwards',
        'eq-bounce': 'eqBounce 0.15s ease-in-out',
      },
      keyframes: {
        discSpin: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        cassetteScroll: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        phosphorPulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
        pixelReveal: {
          from: { opacity: '0', filter: 'blur(4px)' },
          to: { opacity: '1', filter: 'blur(0)' },
        },
        eqBounce: {
          '0%, 100%': { transform: 'scaleY(1)' },
          '50%': { transform: 'scaleY(1.2)' },
        },
      },
    },
  },
  plugins: [],
}
