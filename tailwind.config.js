/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
   
      extend: {
        colors:{
          primary:"var(--text-color)",
          dark: "var(--bg-color)",
          secondary: "var(--primary-color)",
        },
        keyframes: {
          slideDown: {
            '0%': { transform: 'translateY(-100%)', opacity: '0' },
            '100%': { transform: 'translateY(0)', opacity: '1' },
          },
          fadeIn: {
            '0%': { opacity: 0, scale: 0 },
            '100%': { opacity: 1, scale: 1},
          },
        },
        animation: {
          slideDown: 'slideDown 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards',
          fadeIn: 'fadeIn 1s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards',
        },
  
    },
  },
  plugins: [],
}

