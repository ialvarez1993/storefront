import type { Config } from "tailwindcss";
import { tailwindConfig } from "@storefront-ui/vue/tailwind-config";
import sfTypography from "@storefront-ui/typography";

export default <Config>{
  presets: [tailwindConfig],
  darkMode: ["class"],
  content: ["./**/*.vue", "node_modules/@storefront-ui/vue/**/*.{js,mjs}"],
  plugins: [sfTypography],
  css: [
    "~/assets/css/tailwind.css",
    "primevue/resources/themes/lara-light-blue/theme.css",
  ],

  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    fontFamily: {
      designer: ["Designer", "sans-serif"],
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          "50": "#fffdea",
          "100": "#fff7c5",
          "200": "#fff085",
          "300": "#ffe146",
          "400": "#ffcf1b",
          "500": "#ffae00",
          "600": "#e28400",
          "700": "#000",
          "800": "#f7b013",
          "900": "#000",
          "950": "#000",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      screens: {
        xxl: "1440px",
        xs: "376px",
      },
      zindex: {
        60: "60",
        80: "60",
        100: "100",
      },
    },
  },
};
