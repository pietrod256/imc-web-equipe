import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { processarIMC } from './handle-imc.js';

const aqui = dirname(fileURLToPath(import.meta.url));
const publicDir = join(aqui, '..', 'public');
const arquivos = new Map([
  ['/', ['index.html', 'text/html; charset=utf-8']],
  ['/index.html', ['index.html', 'text/html; charset=utf-8']],
  ['/style.css', ['style.css', 'text/css; charset=utf-8']],
  ['/app.js', ['app.js', 'text/javascript; charset=utf-8']]
]);

function json(res, codigo, dados) {
  res.writeHead(codigo, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(dados));
}

export function criarServidor() {
  return createServer(async (req, res) => {
    const caminho = new URL(req.url, 'http://localhost').pathname;

    if (caminho === '/api/imc') {
      if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return json(res, 405, { erro: 'Método não permitido' });
      }
      try {
        let texto = '';
        for await (const parte of req) {
          texto += parte.toString();
          if (texto.length > 10000) return json(res, 413, { erro: 'Corpo muito grande' });
        }
        const dados = JSON.parse(texto);
        const resultado = processarIMC(dados);
        return json(res, resultado.status, resultado.corpo);
      } catch (erro) {
        if (erro instanceof SyntaxError) {
          return json(res, 400, { erro: 'JSON inválido' });
        }
        return json(res, 500, { erro: 'Erro interno' });
      }
    }

    if (req.method !== 'GET') return json(res, 405, { erro: 'Método não permitido' });
    const arquivo = arquivos.get(caminho);
    if (!arquivo) return json(res, 404, { erro: 'Página não encontrada' });
    try {
      const conteudo = await readFile(join(publicDir, arquivo[0]));
      res.writeHead(200, { 'Content-Type': arquivo[1] });
      res.end(conteudo);
    } catch {
      json(res, 500, { erro: 'Não foi possível ler arquivo' });
    }
  });
}

// Só inicia porta ao executar este arquivo diretamente, não ao importá-lo em testes.
if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const porta = Number(process.env.PORT ?? 3000);
  criarServidor().listen(porta, '0.0.0.0', () => {
    console.log(`IMC Web em http://localhost:${porta}`);
  });
}