export function calcularIMC(peso, altura) {
  if (typeof peso !== 'number' || typeof altura !== 'number' ||
      !Number.isFinite(peso) || !Number.isFinite(altura) ||
      peso <= 0 || altura <= 0) {
    throw new RangeError('Peso e altura devem ser números positivos');
  }
  return peso / (altura * altura);
}

export function classificarIMC(imc) {
  if (typeof imc !== 'number' || !Number.isFinite(imc) || imc <= 0) {
    throw new RangeError('IMC inválido');
  }
  if (imc < 18.5) return 'Baixo peso';
  if (imc < 25) return 'Peso adequado';
  if (imc < 30) return 'Sobrepeso';
  return 'Obesidade';
}