import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    colors: {
      ink: '#0A0A0A',
      gold: '#D4AF55',
      cream: '#FFF6E0',
      pink: '#FF4D8D',
      lilac: '#C9B6FF',
      white: '#FFFFFF',
    },
    fontFamily: {
      display: ['"Archivo Black"', 'sans-serif'],
      body: ['"Space Grotesk"', 'sans-serif'],
      serif: ['"Cormorant Garamond"', 'serif'],
      mono: ['"DM Mono"', 'monospace'],
    },
    boxShadow: {
      nb: '6px 6px 0 0 #0A0A0A',
      'nb-sm': '3px 3px 0 0 #0A0A0A',
      'nb-lg': '10px 10px 0 0 #0A0A0A',
      'nb-press': '2px 2px 0 0 #0A0A0A',
      none: '0 0 #0000',
    },
    borderWidth: {
      DEFAULT: '1px',
      '2': '2px',
      '3': '3px',
      '4': '4px',
      '8': '8px',
    },
    extend: {},
  },
  plugins: [],
} satisfies Config
