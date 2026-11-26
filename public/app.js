const formulario = document.querySelector('#form-imc');
const resultado = document.querySelector('#resultado');

formulario.addEventListener('submit', async (evento) => {
  evento.preventDefault(); // Não recarrega a página.
  resultado.classList.remove('erro');
  resultado.textContent = 'Calculando...';

  const peso = Number(document.querySelector('#peso').value);
  const altura = Number(document.querySelector('#altura').value);

  try {
    const resposta = await fetch('/api/imc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ peso, altura })
    });

    const dados = await resposta.json();
    if (!resposta.ok) throw new Error(dados.erro ?? 'Falha na API');

    resultado.textContent = `IMC: ${dados.imc.toFixed(2)} — ${dados.situacao}`;
  } catch (erro) {
    resultado.classList.add('erro');
    resultado.textContent = `Erro: ${erro.message}`;
  }
});