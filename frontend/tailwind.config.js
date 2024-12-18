/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#333333', // Dark gray for text
        secondary: '#F4F7FA', // Light gray background
        accent: '#0061F2', // Soft blue for buttons and links
        border: '#E0E0E0', // Light border for clean separation
      },
    },
  },
  plugins: [],
}