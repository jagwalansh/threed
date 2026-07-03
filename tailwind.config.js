/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: "#1e1e1e",
        panel: "#2b2b2b",
        "panel-2": "#333333",
        canvas: "#ffffff",
        line: "#3d3d3d",
        "line-strong": "#505050",
        muted: "#b4b4b4",
        text: "#f4f6fb",
        accent: "#0d99ff",
        "accent-dim": "rgba(13, 153, 255, 0.18)",
        "accent-2": "#a259ff",
        blue: "#0d99ff",
        "blue-dim": "rgba(13, 153, 255, 0.18)",
        red: "#ff6b6b",
        "red-dim": "rgba(255, 107, 107, 0.12)",
        button: "#222833",
        "button-hover": "#2d3542",
      },
      boxShadow: {
        sm: "0 2px 8px rgba(0, 0, 0, 0.25)",
        md: "0 8px 32px rgba(0, 0, 0, 0.35)",
        lg: "0 28px 90px rgba(0, 0, 0, 0.45)",
      },
      borderRadius: {
        sm: "6px",
        md: "8px",
        lg: "12px",
      },
      transitionTimingFunction: {
        "ease-out": "cubic-bezier(0.22, 1, 0.36, 1)",
        "ease-spring": "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      transitionDuration: {
        fast: "120ms",
        normal: "200ms",
        slow: "350ms",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        mono: ["SFMono-Regular", "Consolas", "Liberation Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
