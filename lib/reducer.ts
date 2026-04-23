import type { BoardT, CardT } from "./types";

export type Action =
  | { type: "renameColumn"; columnId: string; title: string }
  | { type: "addCard"; columnId: string; title: string; details: string }
  | { type: "deleteCard"; cardId: string }
  | {
      type: "moveCard";
      cardId: string;
      toColumnId: string;
      toIndex: number;
    };

function findCard(
  board: BoardT,
  cardId: string
): { columnIndex: number; cardIndex: number; card: CardT } | null {
  for (let i = 0; i < board.columns.length; i++) {
    const idx = board.columns[i].cards.findIndex((c) => c.id === cardId);
    if (idx !== -1) {
      return { columnIndex: i, cardIndex: idx, card: board.columns[i].cards[idx] };
    }
  }
  return null;
}

export function reducer(board: BoardT, action: Action): BoardT {
  switch (action.type) {
    case "renameColumn": {
      return {
        columns: board.columns.map((c) =>
          c.id === action.columnId ? { ...c, title: action.title } : c
        ),
      };
    }
    case "addCard": {
      const card: CardT = {
        id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        title: action.title,
        details: action.details,
      };
      return {
        columns: board.columns.map((c) =>
          c.id === action.columnId ? { ...c, cards: [...c.cards, card] } : c
        ),
      };
    }
    case "deleteCard": {
      return {
        columns: board.columns.map((c) => ({
          ...c,
          cards: c.cards.filter((card) => card.id !== action.cardId),
        })),
      };
    }
    case "moveCard": {
      const found = findCard(board, action.cardId);
      if (!found) return board;
      const { columnIndex: fromCol, cardIndex: fromIdx, card } = found;
      const toColIdx = board.columns.findIndex((c) => c.id === action.toColumnId);
      if (toColIdx === -1) return board;

      const columns = board.columns.map((c) => ({ ...c, cards: [...c.cards] }));
      columns[fromCol].cards.splice(fromIdx, 1);

      // Clamp destination index
      const dest = columns[toColIdx].cards;
      const clamped = Math.max(0, Math.min(action.toIndex, dest.length));
      dest.splice(clamped, 0, card);

      return { columns };
    }
  }
}
