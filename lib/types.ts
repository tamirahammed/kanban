export type CardT = {
  id: string;
  title: string;
  details: string;
};

export type ColumnT = {
  id: string;
  title: string;
  cards: CardT[];
};

export type BoardT = {
  columns: ColumnT[];
};
