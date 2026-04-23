# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start Next.js dev server (port 3000)
npm run build        # Production build
npm run lint         # Next.js lint
npm test             # Run unit tests once (Vitest)
npm run test:watch   # Run unit tests in watch mode
npm run e2e          # Run Playwright E2E tests (auto-starts dev server)
npm run e2e:install  # One-time Playwright browser install
```

To run a single unit test file: `npx vitest run tests/reducer.test.ts`

## Architecture

**Kanban MVP** — client-side only, no backend, no persistence. State lives in memory for the session.

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4 · @dnd-kit · Vitest · Playwright

### Component tree

```
app/page.tsx
└── Board.tsx         ← useReducer state, DndContext, drag overlay
    ├── Column.tsx × 5    ← droppable, inline rename UI
    │   ├── Card.tsx × N      ← sortable + draggable
    │   └── AddCardForm.tsx   ← collapsible, validates title required
```

### State management

All mutations flow through a single pure reducer in `lib/reducer.ts`. Actions: `renameColumn`, `addCard`, `deleteCard`, `moveCard`. Initial state comes from `lib/seed.ts` (`seedBoard`).

### Drag and drop

Uses `@dnd-kit/core` with PointerSensor (5px activation) + KeyboardSensor. Collision strategy: `closestCorners`. Column droppable IDs are prefixed `col:{id}`; card IDs are used directly. A `DragOverlay` renders a rotated copy of the dragged card.

`Board.tsx` builds a `cardIndex` Map (`useMemo`) for O(1) lookups during drag events. Same-column reorder index math is handled there before dispatching `moveCard`.

### Styling

Theme tokens are CSS custom properties in `app/globals.css` (`--color-accent`, `--color-primary`, `--color-surface`, etc.). Use these variables via Tailwind's arbitrary value syntax (`bg-[var(--color-surface)]`) rather than hardcoding colors.

Per-column accent colors are hardcoded as `COLUMN_ACCENTS` in `Board.tsx` (not CSS variables) and passed down as the `accent` prop.

### Types

`lib/types.ts` defines `CardT`, `ColumnT`, `BoardT`. Card IDs are generated as `c-${timestamp}-${random}`.

### Testing conventions

- Unit tests live in `tests/` and use `data-testid` attributes for queries.
- E2E tests live in `e2e/` and target Chromium only.
- Vitest config: `vitest.config.ts` (jsdom env, globals enabled).
- Playwright auto-starts `npm run dev` before running specs.
