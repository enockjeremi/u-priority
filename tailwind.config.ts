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
        primary: "#005f6b",
        secondary: "#008c9e",
        dark: "#343838",
        extradark: "#2C3033",
        light: "#00b4cc",
        extralight: "#00dffc",
      },
    },
  },
  plugins: [],
};
export default config;
