import type { Config } from "tailwindcss";
import { tailwindConfig } from "@storefront-ui/vue/tailwind-config";
import sfTypography from "@storefront-ui/typography";

export default <Config>{
  presets: [tailwindConfig],
  content: ["./**/*.vue", "node_modules/@storefront-ui/vue/**/*.{js,mjs}"],
  plugins: [sfTypography],
  css: ["~/assets/css/tailwind.css"],

  theme: {
    extend: {
      colors: {
        primary: {
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
      },
      screens: {
        xxl: "1440px",
        xs: "376px",
      },
      zIndex: {
        60: "60",
        80: "60",
        100: "100",
      },
    },
  },
};
