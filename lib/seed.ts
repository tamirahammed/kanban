import type { BoardT } from "./types";

export const seedBoard: BoardT = {
  columns: [
    {
      id: "col-1",
      title: "Backlog",
      cards: [
        {
          id: "c-1",
          title: "Define onboarding flow",
          details:
            "Map the first-time user journey from signup through the initial empty board experience.",
        },
        {
          id: "c-2",
          title: "Research competitor boards",
          details:
            "Collect screenshots and notes on three popular kanban tools to inform our UI.",
        },
        {
          id: "c-3",
          title: "Draft marketing copy",
          details: "Headline, subhead, and three feature bullets for the landing page.",
        },
      ],
    },
    {
      id: "col-2",
      title: "To Do",
      cards: [
        {
          id: "c-4",
          title: "Wire up drag and drop",
          details:
            "Use a popular accessible library; support keyboard drag between columns.",
        },
        {
          id: "c-5",
          title: "Design empty states",
          details: "Friendly placeholder when a column has no cards.",
        },
      ],
    },
    {
      id: "col-3",
      title: "In Progress",
      cards: [
        {
          id: "c-6",
          title: "Build column renaming",
          details:
            "Inline editing on the column title with Enter to save and Escape to cancel.",
        },
      ],
    },
    {
      id: "col-4",
      title: "Review",
      cards: [
        {
          id: "c-7",
          title: "Accessibility pass",
          details: "Tab order, focus rings, and screen-reader labels on all controls.",
        },
      ],
    },
    {
      id: "col-5",
      title: "Done",
      cards: [
        {
          id: "c-8",
          title: "Pick a color palette",
          details: "Navy, primary blue, purple, accent yellow, muted gray.",
        },
        {
          id: "c-9",
          title: "Set up Next.js project",
          details: "App router, TypeScript, Tailwind v4.",
        },
      ],
    },
  ],
};
