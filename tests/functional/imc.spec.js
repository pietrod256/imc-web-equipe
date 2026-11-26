import { test, expect } from '@playwright/test';

test('teste funcional: preenche formulário e apresenta resposta simulada', async ({ page }) => {
  // Intercepta a API: verifica apenas o comportamento visível do formulário.
  await page.route('**/api/imc', async rota => {
    await rota.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ imc: 20, situacao: 'Peso adequado' })
    });
  });

  await page.goto('/');
  await page.getByLabel('Peso (kg)').fill('80');
  await page.getByLabel('Altura (m)').fill('2');
  await page.getByRole('button', { name: 'Calcular IMC' }).click();
  await expect(page.getByRole('status')).toHaveText('IMC: 20.00 — Peso adequado');
});