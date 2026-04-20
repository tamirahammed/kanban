"use client";

import { useEffect, useRef, useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { ColumnT } from "@/lib/types";
import Card from "./Card";
import AddCardForm from "./AddCardForm";

type Props = {
  column: ColumnT;
  accent: string;
  onRename: (id: string, title: string) => void;
  onAddCard: (columnId: string, title: string, details: string) => void;
  onDeleteCard: (cardId: string) => void;
};

export default function Column({
  column,
  accent,
  onRename,
  onAddCard,
  onDeleteCard,
}: Props) {
  const { setNodeRef, isOver } = useDroppable({
    id: `col:${column.id}`,
    data: { type: "column", columnId: column.id },
  });

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(column.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  useEffect(() => {
    setDraft(column.title);
  }, [column.title]);

  function commitRename() {
    const t = draft.trim();
    if (t && t !== column.title) {
      onRename(column.id, t);
    } else {
      setDraft(column.title);
    }
    setEditing(false);
  }

  return (
    <section
      data-testid="column"
      data-column-id={column.id}
      className="flex flex-col w-[300px] shrink-0 rounded-xl bg-[var(--color-board)]/60 backdrop-blur-sm border border-slate-200/70"
    >
      {/* Header */}
      <header className="flex items-center justify-between px-4 pt-3.5 pb-2">
        <div className="flex items-center gap-2 min-w-0">
          <span
            aria-hidden="true"
            className="h-2 w-2 rounded-full shrink-0"
            style={{ background: accent }}
          />
          {editing ? (
            <input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commitRename}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitRename();
                if (e.key === "Escape") {
                  setDraft(column.title);
                  setEditing(false);
                }
              }}
              data-testid="column-title-input"
              className="min-w-0 flex-1 text-[13px] font-semibold uppercase tracking-[0.08em] text-[var(--color-navy)] bg-white rounded px-1.5 py-0.5 outline-none ring-2 ring-[var(--color-primary)]/50"
            />
          ) : (
            <button
              type="button"
              onClick={() => setEditing(true)}
              data-testid="column-title"
              className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[var(--color-navy)] truncate hover:text-[var(--color-primary)] transition"
              title="Click to rename"
            >
              {column.title}
            </button>
          )}
        </div>
        <span
          data-testid="column-count"
          className="text-[11px] font-medium text-[var(--color-muted)] bg-white border border-slate-200 rounded-full px-2 py-0.5 tabular-nums"
        >
          {column.cards.length}
        </span>
      </header>

      {/* Card list */}
      <div
        ref={setNodeRef}
        className={`flex-1 px-2 pb-2 flex flex-col gap-2 min-h-[60px] rounded-b-xl transition-colors ${
          isOver ? "bg-[var(--color-primary)]/5" : ""
        }`}
      >
        <SortableContext
          items={column.cards.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {column.cards.map((card) => (
            <Card
              key={card.id}
              card={card}
              accent={accent}
              onDelete={onDeleteCard}
            />
          ))}
        </SortableContext>

        {column.cards.length === 0 && (
          <div className="text-center text-[12px] text-slate-400 py-6 select-none">
            Drop cards here
          </div>
        )}

        <AddCardForm
          onAdd={(title, details) => onAddCard(column.id, title, details)}
        />
      </div>
    </section>
  );
}
