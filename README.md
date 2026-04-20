# Kanban

A single-board Kanban MVP. Five renameable columns, cards with title and details, drag and drop, add and delete. No persistence.

## Stack

Next.js 15 (App Router, client rendered), React 19, TypeScript, Tailwind CSS v4, @dnd-kit. Vitest + Testing Library for unit tests, Playwright for end-to-end.

## Run

```
npm install
npm run dev
```

Open http://localhost:3000.

## Test

```
npm test            # unit tests
npm run e2e:install # one-time Playwright browser install
npm run e2e         # end-to-end tests
```
