/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0f",
        surface: "#111118",
        primary: "#6366f1", // indigo
        accent: "#22d3ee", // cyan
        muted: "#94a3b8",
        border: "rgba(255,255,255,0.08)",
      },
    },
  },
  plugins: [],
}
