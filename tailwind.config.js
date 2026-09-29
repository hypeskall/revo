/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#000000",
        foreground: "#ffffff",
        revolut: {
          blue: "#0075EB",
          "blue-hover": "#0062C4",
          dark: "#000000",
          card: "#191C1F",
          "card-subtle": "#14171A",
          surface: "#202428",
          pill: "#262A30",
          "pill-hover": "#30353D",
          border: "rgba(255, 255, 255, 0.08)",
          "border-bright": "rgba(255, 255, 255, 0.16)",
          muted: "#8E959E",
          dim: "#565C66",
          green: "#2ED573",
          red: "#FF4757",
        },
      },
      fontFamily: {
        sans: [
          'var(--font-revolut)',
          'var(--font-inter)',
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
      },
      boxShadow: {
        "ios-card": "0 4px 24px -2px rgba(0, 0, 0, 0.6)",
        "ios-sheet": "0 -10px 40px rgba(0, 0, 0, 0.8)",
        "blue-glow": "0 0 24px rgba(0, 117, 235, 0.4)",
      },
    },
  },
  plugins: [],
};
