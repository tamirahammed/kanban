"use client";

export function KanbanLogo({ className }: { className?: string }) {
  return (
    <div className={className} aria-label="Kanban" role="img">
      <svg
        width="44"
        height="44"
        viewBox="0 0 44 44"
        className="kanban-logo"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="kgrad" x1="6" y1="6" x2="38" y2="38" gradientUnits="userSpaceOnUse">
            <stop stopColor="var(--kanban-blue)" />
            <stop offset="0.45" stopColor="var(--kanban-purple)" />
            <stop offset="1" stopColor="var(--kanban-accent-yellow)" />
          </linearGradient>
          <filter id="kglow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.2" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.35 0"
              result="glow"
            />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer ring */}
        <rect
          x="6.5"
          y="6.5"
          width="31"
          height="31"
          rx="10"
          stroke="url(#kgrad)"
          strokeWidth="2.5"
          filter="url(#kglow)"
        />

        {/* Animated sweep highlight */}
        <path
          d="M9 22c0-7.2 5.8-13 13-13"
          stroke="var(--kanban-accent-yellow)"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="kanban-logo__sweep"
        />

        {/* Columns */}
        <rect x="13" y="15" width="5.2" height="16" rx="2.2" fill="var(--kanban-navy)" opacity="0.86" />
        <rect x="19.4" y="15" width="5.2" height="16" rx="2.2" fill="var(--kanban-navy)" opacity="0.72" />
        <rect x="25.8" y="15" width="5.2" height="16" rx="2.2" fill="var(--kanban-navy)" opacity="0.58" />

        {/* Moving card */}
        <rect
          x="13.7"
          y="18.2"
          width="3.8"
          height="4.2"
          rx="1.4"
          fill="var(--kanban-accent-yellow)"
          className="kanban-logo__card"
        />
      </svg>
    </div>
  );
}

