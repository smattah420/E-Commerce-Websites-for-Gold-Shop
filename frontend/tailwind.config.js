// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        serif: ['Cormorant Garamond', 'ui-serif', 'Georgia', 'serif'],
      },
      colors: {
        lux: {
          bg: '#07070A',
          panel: 'rgba(255,255,255,0.06)',
          panel2: 'rgba(255,255,255,0.08)',
          border: 'rgba(255,255,255,0.12)',
          text: 'rgba(255,255,255,0.78)',
          strong: 'rgba(255,255,255,0.95)',
          muted: 'rgba(255,255,255,0.60)',
          gold: '#D6B25E',
          gold2: '#F1DC9A',
          danger: '#FF4D6D',
        },
      },
      boxShadow: {
        'lux-soft': '0 24px 60px rgba(0,0,0,0.45)',
        'lux-card': '0 16px 40px rgba(0,0,0,0.35)',
      },
      borderRadius: {
        xl: '14px',
        '2xl': '18px',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-40%)' },
          '100%': { transform: 'translateX(140%)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
