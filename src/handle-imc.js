import { calcularIMC, classificarIMC } from './imc.js';

// Serviço compartilhado pelo servidor local e pela função da Vercel.
export function processarIMC(dados) {
  try {
    const imc = calcularIMC(dados?.peso, dados?.altura);
    // Convenção didática: classificar o mesmo IMC exibido (duas casas decimais).
    const imcExibido = Number(imc.toFixed(2));
    return { status: 200, corpo: { imc: imcExibido, situacao: classificarIMC(imcExibido) } };
  } catch (erro) {
    if (erro instanceof RangeError) {
      return { status: 400, corpo: { erro: erro.message } };
    }
    throw erro;
  }
}