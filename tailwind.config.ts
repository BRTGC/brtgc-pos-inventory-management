/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Use 'class' strategy to enable dark mode switching
  content: [
    './src/**/*.{js,ts,jsx,tsx}', // Scan source files for Tailwind classes
    './components/**/*.{js,ts,jsx,tsx}', // Scan component files
    './pages/**/*.{js,ts,jsx,tsx}', // Scan page files
  ],
  theme: {
    extend: {
      colors: {
        primary: '#758ECD', // Customize primary color
        darkBackground: '#2D3748', // Custom dark background color
        lightBackground: '#F7FAFC', // Custom light background color
      },
    },
  },
  plugins: [],
};