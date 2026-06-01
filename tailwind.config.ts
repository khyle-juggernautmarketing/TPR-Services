import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        tpr: {
          primary: '#2596BE',
          accent: '#2596BE',
          'accent-dark': '#1e7f9e',
          'primary-dark': '#1e7f9e',
          surface: '#F8FAFC',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-dm-serif)', 'Georgia', 'serif'],
      },
      boxShadow: {
        card: '0 4px 24px -4px rgba(15, 23, 42, 0.1)',
        'card-lg': '0 20px 50px -12px rgba(15, 23, 42, 0.18)',
      },
    },
  },
  plugins: [],
}
export default config
