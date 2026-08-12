import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          base: "#080C10",
          surface: "#0D1117",
          border: "#1A2332",
          ops: "#0D0808",
        },
        accent: {
          primary: "#1A73E8",
          glow: "#1A73E826",
          muted: "#2A4A7F",
        },
        ops: {
          accent: "#C0392B",
          glow: "#C0392B1A",
        },
        text: {
          primary: "#F0F4F8",
          secondary: "#8B9AB0",
          muted: "#4A5568",
        },
        status: {
          danger: "#E53E3E",
          success: "#38A169",
        },
      },
      fontSize: {
        hero: "clamp(48px, 7vw, 96px)",
        section: "clamp(32px, 4vw, 56px)",
      },
      fontFamily: {
        mono: "'JetBrains Mono', 'Fira Code', monospace",
      },
      letterSpacing: {
        tight: "-0.03em",
        tighter: "-0.02em",
        normal: "0",
        wider: "0.02em",
      },
      backgroundImage: {
        "glow-blue": "radial-gradient(ellipse 800px 500px at 50% 30%, #1A73E808 0%, transparent 70%)",
        "glow-red": "radial-gradient(ellipse 600px 400px at 50% 50%, #C0392B0D, transparent)",
      },
    },
  },
  plugins: [],
};

export default config;
