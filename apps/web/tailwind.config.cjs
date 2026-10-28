/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        background: "#071827",
        surface: "#10283A",
        gold: "#C9A227",
        "gold-light": "#E6C86E",
        cream: "#F5F1E8",
        "royal-green": "#1F3D2B",
        muted: "#A8B6C3",
      },
      fontFamily: {
        heading: ["Playfair Display", "Georgia", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slow-zoom": {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.05)" },
        },
      },
      animation: {
        "fade-in": "fade-in 800ms ease-out both",
        "fade-in-delayed": "fade-in 800ms ease-out 160ms both",
        "fade-in-later": "fade-in 800ms ease-out 320ms both",
        "slow-zoom": "slow-zoom 24s ease-in-out infinite alternate",
      },
    },
  },
  plugins: [],
};
