import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

// Convert `import.meta.url` to __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('should Trigger Error maximum File Upload', async ({ page }) => {
  await page.goto('http://localhost:3000');

  await page.click('[data-testid="upload-section"]');

  // define file path to spesifict large image files
  const filePath = path.resolve(__dirname, './assets/3_mega.jpg');

  // plant image
  await page.setInputFiles('[data-testid="input-image"]', filePath);

  const errorElement = await page.waitForSelector('[data-errorid="file-too-large"]', { timeout: 5000 });
  expect(errorElement).toBeDefined();
});

test('expect File Successfully Uploaded', async ({ page }) => {
  await page.goto('http://localhost:3000');

  await page.click('[data-testid="upload-section"]');

  const filePath = path.resolve(__dirname, './assets/porche.jpg');

  await page.setInputFiles('[data-testid="input-image"]', filePath);

  const successElement = await page.waitForSelector('[data-testid="download-image"]', { timeout: 5000 });
  expect(successElement).toBeDefined();
});
