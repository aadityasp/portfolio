/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Warm editorial light palette (never pure white / pure black)
        paper: '#F6F3EC',
        paper2: '#EFEBE1', // card / secondary surface
        ink: '#191510', // near-black, warm
        soft: '#6B6457', // muted body text
        faint: '#9A9281', // captions
        line: '#E3DCCD', // hairline
        accent: '#2742D6', // cobalt, the single accent
        'accent-ink': '#1B2E9E',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      maxWidth: { content: '1200px' },
      keyframes: {
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        pulseDot: { '0%,100%': { transform: 'scale(1)', opacity: 1 }, '50%': { transform: 'scale(1.35)', opacity: 0.55 } },
      },
      animation: {
        marquee: 'marquee 26s linear infinite',
        pulseDot: 'pulseDot 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
