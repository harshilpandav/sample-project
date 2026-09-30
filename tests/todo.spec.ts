import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test.describe('Daymark task list: passing product checks', () => {
  test('shows the page title and task section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Make room for what matters.' })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Today/ })).toBeVisible();
  });

  test('renders the three seeded tasks', async ({ page }) => {
    await expect(page.getByRole('listitem')).toHaveCount(3);
  });

  test('shows the seeded task names', async ({ page }) => {
    await expect(page.getByText('Send the first draft to Mara')).toBeVisible();
    await expect(page.getByText('Pick up a few things for dinner')).toBeVisible();
    await expect(page.getByText('Take a proper lunch break')).toBeVisible();
  });

  test('reports open and completed totals', async ({ page }) => {
    await expect(page.locator('#open-count')).toHaveText('2');
    await expect(page.locator('#done-count')).toHaveText('1');
  });

  test('adds a task and trims surrounding whitespace', async ({ page }) => {
    await page.getByLabel('Add a task').fill('  Water the plants  ');
    await page.getByRole('button', { name: 'Add task' }).click();
    await expect(page.getByText('Water the plants', { exact: true })).toBeVisible();
    await expect(page.locator('#task-count')).toHaveText('4');
  });

  test('submits a task with the Enter key', async ({ page }) => {
    await page.getByLabel('Add a task').fill('Review notes');
    await page.getByLabel('Add a task').press('Enter');
    await expect(page.getByText('Review notes', { exact: true })).toBeVisible();
  });

  test('marks an open task as done', async ({ page }) => {
    await page.getByRole('button', { name: 'Mark as done: Send the first draft to Mara' }).click();
    await expect(page.getByRole('button', { name: 'Mark as open: Send the first draft to Mara' })).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#open-count')).toHaveText('1');
  });

  test('reopens a completed task', async ({ page }) => {
    await page.getByRole('button', { name: 'Mark as open: Take a proper lunch break' }).click();
    await expect(page.locator('#open-count')).toHaveText('3');
    await expect(page.locator('#done-count')).toHaveText('0');
  });

  test('filters the list to open tasks', async ({ page }) => {
    await page.getByRole('button', { name: 'Open', exact: true }).click();
    await expect(page.getByRole('listitem')).toHaveCount(2);
    await expect(page.getByText('Take a proper lunch break')).toHaveCount(0);
  });

  test('filters the list to completed tasks', async ({ page }) => {
    await page.getByRole('button', { name: 'Done', exact: true }).click();
    await expect(page.getByRole('listitem')).toHaveCount(1);
    await expect(page.getByText('Take a proper lunch break')).toBeVisible();
  });
});

test.describe('Daymark task list: intentional failing examples', () => {
  test('DEMO FAIL: seeded list has four tasks', async ({ page }) => {
    await expect(page.getByRole('listitem')).toHaveCount(4);
  });

  test('DEMO FAIL: open count is three', async ({ page }) => {
    await expect(page.locator('#open-count')).toHaveText('3');
  });

  test('DEMO FAIL: all filter shows only two tasks', async ({ page }) => {
    await page.getByRole('button', { name: 'All', exact: true }).click();
    await expect(page.getByRole('listitem')).toHaveCount(2);
  });

  test('DEMO FAIL: an open task starts pressed', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Mark as done: Send the first draft to Mara' })).toHaveAttribute('aria-pressed', 'true');
  });

  test('DEMO FAIL: deleting a task leaves all three tasks', async ({ page }) => {
    await page.getByRole('button', { name: 'Delete: Send the first draft to Mara' }).click();
    await expect(page.getByRole('listitem')).toHaveCount(3);
  });

  test('DEMO FAIL: adding one task increases count to five', async ({ page }) => {
    await page.getByLabel('Add a task').fill('Book a table');
    await page.getByRole('button', { name: 'Add task' }).click();
    await expect(page.locator('#task-count')).toHaveText('5');
  });

  test('DEMO FAIL: empty state is shown while tasks exist', async ({ page }) => {
    await expect(page.getByText('Nothing here yet. Add one small thing to begin.')).toBeVisible();
  });
});

test.describe('Daymark task list: intentional flaky examples', () => {
  test('DEMO FLAKY: add task retry behavior', async ({ page }, testInfo) => {
    await page.getByLabel('Add a task').fill('Prepare agenda');
    await page.getByRole('button', { name: 'Add task' }).click();
    await expect(page.getByText('Prepare agenda')).toBeVisible();
    expect(testInfo.retry).toBe(1);
  });

  test('DEMO FLAKY: done filter retry behavior', async ({ page }, testInfo) => {
    await page.getByRole('button', { name: 'Done', exact: true }).click();
    await expect(page.getByRole('listitem')).toHaveCount(1);
    expect(testInfo.retry).toBe(1);
  });

  test('DEMO FLAKY: delete task retry behavior', async ({ page }, testInfo) => {
    await page.getByRole('button', { name: 'Delete: Send the first draft to Mara' }).click();
    await expect(page.getByRole('listitem')).toHaveCount(2);
    expect(testInfo.retry).toBe(1);
  });

  test('DEMO FLAKY: reopen task retry behavior', async ({ page }, testInfo) => {
    await page.getByRole('button', { name: 'Mark as open: Take a proper lunch break' }).click();
    await expect(page.locator('#open-count')).toHaveText('3');
    expect(testInfo.retry).toBe(1);
  });

  test('DEMO FLAKY: submit with Enter retry behavior', async ({ page }, testInfo) => {
    await page.getByLabel('Add a task').fill('Call the studio');
    await page.getByLabel('Add a task').press('Enter');
    await expect(page.getByText('Call the studio')).toBeVisible();
    expect(testInfo.retry).toBe(1);
  });

  test('DEMO FLAKY: open filter retry behavior', async ({ page }, testInfo) => {
    await page.getByRole('button', { name: 'Open', exact: true }).click();
    await expect(page.getByRole('listitem')).toHaveCount(2);
    expect(testInfo.retry).toBe(1);
  });

  test('DEMO FLAKY: mark task done retry behavior', async ({ page }, testInfo) => {
    await page.getByRole('button', { name: 'Mark as done: Send the first draft to Mara' }).click();
    await expect(page.locator('#open-count')).toHaveText('1');
    expect(testInfo.retry).toBe(1);
  });
});
