import { test, expect } from "@playwright/test";

test("loads seeded board with 5 columns", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Kanban", { exact: true })).toBeVisible();

  const columns = page.locator('[data-testid^="column-col-"]');
  await expect(columns).toHaveCount(5);

  await expect(page.getByTestId("column-col-1").getByText("Backlog", { exact: true })).toBeVisible();
  await expect(page.getByTestId("column-col-2").getByText("Ready", { exact: true })).toBeVisible();
  await expect(
    page.getByTestId("column-col-3").getByText("In Progress", { exact: true }),
  ).toBeVisible();
  await expect(page.getByTestId("column-col-4").getByText("Review", { exact: true })).toBeVisible();
  await expect(page.getByTestId("column-col-5").getByText("Done", { exact: true })).toBeVisible();
});

test("can add and delete a card", async ({ page }) => {
  await page.goto("/");

  const backlog = page.locator('[data-testid="column-col-1"]');
  await backlog.getByLabel("New card title").fill("Playwright card");
  await backlog.getByLabel("New card details").fill("hello");
  await backlog.getByRole("button", { name: "Add card" }).click();

  await expect(page.getByText("Playwright card")).toBeVisible();

  const card = page.locator('[data-testid^="card-"]').filter({ hasText: "Playwright card" }).first();
  await card.getByRole("button", { name: "Delete card" }).click();

  await expect(page.getByText("Playwright card")).toHaveCount(0);
});

test("can rename a column", async ({ page }) => {
  await page.goto("/");

  const backlog = page.locator('[data-testid="column-col-1"]');
  await backlog.getByRole("button", { name: /rename column/i }).click();
  const titleInput = backlog.getByLabel("Column title");
  await titleInput.fill("Ideas");
  await titleInput.blur();

  await expect(page.getByText("Ideas")).toBeVisible();
});

test("can drag a card from Backlog to Ready", async ({ page }) => {
  await page.goto("/");

  const sourceCard = page.locator('[data-testid="card-card-1"]');
  const targetDrop = page.locator('[data-testid="column-drop-col-2"]');

  const sourceBox = await sourceCard.boundingBox();
  const targetBox = await targetDrop.boundingBox();
  expect(sourceBox).toBeTruthy();
  expect(targetBox).toBeTruthy();
  if (!sourceBox || !targetBox) return;

  const startX = sourceBox.x + sourceBox.width / 2;
  const startY = sourceBox.y + sourceBox.height / 2;
  const endX = targetBox.x + targetBox.width / 2;
  const endY = targetBox.y + Math.min(80, targetBox.height / 2);

  await page.mouse.move(startX, startY);
  await page.mouse.down();
  // Move a bit to cross activation constraint (distance: 6).
  await page.mouse.move(startX + 20, startY + 10);
  await page.waitForTimeout(50);
  await page.mouse.move(endX, endY);
  await page.waitForTimeout(50);
  await page.mouse.up();

  await expect(page.getByTestId("column-col-2").getByText("Design the board layout")).toBeVisible();
});

