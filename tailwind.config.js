module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {    
    extend: {
      colors: {
        "primary": "#570D77",
        "secondary": "#42065c",
        "accentDark":"#38044E",
        "textPrimary":"#2E3D6E"
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("tailwind-scrollbar"),
    require("tailwind-scrollbar-hide"),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/line-clamp') 
  ],
}
