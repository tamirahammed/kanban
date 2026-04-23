"use client";

import { Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { CSSProperties } from "react";
import { Button } from "@/components/ui/button";
import type { Card } from "@/lib/kanban";
import { useKanbanStore } from "@/lib/store";

export function CardItem({ card, columnId }: { card: Card; columnId: string }) {
  const deleteCard = useKanbanStore((s) => s.deleteCard);
  const sortable = useSortable({
    id: card.id,
    data: { type: "card", cardId: card.id, columnId },
  });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(sortable.transform),
    transition: sortable.transition,
  };

  return (
    <motion.div
      ref={sortable.setNodeRef}
      style={style}
      {...sortable.attributes}
      {...sortable.listeners}
      className="group touch-none select-none cursor-grab rounded-xl border bg-card p-3 shadow-sm transition-shadow hover:shadow-md active:cursor-grabbing"
      data-dragging={sortable.isDragging ? "true" : "false"}
      data-testid={`card-${card.id}`}
      animate={{
        scale: sortable.isDragging ? 1.05 : 1,
        opacity: sortable.isDragging ? 0.9 : 1,
        rotate: sortable.isDragging ? 2 : 0,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      layout
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate font-semibold text-[color:var(--kanban-navy)]">{card.title}</div>
          {card.details ? (
            <div className="mt-1 line-clamp-3 text-sm text-muted-foreground">{card.details}</div>
          ) : null}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
          onClick={() => deleteCard(card.id)}
          aria-label="Delete card"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}

