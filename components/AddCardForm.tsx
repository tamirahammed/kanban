"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  onAdd: (title: string, details: string) => void;
};

export default function AddCardForm({ onAdd }: Props) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) titleRef.current?.focus();
  }, [open]);

  function submit() {
    const t = title.trim();
    if (!t) return;
    onAdd(t, details.trim());
    setTitle("");
    setDetails("");
    setOpen(false);
  }

  function cancel() {
    setTitle("");
    setDetails("");
    setOpen(false);
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        data-testid="add-card-button"
        className="mt-2 w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-medium text-[var(--color-muted)] hover:text-[var(--color-primary)] hover:bg-white/70 transition"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </svg>
        Add a card
      </button>
    );
  }

  return (
    <div
      data-testid="add-card-form"
      className="mt-2 rounded-lg bg-white border border-slate-200 shadow-sm p-3"
    >
      <input
        ref={titleRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
          if (e.key === "Escape") cancel();
        }}
        placeholder="Card title"
        data-testid="new-card-title"
        className="w-full text-[14px] font-semibold text-[var(--color-navy)] placeholder:text-slate-400 outline-none"
      />
      <textarea
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") cancel();
        }}
        placeholder="Add details (optional)"
        rows={2}
        data-testid="new-card-details"
        className="mt-1.5 w-full text-[13px] text-[var(--color-muted)] placeholder:text-slate-400 outline-none resize-none"
      />
      <div className="mt-2 flex items-center gap-2">
        <button
          type="button"
          onClick={submit}
          data-testid="new-card-submit"
          className="px-3 py-1.5 rounded-md text-[13px] font-medium text-white bg-[var(--color-secondary)] hover:brightness-110 transition"
        >
          Add card
        </button>
        <button
          type="button"
          onClick={cancel}
          className="px-2 py-1.5 rounded-md text-[13px] text-[var(--color-muted)] hover:text-[var(--color-navy)] transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
