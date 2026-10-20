import { useState } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ChoiceGroup } from "./choice-group";
import { Checkbox } from "./checkbox";
import { axeViolations } from "@/test/axe";

const OPTIONS = [
  { value: "Kurta", label: "Kurta" },
  { value: "Shalwar", label: "Shalwar" },
];

function Dress() {
  const [value, setValue] = useState("");
  return (
    <>
      <ChoiceGroup
        legend="Dress"
        required
        options={OPTIONS}
        value={value}
        onValueChange={setValue}
      />
      <output>{value}</output>
    </>
  );
}

describe("ChoiceGroup", () => {
  it("is a named radio group; click selects", async () => {
    render(<Dress />);
    expect(
      screen.getByRole("radiogroup", { name: /Dress/ }),
    ).toBeInTheDocument();
    await userEvent.click(screen.getByRole("radio", { name: "Shalwar" }));
    expect(screen.getByRole("radio", { name: "Shalwar" })).toBeChecked();
    expect(screen.getByRole("status")).toHaveTextContent("Shalwar");
  });

  it("moves focus with arrow keys and selects with Space", async () => {
    render(<Dress />);
    await userEvent.click(screen.getByRole("radio", { name: "Kurta" }));
    await userEvent.keyboard("{ArrowRight}");
    // Radix moves focus on the next tick (and selects on focus during a real
    // keypress); in tests we confirm focus moved, then select with Space.
    await waitFor(() =>
      expect(screen.getByRole("radio", { name: "Shalwar" })).toHaveFocus(),
    );
    await userEvent.keyboard(" ");
    expect(screen.getByRole("radio", { name: "Shalwar" })).toBeChecked();
  });

  it("has no axe violations", async () => {
    const { container } = render(<Dress />);
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe("Checkbox", () => {
  it("toggles by clicking its label and by Space", async () => {
    render(<Checkbox label="Upper pocket" />);
    const box = screen.getByRole("checkbox", { name: "Upper pocket" });
    await userEvent.click(screen.getByText("Upper pocket"));
    expect(box).toBeChecked();
    box.focus();
    await userEvent.keyboard(" ");
    expect(box).not.toBeChecked();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <Checkbox label="Upper pocket" defaultChecked />,
    );
    expect(await axeViolations(container)).toEqual([]);
  });
});
