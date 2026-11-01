import { expect, type Locator, type Page } from '@playwright/test';

export async function startProject(
  page: Page,
  type: 'Questionnaire' | 'Test',
  title: string,
  description = '',
) {
  await page.goto('/');
  // The first button is in the toolbar; the empty-state panel also offers creation.
  await page
    .locator('app-dashboard .view')
    .getByRole('button', {
      name: new RegExp(`New ${type}$`),
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

export async function startQuestionnaire(page: Page, title: string, description = '') {
  await startProject(page, 'Questionnaire', title, description);
}

export async function addTextQuestion(page: Page, question: string) {
  return addQuestion(page, 'Single-line Text Field', question);
}

interface Point {
  x: number;
  y: number;
}

/** Waits until an element stops moving, for example while a smooth scroll is still running. */
async function settle(element: Locator) {
  let previous = '';
  await expect
    .poll(
      async () => {
        const box = JSON.stringify(await element.boundingBox());
        const settled = box === previous;
        previous = box;
        return settled;
      },
      { intervals: [100] },
    )
    .toBe(true);
}

async function dragPointer(
  page: Page,
  grab: () => Promise<Point>,
  drop: () => Promise<Point>,
  followTarget = false,
) {
  const start = await grab();
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  // CDK needs a pointer movement past its drag threshold before entering the target.
  await page.mouse.move(start.x + 10, start.y + 10, { steps: 3 });
  let end = await drop();
  await page.mouse.move(end.x, end.y, { steps: 20 });
  // A nested list can only be entered after the outer list opened a placeholder, which shifts the
  // layout, so the pointer has to follow the container. Never follow a sibling: moving over it
  // would swap the placeholder past it.
  for (let attempt = 0; followTarget && attempt < 3; attempt++) {
    end = await drop();
    await page.mouse.move(end.x, end.y, { steps: 4 });
  }
  await page.mouse.up();
  // CDK animates the preview into place and only then commits the drop.
  await expect(page.locator('.cdk-drag-preview')).toHaveCount(0);
}

async function visibleCenter(
  page: Page,
  element: Locator,
  edge?: 'top' | 'bottom',
): Promise<Point> {
  const box = await element.boundingBox();
  if (!box) {
    throw new Error('The drag source and target must stay visible while dragging.');
  }
  const top = Math.max(0, box.y);
  const bottom = Math.min(page.viewportSize()?.height ?? Infinity, box.y + box.height);
  const y =
    edge === 'top'
      ? top + Math.min(12, (bottom - top) / 2)
      : edge === 'bottom'
        ? bottom - Math.min(4, (bottom - top) / 2)
        : top + (bottom - top) / 2;
  return { x: box.x + box.width / 2, y };
}

/**
 * Drags a palette component into the form. By default it drops into the whole form; pass a
 * section body to drop into that section, or `{ before }` to insert in front of an existing
 * question, which makes the resulting order deterministic. Do not use a section as the
 * `before` anchor: a question dropped near its top is captured by the section instead.
 */
export async function dragFromPalette(
  page: Page,
  component: string,
  drop: Locator | { before: Locator } = page.locator('#sectionDropList'),
) {
  const before = 'before' in drop ? drop.before : undefined;
  const target = before ?? (drop as Locator);
  const source = page.locator('app-sidebar .cdk-drag').filter({
    has: page.getByText(component, { exact: true }),
  });
  await target.scrollIntoViewIfNeeded();
  await source.scrollIntoViewIfNeeded();
  await expect(target).toBeVisible();
  const intoNestedList = !before && (await target.getAttribute('id')) !== 'sectionDropList';

  await dragPointer(
    page,
    () => visibleCenter(page, source),
    () => visibleCenter(page, target, before ? 'top' : undefined),
    intoNestedList,
  );
}

export async function addQuestion(
  page: Page,
  component: string,
  question: string,
  drop?: Locator | { before: Locator },
) {
  const questions = page.locator('#sectionDropList app-input-holder');
  const idsOf = () => questions.evaluateAll((holders) => holders.map((holder) => holder.id));
  const known = await idsOf();
  await dragFromPalette(page, component, drop);

  let id = '';
  await expect
    .poll(async () => {
      const added = (await idsOf()).filter((candidate) => !known.includes(candidate));
      id = added[0] ?? '';
      return added.length;
    })
    .toBe(1);
  expect(id).toBeTruthy();
  const added = page.locator(`#sectionDropList app-input-holder[id="${id}"]`);
  await added.locator('input[name="inputQuestion"]').fill(question);
  return added;
}

export async function addSection(
  page: Page,
  type: 'Section' | 'Repeated Section',
  drop?: Locator | { before: Locator },
) {
  const search = page.getByRole('textbox', { name: 'Search components' });
  const sections = page.locator('#sectionDropList .section-card');
  const knownIds = await sections.evaluateAll((cards) => cards.map((card) => card.id));
  await search.fill('section');
  await dragFromPalette(page, type, drop);
  await search.clear();
  await expect(sections).toHaveCount(knownIds.length + 1);
  const ids = await sections.evaluateAll((cards) => cards.map((card) => card.id));
  const id = ids.find((candidate) => !knownIds.includes(candidate));
  expect(id).toBeTruthy();
  return page.locator(`#sectionDropList .section-card[id="${id}"]`);
}

/** The area of a section that receives dropped questions. */
export function sectionBody(section: Locator) {
  return section.locator(':scope > .ant-card-body');
}

/** Gives a question or section a variable name through its inline name editor. */
export async function renameComponent(component: Locator, name: string) {
  const title = component.locator('app-edit-name').first();
  await title.getByRole('img', { name: 'edit', exact: true }).click();
  await title.getByRole('textbox').fill(name);
  await title.getByRole('img', { name: 'save', exact: true }).click();
  await expect(title).toHaveText(name);
}

/** Opens a question's settings dialog; later dialogs stack on top, so this stays the first. */
export async function openSettings(page: Page, question: Locator) {
  await question.getByRole('button', { name: 'edit', exact: true }).click();
  const dialog = page.getByRole('dialog').first();
  await expect(dialog).toBeVisible();
  return dialog;
}

/** The currently visible ng-zorro tooltip, which carries no ARIA role to query by. */
export function tooltip(page: Page) {
  return page.locator('.ant-tooltip:not(.ant-tooltip-hidden)');
}

/** Moves a question into another section by dragging its header, as a user would. */
export async function moveQuestionToSection(page: Page, question: Locator, section: Locator) {
  const header = question.locator('.ant-card-head').first();
  const body = sectionBody(section);
  await question.scrollIntoViewIfNeeded();
  await settle(question);
  await dragPointer(
    page,
    async () => {
      const box = await header.boundingBox();
      if (!box) throw new Error('The question header must be visible before dragging.');
      return { x: box.x + 6, y: box.y + box.height / 2 };
    },
    async () => {
      await body.scrollIntoViewIfNeeded();
      return visibleCenter(page, body);
    },
    true,
  );
}

/** The "Used Components" panel next to the editor. */
export function usedComponents(page: Page) {
  return page.locator('#structureList');
}

export function usedComponent(page: Page, name: string) {
  return usedComponents(page).locator('> *').filter({ hasText: name });
}

/** Reorders the form by dragging one entry of the "Used Components" panel next to another. */
export async function moveUsedComponent(
  page: Page,
  name: string,
  reference: string,
  placement: 'before' | 'after',
) {
  const handle = usedComponent(page, name).locator('.component-drag-handle').first();
  const target = usedComponent(page, reference);
  await handle.scrollIntoViewIfNeeded();
  await settle(handle);
  await settle(target);
  await dragPointer(
    page,
    () => visibleCenter(page, handle),
    () => visibleCenter(page, target, placement === 'before' ? 'top' : 'bottom'),
  );
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

export function testRow(page: Page, title: string) {
  return page
    .locator('app-list-view')
    .nth(1)
    .getByRole('row')
    .filter({
      has: page.getByRole('cell', { name: title, exact: true }),
    });
}

export async function importProject(page: Page, file: Parameters<Locator['setInputFiles']>[0]) {
  await page.locator('app-header input[type="file"]').setInputFiles(file);
}
