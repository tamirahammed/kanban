"use client";

import { motion } from "framer-motion";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Column } from "@/components/Column";
import { KanbanLogo } from "@/components/KanbanLogo";
import { useKanbanStore } from "@/lib/store";

export function Board() {
  const board = useKanbanStore((s) => s.board);
  const columns = useKanbanStore((s) => s.columns);
  const moveCard = useKanbanStore((s) => s.moveCard);
  const reorderCardWithinColumn = useKanbanStore((s) => s.reorderCardWithinColumn);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function findColumnIdForCard(cardId: string) {
    for (const col of Object.values(columns)) {
      if (col.cardIds.includes(cardId)) return col.id;
    }
    return null;
  }

  function onDragEnd(event: DragEndEvent) {
    const activeId = String(event.active.id);
    const overId = event.over?.id ? String(event.over.id) : null;
    if (!overId) return;

    const fromColumnId =
      (event.active.data.current as { columnId?: string } | undefined)?.columnId ??
      findColumnIdForCard(activeId);
    if (!fromColumnId) return;

    const overType = (event.over?.data.current as { type?: string } | undefined)?.type;
    const toColumnId =
      overType === "card"
        ? ((event.over?.data.current as { columnId?: string } | undefined)?.columnId ?? null)
        : overType === "column"
          ? overId
          : null;
    if (!toColumnId) return;

    const fromIds = columns[fromColumnId]?.cardIds ?? [];
    const fromIndex = fromIds.indexOf(activeId);
    if (fromIndex === -1) return;

    if (fromColumnId === toColumnId) {
      if (overType === "card") {
        const toIds = columns[toColumnId]?.cardIds ?? [];
        const toIndex = toIds.indexOf(overId);
        if (toIndex === -1) return;
        reorderCardWithinColumn({ columnId: toColumnId, fromIndex, toIndex });
      }
      return;
    }

    const toIds = columns[toColumnId]?.cardIds ?? [];
    const toIndex = overType === "card" ? toIds.indexOf(overId) : toIds.length;
    moveCard({ cardId: activeId, fromColumnId, toColumnId, toIndex: Math.max(0, toIndex) });
  }

  return (
    <div className="flex h-[calc(100vh-5rem)] flex-col">
      <div className="flex items-center justify-between gap-4 px-1">
        <div className="flex items-center gap-3">
          <KanbanLogo className="shrink-0" />
          <div>
            <div className="text-2xl font-semibold tracking-tight text-[color:var(--kanban-navy)]">
              Kanban
            </div>
            <div className="text-sm text-muted-foreground">One board. No persistence. Drag cards between columns.</div>
          </div>
        </div>
        <motion.div
          className="hidden sm:flex flex-col items-end text-right"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="text-xs text-muted-foreground mb-1"
            animate={{
              color: ["#209dd7", "#753991", "#ecad0a", "#209dd7"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            Developed by
          </motion.div>
          <motion.div
            className="text-sm font-bold text-[color:var(--kanban-navy)]"
            animate={{
              scale: [1, 1.05, 1],
              textShadow: [
                "0 0 0px rgba(32, 157, 215, 0)",
                "0 0 10px rgba(32, 157, 215, 0.5)",
                "0 0 0px rgba(32, 157, 215, 0)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            Tamir Khan
          </motion.div>
        </motion.div>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <div className="mt-4 flex flex-1 gap-3 overflow-x-auto pb-3">
          {board.columnIds.map((id) => (
            <Column key={id} columnId={id} />
          ))}
          <div className="w-2 shrink-0" />
        </div>
      </DndContext>
    </div>
  );
}

