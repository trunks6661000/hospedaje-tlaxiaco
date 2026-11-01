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
        primary: {
          50: "#FAF6F3",
          100: "#F0E6DD",
          200: "#E0CCBA",
          300: "#CCAB8E",
          400: "#B8906A",
          500: "#A07553",
          600: "#855E42",
          700: "#6A4A35",
          800: "#4F3728",
          900: "#34241B",
        },
        accent: {
          50: "#F0F5EF",
          100: "#D8E6D5",
          200: "#B1CDA9",
          300: "#8AB47E",
          400: "#639B53",
          500: "#3B6B3A",
          600: "#2F562E",
          700: "#234023",
          800: "#172B17",
          900: "#0C150C",
        },
        warm: {
          50: "#FDFCFA",
          100: "#F9F6F2",
          200: "#F3EDE5",
          300: "#E8DDD0",
        },
        neutral: {
          50: "#FAF9F7",
          100: "#F5F3F0",
          200: "#E8E4DF",
          300: "#D6D0C8",
          400: "#ADA59A",
          500: "#7A7268",
          600: "#5A534B",
          700: "#433D37",
          800: "#2C2824",
          900: "#1A1714",
        },
      },
      fontFamily: {
        serif: [
          "var(--font-dm-serif)",
          "Georgia",
          "Cambria",
          "serif",
        ],
        sans: [
          "var(--font-inter)",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
export default config;
