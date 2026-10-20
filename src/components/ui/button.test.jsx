import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Link } from "react-router";
import { Trash2 } from "lucide-react";
import { describe, expect, it, vi } from "vitest";
import { Button, IconButton } from "./button";
import { Icon } from "./icon";
import { axeViolations } from "@/test/axe";

describe("Button", () => {
  it("is a real button (type=button) and clicks", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);
    const button = screen.getByRole("button", { name: "Save" });
    expect(button).toHaveAttribute("type", "button");
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("is reachable and pressable with the keyboard", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);
    await userEvent.tab();
    expect(screen.getByRole("button")).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("blocks clicks and reports busy while loading", async () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Saving…
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Saving…" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("renders a link with button styles via asChild", () => {
    render(
      <MemoryRouter>
        <Button asChild variant="secondary">
          <Link to="/Home/AllCustomer">All customers</Link>
        </Button>
      </MemoryRouter>,
    );
    const link = screen.getByRole("link", { name: "All customers" });
    expect(link).toHaveAttribute("href", "/Home/AllCustomer");
    expect(link.className).toContain("border-outline");
  });

  it("IconButton gets its accessible name from label", async () => {
    const { container } = render(
      <IconButton label="Delete Ali Raza">
        <Icon icon={Trash2} />
      </IconButton>,
    );
    expect(
      screen.getByRole("button", { name: "Delete Ali Raza" }),
    ).toBeInTheDocument();
    expect(await axeViolations(container)).toEqual([]);
  });

  it("has no axe violations across variants", async () => {
    const { container } = render(
      <div>
        {["primary", "secondary", "ghost", "danger"].map((variant) => (
          <Button key={variant} variant={variant}>
            {variant}
          </Button>
        ))}
        <Button disabled>Disabled</Button>
      </div>,
    );
    expect(await axeViolations(container)).toEqual([]);
  });
});
