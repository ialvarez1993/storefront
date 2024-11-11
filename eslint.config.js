import vueParser from "vue-eslint-parser";
import tsParser from "@typescript-eslint/parser";
import prettierPlugin from "eslint-plugin-prettier";
import vue from "eslint-plugin-vue";
import nuxt from "eslint-plugin-nuxt";
import typescript from "@typescript-eslint/eslint-plugin";

export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx,ts,tsx,vue}"],
    languageOptions: {
      globals: {
        myGlobalVar: "readonly", // Si tienes alguna variable global personalizada
        browser: "readonly", // Definir globals estándar
        node: "readonly", // Definir globals estándar
        es2021: "readonly", // Definir globals estándar
      },
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 2021,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      vue,
      nuxt,
      "@typescript-eslint": typescript,
      prettier: prettierPlugin,
    },
    // En lugar de "extends", definimos las reglas manualmente:
    rules: {
      // Reglas de Vue
      "vue/multi-word-component-names": "off",
      "vue/no-v-html": "off",
      "vue/require-default-prop": "off",

      // Reglas generales
      "no-console": process.env.NODE_ENV === "production" ? "error" : "warn",
      "no-debugger": process.env.NODE_ENV === "production" ? "error" : "warn",

      // Reglas de TypeScript
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-unused-vars": "off",

      // Reglas de Prettier
      "prettier/prettier": "off",
    },
  },
];
