export default [
  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,tsx,vue}'],
    globals: {
      myGlobalVar: 'readonly'
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021
      },
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 2021,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      vue,
      nuxt,
      '@typescript-eslint': typescript,
      prettier: prettierPlugin
    },
    extends: ['plugin:vue/vue3-recommended', 'plugin:prettier/recommended'],
    rules: {
      // Reglas generales
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',

      // Vue reglas
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'off',
      'vue/require-default-prop': 'off',

      // Desactivar TypeScript
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-vars': 'off',

      // Desactivar Prettier
      'prettier/prettier': 'off'
    }
  }
]
