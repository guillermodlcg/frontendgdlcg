/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        platinum: {
          DEFAULT: '#E5E4E2',
          dark: '#BFC1C2',
          light: '#F5F5F5'
        },
        gdlcg: {
          black: '#0A0A0A',
          gray: '#333333',
          silver: '#C0C0C0'
        }
      }
    },
  },
  plugins: [],
}
