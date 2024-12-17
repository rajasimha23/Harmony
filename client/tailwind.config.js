/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      height: {
        '90vh':'90vh',
      },
      width: {
        '90vw':'90vw',
      },
      colors: {
        light1: '#f0f8ff',  
        light2: '#e6f7ff', 
        dark1: '#2c3e50',   
        dark2: '#34495e',
        inputColour: "#f5f5f5",
        credbg: "#e0e0e0",
        header: "#b0dce2"
      },
      animation: {
        typing: "typing 1.5s steps(10, end) forwards, blink 0.7s infinite",
      },
      keyframes: {
        typing: {
          "0%": { width: "0" },
          "100%": { width: "100%" },
        },
        blink: {
          "0%, 100%": { borderColor: "transparent" },
          "50%": { borderColor: "white" },
        },
      },
    },
  },
  plugins: [],
}

