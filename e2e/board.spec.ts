import { test, expect } from "@playwright/test";

test.describe("Kanban board", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("loads with five columns and dummy cards", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Kanban" })).toBeVisible();
    const columns = page.getByTestId("column");
    await expect(columns).toHaveCount(5);
    const totalCards = await page.getByTestId("card").count();
    expect(totalCards).toBeGreaterThan(0);
  });

  test("renames a column inline", async ({ page }) => {
    const firstColumn = page.getByTestId("column").first();
    await firstColumn.getByTestId("column-title").click();
    const input = firstColumn.getByTestId("column-title-input");
    await input.fill("Ideas");
    await input.press("Enter");
    await expect(firstColumn.getByTestId("column-title")).toHaveText("Ideas");
  });

  test("adds a new card to a column", async ({ page }) => {
    const column = page.getByTestId("column").nth(1);
    const before = await column.getByTestId("card").count();

    await column.getByTestId("add-card-button").click();
    await column.getByTestId("new-card-title").fill("Ship the MVP");
    await column.getByTestId("new-card-details").fill("End-to-end tested");
    await column.getByTestId("new-card-submit").click();

    await expect(column.getByTestId("card")).toHaveCount(before + 1);
    await expect(column.getByText("Ship the MVP")).toBeVisible();
    await expect(column.getByText("End-to-end tested")).toBeVisible();
  });

  test("deletes a card", async ({ page }) => {
    const column = page.getByTestId("column").first();
    const firstCard = column.getByTestId("card").first();
    const title = await firstCard.locator("h3").innerText();

    await firstCard.hover();
    await firstCard.getByRole("button", { name: /delete card/i }).click();

    await expect(column.getByText(title, { exact: true })).toHaveCount(0);
  });

  test("drags a card from one column to another", async ({ page }) => {
    const source = page.getByTestId("column").first();
    const target = page.getByTestId("column").nth(2);

    const card = source.getByTestId("card").first();
    const title = await card.locator("h3").innerText();
    const sourceBefore = await source.getByTestId("card").count();
    const targetBefore = await target.getByTestId("card").count();

    const cardBox = await card.boundingBox();
    const targetBox = await target.boundingBox();
    if (!cardBox || !targetBox) throw new Error("missing bounding boxes");

    // Manual pointer drag satisfies @dnd-kit's PointerSensor activation distance
    await page.mouse.move(
      cardBox.x + cardBox.width / 2,
      cardBox.y + cardBox.height / 2
    );
    await page.mouse.down();
    await page.mouse.move(
      cardBox.x + cardBox.width / 2 + 20,
      cardBox.y + cardBox.height / 2 + 20,
      { steps: 5 }
    );
    await page.mouse.move(
      targetBox.x + targetBox.width / 2,
      targetBox.y + targetBox.height / 2 + 80,
      { steps: 15 }
    );
    await page.mouse.up();

    await expect(source.getByTestId("card")).toHaveCount(sourceBefore - 1);
    await expect(target.getByTestId("card")).toHaveCount(targetBefore + 1);
    await expect(target.getByText(title, { exact: true })).toBeVisible();
  });
});
