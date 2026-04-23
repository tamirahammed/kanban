import { create } from "zustand";
import { seedKanbanData, type Id, type KanbanData } from "@/lib/kanban";

export type KanbanState = KanbanData & {
  renameColumn: (columnId: Id, title: string) => void;
  addCard: (columnId: Id, title: string, details: string) => void;
  deleteCard: (cardId: Id) => void;
  moveCard: (args: {
    cardId: Id;
    fromColumnId: Id;
    toColumnId: Id;
    toIndex: number;
  }) => void;
  reorderCardWithinColumn: (args: { columnId: Id; fromIndex: number; toIndex: number }) => void;
  reset: () => void;
};

function newId(prefix: string) {
  return `${prefix}-${globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`}`;
}

export const useKanbanStore = create<KanbanState>((set) => ({
  ...seedKanbanData,

  renameColumn: (columnId, title) => {
    const next = title.trim();
    if (!next) return;
    set((s) => ({
      columns: { ...s.columns, [columnId]: { ...s.columns[columnId], title: next } },
    }));
  },

  addCard: (columnId, title, details) => {
    const nextTitle = title.trim();
    const nextDetails = details.trim();
    if (!nextTitle) return;
    const cardId = newId("card");
    set((s) => ({
      cards: { ...s.cards, [cardId]: { id: cardId, title: nextTitle, details: nextDetails } },
      columns: {
        ...s.columns,
        [columnId]: { ...s.columns[columnId], cardIds: [...s.columns[columnId].cardIds, cardId] },
      },
    }));
  },

  deleteCard: (cardId) => {
    set((s) => {
      const nextCards = { ...s.cards };
      delete nextCards[cardId];
      const nextColumns = Object.fromEntries(
        Object.entries(s.columns).map(([colId, col]) => [
          colId,
          { ...col, cardIds: col.cardIds.filter((id) => id !== cardId) },
        ]),
      );
      return { cards: nextCards, columns: nextColumns };
    });
  },

  moveCard: ({ cardId, fromColumnId, toColumnId, toIndex }) => {
    set((s) => {
      const from = s.columns[fromColumnId];
      const to = s.columns[toColumnId];
      const fromIds = from.cardIds.filter((id) => id !== cardId);
      const toIds = to.cardIds.slice();
      const clampedIndex = Math.max(0, Math.min(toIndex, toIds.length));
      toIds.splice(clampedIndex, 0, cardId);
      return {
        columns: {
          ...s.columns,
          [fromColumnId]: { ...from, cardIds: fromIds },
          [toColumnId]: { ...to, cardIds: toIds },
        },
      };
    });
  },

  reorderCardWithinColumn: ({ columnId, fromIndex, toIndex }) => {
    set((s) => {
      const col = s.columns[columnId];
      const next = col.cardIds.slice();
      if (fromIndex < 0 || fromIndex >= next.length) return {};
      if (toIndex < 0 || toIndex >= next.length) return {};
      const [moved] = next.splice(fromIndex, 1);
      if (!moved) return {};
      next.splice(toIndex, 0, moved);
      return { columns: { ...s.columns, [columnId]: { ...col, cardIds: next } } };
    });
  },

  reset: () => set(() => ({ ...seedKanbanData })),
}));

