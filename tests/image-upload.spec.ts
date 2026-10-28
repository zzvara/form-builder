import { readFile } from 'node:fs/promises';
import { expect, test } from '@playwright/test';
import { addQuestion, startQuestionnaire } from './helpers/form-builder';

test('uploads an image, downloads identical bytes, and removes it from the preview', async ({
  page,
}, testInfo) => {
  await startQuestionnaire(page, 'Image attachment');
  const holder = await addQuestion(page, 'Image Upload', 'Attach an image');
  // A tiny PNG keeps this test self-contained and independent of external assets.
  const png = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aF1cAAAAASUVORK5CYII=',
    'base64',
  );
  const chooserPromise = page.waitForEvent('filechooser');
  const uploadButton = holder
    .locator('button')
    .filter({ hasText: 'Click here to upload an image' });
  await uploadButton.click();
  await (await chooserPromise).setFiles({ name: 'sample.png', mimeType: 'image/png', buffer: png });
  const uploaded = holder.locator('.ant-upload-list-item');
  await expect(uploaded).toHaveClass(/ant-upload-list-item-done/);
  await expect(uploaded).toContainText('sample.png');
  const downloadPromise = page.waitForEvent('download');
  await uploaded.getByTitle('Download file', { exact: true }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('sample.png');
  const file = testInfo.outputPath('sample.png');
  await download.saveAs(file);
  expect(await readFile(file)).toEqual(png);
  await uploaded.getByTitle('Remove file', { exact: true }).click();
  await expect(uploaded).toHaveCount(0);
  await expect(uploadButton).toBeEnabled();
});
