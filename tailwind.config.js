/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#10B981', // light green (success / primary)
          light: '#34D399',
          dark: '#059669',
        },
        secondary: {
          DEFAULT: '#3B82F6', // light blue (info / secondary)
          light: '#60A5FA',
          dark: '#2563EB',
        },
        darkgray: {
          DEFAULT: '#374151', // sidebar, text, borders
          light: '#4B5563',
          dark: '#1F2937',
        },
        heading: '#111827', // black / high-contrast text
      }
    },
  },
  plugins: [],
}