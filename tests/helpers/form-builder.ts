import { expect, type Locator, type Page } from '@playwright/test';

export async function startQuestionnaire(page: Page, title: string, description = '') {
  await page.goto('/');
  // The first button is in the toolbar; the empty-state panel also offers creation.
  await page
    .locator('app-dashboard .view')
    .getByRole('button', {
      name: /New Questionnaire$/,
    })
    .first()
    .click();
  await page.locator('#title').fill(title);
  if (description) {
    await page.locator('app-info-page .ql-editor').fill(description);
  }
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.locator('#sectionDropList')).toBeVisible();
}

export async function addTextQuestion(page: Page, question: string) {
  return addQuestion(page, 'Single-line Text Field', question);
}

export async function dragFromPalette(
  page: Page,
  component: string,
  target = page.locator('#sectionDropList'),
) {
  const source = page.locator('app-sidebar .cdk-drag').filter({
    has: page.getByText(component, { exact: true }),
  });
  await target.scrollIntoViewIfNeeded();
  await source.scrollIntoViewIfNeeded();
  await expect(target).toBeVisible();
  const sourceBox = await source.boundingBox();
  const targetBox = await target.boundingBox();
  if (!sourceBox || !targetBox) {
    throw new Error('The component palette and editor must be visible before dragging.');
  }

  // CDK needs a pointer movement past its drag threshold before entering the target.
  await page.mouse.move(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(
    sourceBox.x + sourceBox.width / 2 + 10,
    sourceBox.y + sourceBox.height / 2 + 10,
  );
  const viewport = page.viewportSize();
  const visibleTop = Math.max(0, targetBox.y);
  const visibleBottom = Math.min(viewport?.height ?? Infinity, targetBox.y + targetBox.height);
  await page.mouse.move(
    targetBox.x + targetBox.width / 2,
    visibleTop + (visibleBottom - visibleTop) / 2,
    {
      steps: 20,
    },
  );
  if ((await target.getAttribute('id')) !== 'sectionDropList') {
    // Entering the outer list can move a nested section as its placeholder appears.
    // Hover waits for the actual target to settle before dropping inside it.
    await target.hover();
  }
  await page.mouse.up();
}

export async function addQuestion(
  page: Page,
  component: string,
  question: string,
  target?: Locator,
) {
  const questions = page.locator('#sectionDropList app-input-holder');
  const count = await questions.count();
  await dragFromPalette(page, component, target);
  await expect(questions).toHaveCount(count + 1);

  const added = questions.filter({
    has: page.locator('input[name="inputQuestion"]:placeholder-shown'),
  });
  await expect(added).toHaveCount(1);
  const id = await added.getAttribute('id');
  expect(id).toBeTruthy();
  await added.locator('input[name="inputQuestion"]').fill(question);
  return page.locator(`#sectionDropList app-input-holder[id="${id}"]`);
}

export async function reopenQuestionnaire(page: Page, title: string) {
  await page.reload();
  await questionnaireRow(page, title).locator('.edit-icon').click();
  await expect(page.locator('#title')).toHaveValue(title);
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.locator('#sectionDropList')).toBeVisible();
}

export async function openResults(page: Page) {
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.getByRole('tab', { name: 'Project Info', exact: true })).toBeVisible();
}

export async function saveProject(page: Page) {
  await openResults(page);
  await page.getByRole('button', { name: 'Save Project', exact: true }).click();
  await expect(page).toHaveURL('/');
}

export function questionnaireRow(page: Page, title: string) {
  return page
    .locator('app-list-view')
    .first()
    .getByRole('row')
    .filter({
      has: page.getByRole('cell', { name: title, exact: true }),
    });
}
