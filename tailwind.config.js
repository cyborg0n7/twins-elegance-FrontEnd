/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          light: '#FDFCFA',
          medium: '#FAF8F5',
          card: '#F5F2ED',
          dark: '#EDE8E0',
        },
        gold: {
          light: '#D4AF37',
          accent: '#C9A961',
          DEFAULT: '#B8945F',
          dark: '#B8945F',
          deep: '#A68B5B',
        },
        luxury: {
          black: '#1A1612',
          text: '#2C2416',
          secondary: '#4A3F35',
          muted: '#6B5B4A',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Cormorant Garamond"', 'serif'], // Using Cormorant as primary body font for elegance
        body: ['"Poppins"', 'sans-serif'], // For small UI text if needed
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #C9A961 50%, #B8945F 100%)',
        'cream-gradient': 'linear-gradient(180deg, #FDFCFA 0%, #FAF8F5 50%, #F5F2ED 100%)',
        'dark-gradient': 'linear-gradient(135deg, #1A1612 0%, #2C2416 100%)',
      }
    },
  },
  plugins: [],
}
