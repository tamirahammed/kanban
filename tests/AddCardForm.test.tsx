import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddCardForm from "@/components/AddCardForm";

describe("AddCardForm", () => {
  it("starts collapsed and opens on click", async () => {
    render(<AddCardForm onAdd={vi.fn()} />);
    expect(screen.queryByTestId("add-card-form")).not.toBeInTheDocument();
    await userEvent.click(screen.getByTestId("add-card-button"));
    expect(screen.getByTestId("add-card-form")).toBeInTheDocument();
    expect(screen.getByTestId("new-card-title")).toHaveFocus();
  });

  it("submits title and details, then collapses", async () => {
    const onAdd = vi.fn();
    render(<AddCardForm onAdd={onAdd} />);
    await userEvent.click(screen.getByTestId("add-card-button"));
    await userEvent.type(screen.getByTestId("new-card-title"), "Write specs");
    await userEvent.type(
      screen.getByTestId("new-card-details"),
      "Cover the happy path"
    );
    await userEvent.click(screen.getByTestId("new-card-submit"));

    expect(onAdd).toHaveBeenCalledWith("Write specs", "Cover the happy path");
    expect(screen.queryByTestId("add-card-form")).not.toBeInTheDocument();
  });

  it("Enter in the title submits", async () => {
    const onAdd = vi.fn();
    render(<AddCardForm onAdd={onAdd} />);
    await userEvent.click(screen.getByTestId("add-card-button"));
    await userEvent.type(
      screen.getByTestId("new-card-title"),
      "Quick one{Enter}"
    );
    expect(onAdd).toHaveBeenCalledWith("Quick one", "");
  });

  it("empty title does not submit", async () => {
    const onAdd = vi.fn();
    render(<AddCardForm onAdd={onAdd} />);
    await userEvent.click(screen.getByTestId("add-card-button"));
    await userEvent.type(screen.getByTestId("new-card-title"), "   {Enter}");
    expect(onAdd).not.toHaveBeenCalled();
  });

  it("Escape cancels without calling onAdd", async () => {
    const onAdd = vi.fn();
    render(<AddCardForm onAdd={onAdd} />);
    await userEvent.click(screen.getByTestId("add-card-button"));
    await userEvent.type(
      screen.getByTestId("new-card-title"),
      "typed then cancel{Escape}"
    );
    expect(onAdd).not.toHaveBeenCalled();
    expect(screen.queryByTestId("add-card-form")).not.toBeInTheDocument();
  });
});
