/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#07070a",
        surface: "#09090b",
        surfaceAlt: "#18181b",
        border: "#27272a",
        primary: "#ccff00",
        secondary: "#00f0ff",
        accent: "#ff0055",
        textPrimary: "#ffffff",
        textSecondary: "#a1a1aa",
        textMuted: "#71717a",
      },
    },
  },
  plugins: [],
};
