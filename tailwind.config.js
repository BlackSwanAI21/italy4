/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  safelist: [
    // Add theme-specific classes to safelist to prevent purging
    {
      pattern: /(bg|text|border|ring)-(indigo|purple|emerald|blue)-(50|200|500|600|700|900)/,
    },
  ],
  theme: {
    extend: {
      keyframes: {
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' }
        },
        ping: {
          '75%, 100%': {
            transform: 'scale(2)',
            opacity: '0'
          }
        }
      },
      animation: {
        bounce: 'bounce 1s infinite',
        ping: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite'
      }
    },
  },
  plugins: [],
};