"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { CardT } from "@/lib/types";

type Props = {
  card: CardT;
  accent: string;
  onDelete: (id: string) => void;
};

export default function Card({ card, accent, onDelete }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id, data: { type: "card" } });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    borderLeftColor: accent,
    opacity: isDragging ? 0.35 : 1,
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      data-testid="card"
      data-card-id={card.id}
      className="group relative rounded-lg bg-white border border-slate-200/80 border-l-4 shadow-sm hover:shadow-md transition-shadow px-4 py-3 cursor-grab active:cursor-grabbing touch-none"
      {...attributes}
      {...listeners}
    >
      <h3 className="text-[15px] font-semibold text-[var(--color-navy)] leading-snug pr-7">
        {card.title}
      </h3>
      {card.details && (
        <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--color-muted)]">
          {card.details}
        </p>
      )}
      <button
        type="button"
        aria-label={`Delete card ${card.title}`}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          onDelete(card.id);
        }}
        className="absolute top-2 right-2 h-6 w-6 grid place-items-center rounded-md text-[var(--color-muted)] opacity-0 group-hover:opacity-100 hover:bg-slate-100 hover:text-[var(--color-secondary)] transition"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 6h18" />
          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        </svg>
      </button>
    </article>
  );
}
