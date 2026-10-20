import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import HomePage from "./HomePage";
import { createCustomer } from "../api/customers";

vi.mock("../api/customers", () => ({ createCustomer: vi.fn() }));

describe("HomePage", () => {
  it("confirms a new customer with name and number (UX-004a)", async () => {
    createCustomer.mockResolvedValue({
      customer_id: 4,
      customer_name: "Hina Shah",
    });
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );

    await userEvent.click(screen.getByRole("link", { name: "Add Customer" }));
    await userEvent.click(screen.getByRole("button", { name: "Add Detail" }));
    const confirm = screen
      .getByText("Click on confirm if you want to add!")
      .closest(".modal");
    await userEvent.click(
      within(confirm).getByRole("button", { name: "Confirm" }),
    );

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Customer added: Hina Shah (Customer No 4)",
    );
  });
});
