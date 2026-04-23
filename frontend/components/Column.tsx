"use client";

import { Pencil } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardItem } from "@/components/CardItem";
import type { Id } from "@/lib/kanban";
import { useKanbanStore } from "@/lib/store";

export function Column({ columnId }: { columnId: Id }) {
  const column = useKanbanStore((s) => s.columns[columnId]);
  const cardsById = useKanbanStore((s) => s.cards);
  const renameColumn = useKanbanStore((s) => s.renameColumn);
  const addCard = useKanbanStore((s) => s.addCard);

  const droppable = useDroppable({
    id: columnId,
    data: { type: "column", columnId },
  });

  const cards = useMemo(
    () => column.cardIds.map((id) => cardsById[id]).filter(Boolean),
    [cardsById, column.cardIds],
  );

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [draftTitle, setDraftTitle] = useState(column.title);

  const [newTitle, setNewTitle] = useState("");
  const [newDetails, setNewDetails] = useState("");

  return (
    <motion.section
      className="flex h-full min-w-[280px] flex-col rounded-2xl border bg-white/70 p-3 shadow-sm backdrop-blur"
      data-testid={`column-${columnId}`}
      animate={{
        backgroundColor: droppable.isOver ? "rgba(236, 173, 10, 0.1)" : "rgba(255, 255, 255, 0.7)",
      }}
      transition={{ duration: 0.2 }}
    >
      <header className="flex items-center justify-between gap-2 px-1">
        {isEditingTitle ? (
          <form
            className="flex w-full items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              renameColumn(columnId, draftTitle);
              setIsEditingTitle(false);
            }}
          >
            <Input
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
              className="h-9"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setDraftTitle(column.title);
                  setIsEditingTitle(false);
                }
              }}
              onBlur={() => {
                renameColumn(columnId, draftTitle);
                setIsEditingTitle(false);
              }}
              aria-label="Column title"
            />
          </form>
        ) : (
          <>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold tracking-wide text-[color:var(--kanban-navy)]">
                {column.title}
              </div>
              <div className="text-xs text-muted-foreground">{cards.length} cards</div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => {
                setDraftTitle(column.title);
                setIsEditingTitle(true);
              }}
              aria-label="Rename column"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </>
        )}
      </header>

      <div
        // eslint-disable-next-line react-hooks/refs
        ref={droppable.setNodeRef}
        className="mt-3 flex flex-1 flex-col gap-2 overflow-auto px-1 pb-1"
        // eslint-disable-next-line react-hooks/refs
        data-over={droppable.isOver ? "true" : "false"}
        data-testid={`column-drop-${columnId}`}
      >
        <SortableContext items={column.cardIds} strategy={verticalListSortingStrategy}>
          <AnimatePresence>
            {cards.length ? (
              cards.map((c) => <CardItem key={c.id} card={c} columnId={columnId} />)
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-xl border border-dashed bg-background/70 p-4 text-sm text-muted-foreground"
              >
                No cards yet.
              </motion.div>
            )}
          </AnimatePresence>
        </SortableContext>
      </div>

      <form
        className="mt-3 rounded-xl border bg-background/70 p-2"
        onSubmit={(e) => {
          e.preventDefault();
          addCard(columnId, newTitle, newDetails);
          setNewTitle("");
          setNewDetails("");
        }}
      >
        <div className="space-y-2">
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Card title"
            className="h-9"
            aria-label="New card title"
          />
          <Input
            value={newDetails}
            onChange={(e) => setNewDetails(e.target.value)}
            placeholder="Details (optional)"
            className="h-9"
            aria-label="New card details"
          />
          <Button
            type="submit"
            className="w-full"
            disabled={!newTitle.trim()}
            style={{ backgroundColor: "var(--kanban-purple)", color: "white" }}
          >
            Add card
          </Button>
        </div>
      </form>
    </motion.section>
  );
}

