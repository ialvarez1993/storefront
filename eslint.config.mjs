import { FlatCompat } from "@eslint/eslintrc";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  {
    ignores: ["**/node_modules/**", "dist/**"],
  },
  {
    files: ["**/*.{js,mjs,cjs,jsx,vue,ts,tsx}"],
    ...compat.extends("@nuxtjs")[0],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      parser: await import("vue-eslint-parser"),
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        parser: await import("@typescript-eslint/parser"),
        extraFileExtensions: [".vue"],
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "@typescript-eslint": (await import("@typescript-eslint/eslint-plugin"))
        .default,
      vue: (await import("eslint-plugin-vue")).default,
    },
    rules: {
      "vue/multi-word-component-names": "off",
      "import/no-unresolved": "off",
      "node/no-missing-import": "off",
      // Add any TypeScript-specific rules here
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
];
