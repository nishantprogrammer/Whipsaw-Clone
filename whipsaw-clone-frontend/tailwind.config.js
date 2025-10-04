/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#000000', // Pure black to match original
        secondary: '#F5F5F5',
        accent: '#FF3B30',
      },
    },
  },
}
