import { describe, it, expect } from "vitest";
import { reducer } from "@/lib/reducer";
import type { BoardT } from "@/lib/types";

const baseBoard = (): BoardT => ({
  columns: [
    {
      id: "a",
      title: "A",
      cards: [
        { id: "1", title: "one", details: "" },
        { id: "2", title: "two", details: "" },
      ],
    },
    {
      id: "b",
      title: "B",
      cards: [{ id: "3", title: "three", details: "" }],
    },
  ],
});

describe("reducer", () => {
  it("renames a column", () => {
    const next = reducer(baseBoard(), {
      type: "renameColumn",
      columnId: "a",
      title: "Alpha",
    });
    expect(next.columns[0].title).toBe("Alpha");
    expect(next.columns[1].title).toBe("B");
  });

  it("adds a card to a column", () => {
    const next = reducer(baseBoard(), {
      type: "addCard",
      columnId: "b",
      title: "New",
      details: "details",
    });
    expect(next.columns[1].cards).toHaveLength(2);
    expect(next.columns[1].cards[1].title).toBe("New");
    expect(next.columns[1].cards[1].details).toBe("details");
    expect(next.columns[1].cards[1].id).toBeTruthy();
  });

  it("deletes a card wherever it lives", () => {
    const next = reducer(baseBoard(), { type: "deleteCard", cardId: "2" });
    expect(next.columns[0].cards.map((c) => c.id)).toEqual(["1"]);
    expect(next.columns[1].cards).toHaveLength(1);
  });

  it("moves a card to another column at a given index", () => {
    const next = reducer(baseBoard(), {
      type: "moveCard",
      cardId: "1",
      toColumnId: "b",
      toIndex: 0,
    });
    expect(next.columns[0].cards.map((c) => c.id)).toEqual(["2"]);
    expect(next.columns[1].cards.map((c) => c.id)).toEqual(["1", "3"]);
  });

  it("reorders within the same column", () => {
    const next = reducer(baseBoard(), {
      type: "moveCard",
      cardId: "1",
      toColumnId: "a",
      toIndex: 1,
    });
    expect(next.columns[0].cards.map((c) => c.id)).toEqual(["2", "1"]);
  });

  it("clamps out-of-range destination index", () => {
    const next = reducer(baseBoard(), {
      type: "moveCard",
      cardId: "3",
      toColumnId: "a",
      toIndex: 999,
    });
    expect(next.columns[0].cards.map((c) => c.id)).toEqual(["1", "2", "3"]);
  });

  it("is a no-op for unknown card", () => {
    const b = baseBoard();
    const next = reducer(b, {
      type: "moveCard",
      cardId: "nope",
      toColumnId: "a",
      toIndex: 0,
    });
    expect(next).toBe(b);
  });

  it("does not mutate the input board", () => {
    const b = baseBoard();
    const snapshot = JSON.stringify(b);
    reducer(b, { type: "addCard", columnId: "a", title: "x", details: "" });
    reducer(b, { type: "deleteCard", cardId: "1" });
    reducer(b, { type: "moveCard", cardId: "1", toColumnId: "b", toIndex: 0 });
    expect(JSON.stringify(b)).toBe(snapshot);
  });
});
