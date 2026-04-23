import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DndContext } from "@dnd-kit/core";
import Column from "@/components/Column";
import type { ColumnT } from "@/lib/types";

function renderColumn(overrides: Partial<Parameters<typeof Column>[0]> = {}) {
  const column: ColumnT = {
    id: "c1",
    title: "To Do",
    cards: [],
  };
  const props = {
    column,
    accent: "#209dd7",
    onRename: vi.fn(),
    onAddCard: vi.fn(),
    onDeleteCard: vi.fn(),
    ...overrides,
  };
  render(
    <DndContext>
      <Column {...props} />
    </DndContext>
  );
  return props;
}

describe("Column rename", () => {
  it("clicking the title reveals an input focused with current value", async () => {
    renderColumn();
    await userEvent.click(screen.getByTestId("column-title"));
    const input = screen.getByTestId("column-title-input") as HTMLInputElement;
    expect(input).toHaveValue("To Do");
    expect(input).toHaveFocus();
  });

  it("Enter commits the new title", async () => {
    const { onRename } = renderColumn();
    await userEvent.click(screen.getByTestId("column-title"));
    const input = screen.getByTestId("column-title-input");
    await userEvent.clear(input);
    await userEvent.type(input, "Doing{Enter}");
    expect(onRename).toHaveBeenCalledWith("c1", "Doing");
  });

  it("Escape cancels without calling onRename", async () => {
    const { onRename } = renderColumn();
    await userEvent.click(screen.getByTestId("column-title"));
    const input = screen.getByTestId("column-title-input");
    await userEvent.clear(input);
    await userEvent.type(input, "Something{Escape}");
    expect(onRename).not.toHaveBeenCalled();
    expect(screen.getByTestId("column-title")).toHaveTextContent("To Do");
  });

  it("empty title does not call onRename", async () => {
    const { onRename } = renderColumn();
    await userEvent.click(screen.getByTestId("column-title"));
    const input = screen.getByTestId("column-title-input");
    await userEvent.clear(input);
    await userEvent.type(input, "{Enter}");
    expect(onRename).not.toHaveBeenCalled();
  });
});
