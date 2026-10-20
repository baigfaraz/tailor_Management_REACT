import { useState } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Button } from "./button";
import { ConfirmDialog } from "./confirm-dialog";
import { axeViolations } from "@/test/axe";

function Example() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Customer</DialogTitle>
          <DialogDescription>Details</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <input aria-label="Notes" />
        </DialogBody>
        <DialogFooter>
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

describe("Dialog", () => {
  it("opens with a name, traps focus, closes on Esc and returns focus", async () => {
    render(<Example />);
    const trigger = screen.getByRole("button", { name: "Open" });
    await userEvent.click(trigger);

    const dialog = screen.getByRole("dialog", { name: "Customer" });
    expect(dialog).toContainElement(document.activeElement);

    await userEvent.tab();
    await userEvent.tab();
    await userEvent.tab();
    expect(dialog).toContainElement(document.activeElement);

    await userEvent.keyboard("{Escape}");
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    expect(trigger).toHaveFocus();
  });

  it("closes with the Close button", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("button", { name: "Open" }));
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
  });

  it("has no axe violations when open", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(await axeViolations(document.body)).toEqual([]);
  });
});

function Confirm({ onConfirm, loading = false, error }) {
  const [open, setOpen] = useState(true);
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={setOpen}
      tone="danger"
      title="Delete customer?"
      description="This cannot be undone."
      confirmLabel="Delete"
      loading={loading}
      error={error}
      onConfirm={onConfirm}
    />
  );
}

describe("ConfirmDialog", () => {
  it("is an alertdialog that starts focus on Cancel and cancels with Esc", async () => {
    render(<Confirm onConfirm={vi.fn()} />);
    const dialog = screen.getByRole("alertdialog", {
      name: "Delete customer?",
    });
    expect(screen.getByRole("button", { name: "Cancel" })).toHaveFocus();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(dialog).not.toBeInTheDocument());
  });

  it("calls onConfirm", async () => {
    const onConfirm = vi.fn();
    render(<Confirm onConfirm={onConfirm} />);
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it("shows busy and error states", () => {
    render(<Confirm onConfirm={vi.fn()} loading error="Could not delete." />);
    expect(screen.getByRole("button", { name: "Delete" })).toHaveAttribute(
      "aria-busy",
      "true",
    );
    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
    expect(screen.getByRole("alert")).toHaveTextContent("Could not delete.");
  });

  it("has no axe violations", async () => {
    render(<Confirm onConfirm={vi.fn()} />);
    expect(await axeViolations(document.body)).toEqual([]);
  });
});
