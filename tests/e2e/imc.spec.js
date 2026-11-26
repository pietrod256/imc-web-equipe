import { test, expect } from '@playwright/test';

test('E2E: navegador e API reais calculam IMC e classificação', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Peso (kg)').fill('80');
  await page.getByLabel('Altura (m)').fill('2');

  const respostaAPI = page.waitForResponse(resposta =>
    resposta.url().endsWith('/api/imc') && resposta.request().method() === 'POST'
  );
  await page.getByRole('button', { name: 'Calcular IMC' }).click();

  const resposta = await respostaAPI;
  expect(resposta.status()).toBe(200);
  expect(await resposta.json()).toEqual({ imc: 20, situacao: 'Peso adequado' });
  await expect(page.getByRole('status')).toHaveText('IMC: 20.00 — Peso adequado');
});

test('E2E: classificação de obesidade com servidor real', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Peso (kg)').fill('120');
  await page.getByLabel('Altura (m)').fill('2');
  await page.getByRole('button', { name: 'Calcular IMC' }).click();
  await expect(page.getByRole('status')).toHaveText('IMC: 30.00 — Obesidade');
});