// example.test.ts

// Esta es una función simple que vamos a probar
function sum(a: number, b: number): number {
  return a + b
}

// Escribimos un test usando Bun
describe('Test de la función sum', () => {
  it('debería sumar correctamente dos números', () => {
    const result = sum(2, 3)

    // Usamos expect() para afirmar que el resultado es 5
    expect(result).toBe(5)
  })
})
