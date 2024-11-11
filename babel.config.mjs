import { defineConfig } from 'vite'

export default defineConfig({
  presets: [
    '@babel/preset-env', // Para compilar JS a un estándar que sea compatible con la mayoría de los entornos
    '@babel/preset-typescript' // Para manejar TypeScript
  ],
  plugins: [
    '@babel/plugin-transform-runtime' // Para optimizar el uso de código común
  ]
})
