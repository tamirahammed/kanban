import { describe, expect, it, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DndContext } from "@dnd-kit/core";
import { Column } from "@/components/Column";
import { useKanbanStore } from "@/lib/store";

describe("Column", () => {
  beforeEach(() => {
    useKanbanStore.getState().reset();
  });

  it("renames a column title", async () => {
    const user = userEvent.setup();

    render(
      <DndContext>
        <Column columnId="col-1" />
      </DndContext>,
    );

    expect(screen.getByText("Backlog")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /rename column/i }));
    const input = screen.getByRole("textbox", { name: /column title/i });
    await user.clear(input);
    await user.type(input, "Ideas");
    input.blur();

    expect(useKanbanStore.getState().columns["col-1"].title).toBe("Ideas");
  });
});

