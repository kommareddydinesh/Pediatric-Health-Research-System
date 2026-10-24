/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        medical: {
          light: '#e0f2fe',
          DEFAULT: '#0284c7',
          dark: '#075985',
        },
        accent: {
          DEFAULT: '#10b981', // emerald
          warning: '#f59e0b', // amber
          danger: '#ef4444' // red
        }
      }
    },
  },
  plugins: [],
}
