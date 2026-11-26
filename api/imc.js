import { processarIMC } from '../src/handle-imc.js';

// Vercel Function: mesma lógica do servidor local.
export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ erro: 'Método não permitido' });
  }
  const resultado = processarIMC(req.body);
  return res.status(resultado.status).json(resultado.corpo);
}