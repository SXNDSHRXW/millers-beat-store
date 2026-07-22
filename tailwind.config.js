/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        void: '#050505',
        ink: '#f0f0f0',
        'neon-blue': '#00d4ff',
        'neon-green': '#39ff14',
        'neon-blue-dim': 'rgba(0, 212, 255, 0.15)',
        'neon-green-dim': 'rgba(57, 255, 20, 0.15)',
      },
      fontFamily: {
        comic: ['"Impact"', '"Arial Black"', 'sans-serif'],
        mono: ['"Courier New"', 'monospace'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-neon-blue': 'pulseNeonBlue 2s ease-in-out infinite',
        'pulse-neon-green': 'pulseNeonGreen 2s ease-in-out infinite',
        'sign-swing': 'signSwing 2s ease-out forwards',
        'ink-splatter': 'inkSplatter 0.6s ease-out forwards',
        'page-flip': 'pageFlip 0.4s ease-out forwards',
        'shake': 'shake 0.5s ease-in-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseNeonBlue: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(0, 212, 255, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(0, 212, 255, 0.6)' },
        },
        pulseNeonGreen: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(57, 255, 20, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(57, 255, 20, 0.6)' },
        },
        signSwing: {
          '0%': { transform: 'translateY(-100px) rotateZ(-15deg)', opacity: '0' },
          '60%': { transform: 'translateY(10px) rotateZ(8deg)', opacity: '1' },
          '80%': { transform: 'translateY(-5px) rotateZ(-3deg)' },
          '100%': { transform: 'translateY(0) rotateZ(-2deg)' },
        },
        inkSplatter: {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '100%': { transform: 'scale(50)', opacity: '0' },
        },
        pageFlip: {
          '0%': { transform: 'rotateY(90deg)', opacity: '0' },
          '100%': { transform: 'rotateY(0deg)', opacity: '1' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
        glow: {
          '0%': { filter: 'brightness(1)' },
          '100%': { filter: 'brightness(1.3)' },
        },
      },
      perspective: {
        '1000': '1000px',
      },
    },
  },
  plugins: [],
};