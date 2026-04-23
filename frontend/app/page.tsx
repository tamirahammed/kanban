"use client";

import dynamic from "next/dynamic";

const Board = dynamic(() => import("@/components/Board").then((m) => m.Board), { ssr: false });

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col bg-[radial-gradient(900px_circle_at_15%_10%,rgba(32,157,215,0.12),transparent_60%),radial-gradient(800px_circle_at_85%_15%,rgba(117,57,145,0.10),transparent_55%),linear-gradient(to_bottom_right,white,white)]">
      <div className="w-full px-4 py-6 sm:px-6">
        <div className="mb-4 h-1 w-24 rounded-full bg-[color:var(--kanban-accent-yellow)]" />
        <Board />
      </div>
    </main>
  );
}
