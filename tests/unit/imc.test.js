import test from 'node:test';
import assert from 'node:assert/strict';
import { calcularIMC, classificarIMC } from '../../src/imc.js';

test('IMC de 80 kg e 2 m é 20', () => {
  assert.equal(calcularIMC(80, 2), 20);
});

test('IMC rejeita altura zero', () => {
  assert.throws(() => calcularIMC(80, 0), RangeError);
});

test('IMC rejeita peso não numérico', () => {
  assert.throws(() => calcularIMC('80', 2), RangeError);
});

for (const [valor, esperado] of [
  [18.49, 'Baixo peso'],
  [18.5, 'Peso adequado'],
  [24.99, 'Peso adequado'],
  [25, 'Sobrepeso'],
  [29.99, 'Sobrepeso'],
  [30, 'Obesidade']
]) {
  test(`classificação no limite ${valor}`, () => {
    assert.equal(classificarIMC(valor), esperado);
  });
}