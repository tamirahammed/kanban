"use client";

import { useMemo, useReducer, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  KeyboardSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import Column from "./Column";
import Card from "./Card";
import { reducer } from "@/lib/reducer";
import { seedBoard } from "@/lib/seed";
import type { CardT } from "@/lib/types";

const COLUMN_ACCENTS = [
  "#888888", // Backlog - muted
  "#209dd7", // To Do - primary blue
  "#ecad0a", // In Progress - accent yellow
  "#753991", // Review - purple
  "#032147", // Done - navy
];

export default function Board() {
  const [board, dispatch] = useReducer(reducer, seedBoard);
  const [activeCard, setActiveCard] = useState<CardT | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const cardIndex = useMemo(() => {
    const map = new Map<string, { columnId: string; index: number; card: CardT }>();
    for (const col of board.columns) {
      col.cards.forEach((card, i) => {
        map.set(card.id, { columnId: col.id, index: i, card });
      });
    }
    return map;
  }, [board]);

  function handleDragStart(event: DragStartEvent) {
    const entry = cardIndex.get(String(event.active.id));
    if (entry) setActiveCard(entry.card);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveCard(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);
    if (activeId === overId) return;

    const from = cardIndex.get(activeId);
    if (!from) return;

    // Dropped directly on a column droppable
    if (overId.startsWith("col:")) {
      const toColumnId = overId.slice(4);
      const toColumn = board.columns.find((c) => c.id === toColumnId);
      if (!toColumn) return;
      dispatch({
        type: "moveCard",
        cardId: activeId,
        toColumnId,
        toIndex: toColumn.cards.length,
      });
      return;
    }

    // Dropped on another card
    const to = cardIndex.get(overId);
    if (!to) return;

    let toIndex = to.index;
    // When moving within the same column downward, dnd-kit's sortable expects
    // the insertion point after removal, which is already `to.index`.
    if (from.columnId === to.columnId && from.index < to.index) {
      toIndex = to.index;
    }

    dispatch({
      type: "moveCard",
      cardId: activeId,
      toColumnId: to.columnId,
      toIndex,
    });
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="px-8 py-6 border-b border-slate-200/80 bg-white/70 backdrop-blur-sm">
        <div className="flex items-baseline gap-3">
          <h1 className="text-[26px] font-bold tracking-tight text-[var(--color-navy)]">
            Kanban
          </h1>
          <span
            aria-hidden="true"
            className="inline-block h-1.5 w-8 rounded-full bg-[var(--color-accent)]"
          />
          <p className="text-[13px] text-[var(--color-muted)]">
            A quiet place to move things forward.
          </p>
        </div>
      </header>

      {/* Board */}
      <main className="flex-1 overflow-x-auto board-scroll">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={() => setActiveCard(null)}
        >
          <div className="flex gap-5 px-8 py-6 h-full items-start">
            {board.columns.map((col, i) => (
              <Column
                key={col.id}
                column={col}
                accent={COLUMN_ACCENTS[i] ?? "#888888"}
                onRename={(id, title) =>
                  dispatch({ type: "renameColumn", columnId: id, title })
                }
                onAddCard={(columnId, title, details) =>
                  dispatch({ type: "addCard", columnId, title, details })
                }
                onDeleteCard={(cardId) =>
                  dispatch({ type: "deleteCard", cardId })
                }
              />
            ))}
          </div>

          <DragOverlay>
            {activeCard ? (
              <div className="rotate-2">
                <Card
                  card={activeCard}
                  accent="#209dd7"
                  onDelete={() => {}}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </main>
    </div>
  );
}
