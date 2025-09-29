import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        sand: "#fdfbf8",
        night: "#2e2e2e",
        sunset: "#ff7c32",
        coral: "#ff5a5f",
        magenta: "#ff3a81",
        turquoise: "#00c2a8",
        lilac: "#a259ff",
        cloud: "#e0e0e0",
        ivory: "#fff8f0",
        "ink-muted": "#2e2e2eb3"
      },
      borderRadius: {
        "4xl": "2.5rem"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        inter: ["Inter", "sans-serif"]
      },
      boxShadow: {
        glow: "0 24px 60px -20px rgba(255, 58, 129, 0.4)"
      }
    }
  },
  plugins: []
};

export default config;
