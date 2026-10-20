import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Field } from "./field";
import { Input } from "./input";
import { axeViolations } from "@/test/axe";

describe("Field + Input", () => {
  it("links label, hint and error to the input", () => {
    render(
      <Field label="Waist" required hint="In inches" error="Waist is required">
        <Input suffix="in" />
      </Field>,
    );
    const input = screen.getByLabelText(/Waist/);
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-required", "true");
    expect(input).toHaveAccessibleDescription("In inches Waist is required");
  });

  it("shows prefix/suffix units and keeps typing in the input", async () => {
    render(
      <Field label="Price per suit">
        <Input prefix="Rs" inputMode="numeric" />
      </Field>,
    );
    expect(screen.getByText("Rs")).toBeInTheDocument();
    const input = screen.getByLabelText("Price per suit");
    await userEvent.type(input, "2500");
    expect(input).toHaveValue("2500");
  });

  it("is valid without error props", () => {
    render(
      <Field label="Name">
        <Input />
      </Field>,
    );
    expect(screen.getByLabelText("Name")).not.toHaveAttribute("aria-invalid");
  });

  it("has no axe violations (valid and invalid)", async () => {
    const { container } = render(
      <div>
        <Field label="Name">
          <Input />
        </Field>
        <Field label="Leg length" error="Leg length is required">
          <Input suffix="in" />
        </Field>
      </div>,
    );
    expect(await axeViolations(container)).toEqual([]);
  });
});
