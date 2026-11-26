import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { criarServidor } from '../../src/server.js';

// Cada teste de integração sobe uma API HTTP real numa porta livre.
async function comServidor(executar) {
  const servidor = criarServidor();
  servidor.listen(0, '127.0.0.1');
  await once(servidor, 'listening');
  const { port } = servidor.address();
  try {
    await executar(`http://127.0.0.1:${port}`);
  } finally {
    await new Promise((resolve, reject) => {
      servidor.close(erro => erro ? reject(erro) : resolve());
    });
  }
}

test('API integra HTTP, cálculo e classificação', async () => {
  await comServidor(async base => {
    const resposta = await fetch(`${base}/api/imc`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ peso: 80, altura: 2 })
    });
    assert.equal(resposta.status, 200);
    assert.deepEqual(await resposta.json(), {
      imc: 20,
      situacao: 'Peso adequado'
    });
  });
});

test('API retorna HTTP 400 para altura zero', async () => {
  await comServidor(async base => {
    const resposta = await fetch(`${base}/api/imc`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ peso: 80, altura: 0 })
    });
    assert.equal(resposta.status, 400);
    assert.match((await resposta.json()).erro, /positivos/);
  });
});

test('API rejeita método GET na rota de cálculo', async () => {
  await comServidor(async base => {
    const resposta = await fetch(`${base}/api/imc`);
    assert.equal(resposta.status, 405);
  });
});