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
      <div className="flex flex-wrap items-center justify-between gap-4 px-1">
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
          className="developer-badge relative flex flex-col items-end overflow-hidden rounded-3xl border border-transparent bg-[linear-gradient(rgba(15,23,42,0.95),rgba(15,23,42,0.95))_padding-box,linear-gradient(135deg,var(--kanban-blue),var(--kanban-purple)_45%,var(--kanban-accent-yellow))_border-box] px-4 py-3 text-right shadow-[0_18px_80px_rgba(15,23,42,0.18)] backdrop-blur-xl"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="relative z-10 text-[0.64rem] uppercase tracking-[0.3em] text-slate-200/75"
            animate={{
              color: ["#209dd7", "#753991", "#ecad0a", "#209dd7"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            Development by
          </motion.div>
          <motion.div
            className="developer-badge__name relative z-10 text-base font-semibold tracking-tight bg-[linear-gradient(90deg,var(--kanban-blue),var(--kanban-purple)_45%,var(--kanban-accent-yellow))] bg-clip-text text-transparent"
            animate={{
              scale: [1, 1.05, 1],
              textShadow: [
                "0 0 0px rgba(255,255,255,0)",
                "0 0 14px rgba(32,157,215,0.45)",
                "0 0 0px rgba(255,255,255,0)",
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

