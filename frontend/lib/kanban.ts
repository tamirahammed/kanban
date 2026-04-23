export type Id = string;

export type Card = {
  id: Id;
  title: string;
  details: string;
};

export type Column = {
  id: Id;
  title: string;
  cardIds: Id[];
};

export type Board = {
  id: Id;
  columnIds: Id[];
};

export type KanbanData = {
  board: Board;
  columns: Record<Id, Column>;
  cards: Record<Id, Card>;
};

export const COLUMN_COUNT = 5;

export function arrayMove<T>(items: T[], fromIndex: number, toIndex: number): T[] {
  if (fromIndex === toIndex) return items;
  const copy = items.slice();
  const [item] = copy.splice(fromIndex, 1);
  if (item === undefined) return items;
  copy.splice(toIndex, 0, item);
  return copy;
}

export const seedKanbanData: KanbanData = {
  board: { id: "board-1", columnIds: ["col-1", "col-2", "col-3", "col-4", "col-5"] },
  columns: {
    "col-1": { id: "col-1", title: "Backlog", cardIds: ["card-1", "card-2"] },
    "col-2": { id: "col-2", title: "Ready", cardIds: ["card-3"] },
    "col-3": { id: "col-3", title: "In Progress", cardIds: ["card-4"] },
    "col-4": { id: "col-4", title: "Review", cardIds: [] },
    "col-5": { id: "col-5", title: "Done", cardIds: ["card-5"] },
  },
  cards: {
    "card-1": {
      id: "card-1",
      title: "Design the board layout",
      details: "Keep it clean: spacing, hierarchy, and a subtle accent line.",
    },
    "card-2": {
      id: "card-2",
      title: "Add dummy data",
      details: "App should open with a populated single board (no persistence).",
    },
    "card-3": {
      id: "card-3",
      title: "Implement card CRUD",
      details: "Add and delete cards inside a column with a simple flow.",
    },
    "card-4": {
      id: "card-4",
      title: "Drag & drop",
      details: "Move cards across columns and reorder within a column.",
    },
    "card-5": {
      id: "card-5",
      title: "Write tests",
      details: "Unit tests for state transitions + Playwright end-to-end flows.",
    },
  },
};

