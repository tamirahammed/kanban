import { describe, expect, it, vi, beforeEach } from "vitest";
import { useKanbanStore } from "@/lib/store";

describe("kanban store", () => {
  beforeEach(() => {
    useKanbanStore.getState().reset();
  });

  it("renames a column", () => {
    const before = useKanbanStore.getState().columns["col-1"].title;
    expect(before).toBe("Backlog");
    useKanbanStore.getState().renameColumn("col-1", "Ideas");
    expect(useKanbanStore.getState().columns["col-1"].title).toBe("Ideas");
  });

  it("adds a card to a column", () => {
    vi.stubGlobal("crypto", { randomUUID: () => "test-uuid" } as unknown as Crypto);

    const beforeCount = useKanbanStore.getState().columns["col-2"].cardIds.length;
    useKanbanStore.getState().addCard("col-2", "New", "Details");

    const col = useKanbanStore.getState().columns["col-2"];
    expect(col.cardIds.length).toBe(beforeCount + 1);
    const newId = col.cardIds[col.cardIds.length - 1];
    expect(useKanbanStore.getState().cards[newId]).toMatchObject({
      title: "New",
      details: "Details",
    });
  });

  it("deletes a card from all columns", () => {
    const existing = useKanbanStore.getState().columns["col-1"].cardIds[0];
    expect(existing).toBeTruthy();
    useKanbanStore.getState().deleteCard(existing);

    for (const col of Object.values(useKanbanStore.getState().columns)) {
      expect(col.cardIds.includes(existing)).toBe(false);
    }
    expect(useKanbanStore.getState().cards[existing]).toBeUndefined();
  });

  it("moves a card across columns at a given index", () => {
    const cardId = useKanbanStore.getState().columns["col-1"].cardIds[0];
    useKanbanStore.getState().moveCard({
      cardId,
      fromColumnId: "col-1",
      toColumnId: "col-4",
      toIndex: 0,
    });

    expect(useKanbanStore.getState().columns["col-1"].cardIds.includes(cardId)).toBe(false);
    expect(useKanbanStore.getState().columns["col-4"].cardIds[0]).toBe(cardId);
  });

  it("reorders cards within a column", () => {
    const before = useKanbanStore.getState().columns["col-1"].cardIds.slice();
    expect(before.length).toBeGreaterThan(1);

    useKanbanStore.getState().reorderCardWithinColumn({
      columnId: "col-1",
      fromIndex: 0,
      toIndex: 1,
    });
    const after = useKanbanStore.getState().columns["col-1"].cardIds.slice();
    expect(after[0]).toBe(before[1]);
    expect(after[1]).toBe(before[0]);
  });
});

