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
        luxury: {
          black: "#0B0B0C",
          charcoal: "#141416",
          carbon: "#1A1A1E",
          panel: "#202024",
          border: "#2A2A30",
          borderLight: "#E8E4DC",
          ivory: "#F8F6F2",
          cream: "#F4EFEA",
          sand: "#E8E2D8",
          mutedText: "#9B9A98",
          gold: "#C9A24B",
          goldLight: "#DFBF73",
          goldMuted: "#8E7234",
          roseGold: "#B76E79",
          emerald: "#0E3B2F",
          emeraldLight: "#164E3E",
          burgundy: "#4A1521",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Playfair Display", "Cormorant Garamond", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "sans-serif"],
      },
      letterSpacing: {
        luxury: "0.2em",
        ultra: "0.3em",
      },
      transitionDuration: {
        400: "400ms",
        600: "600ms",
      },
    },
  },
  plugins: [],
};

export default config;
