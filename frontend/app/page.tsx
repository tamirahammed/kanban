"use client";

import dynamic from "next/dynamic";

const Board = dynamic(() => import("@/components/Board").then((m) => m.Board), { ssr: false });

export default function Home() {
  return (
    <main className="flex flex-1 flex-col bg-[radial-gradient(900px_circle_at_15%_10%,rgba(32,157,215,0.12),transparent_60%),radial-gradient(800px_circle_at_85%_15%,rgba(117,57,145,0.10),transparent_55%),linear-gradient(to_bottom_right,white,white)]">
      <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6">
        <section className="developer-banner mb-8 overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 text-white shadow-[0_30px_90px_rgba(15,23,42,0.18)] backdrop-blur-xl sm:p-8">
          <p className="developer-banner__role mb-3 text-xs uppercase tracking-[0.32em] text-slate-300/80">
            Lead Developer
          </p>
          <h1 className="developer-banner__name max-w-3xl text-[clamp(2rem,4vw,3.5rem)] font-black leading-[0.95] tracking-[-0.035em]">
            Tamir Khan
          </h1>
          <p className="developer-banner__desc mt-4 max-w-2xl text-sm leading-7 text-slate-300/85 sm:text-base">
            A modern, always-animated developer signature for the Kanban experience. Inspired by sleek product launches and built to keep your brand glowing in every view.
          </p>
        </section>
        <div className="mb-4 h-1 w-24 rounded-full bg-[color:var(--kanban-accent-yellow)]" />
        <Board />
      </div>
    </main>
  );
}
