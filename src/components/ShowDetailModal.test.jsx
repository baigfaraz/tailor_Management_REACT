import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ShowDetailModal from "./ShowDetailModal";
import { updateOrderStatus } from "../api/customers";

vi.mock("../api/customers", () => ({
  updateOrderStatus: vi.fn(),
  updatePaymentStatus: vi.fn(),
}));

const customer = {
  customer_id: 7,
  customer_name: "Ayesha Malik",
  customer_orderStatus: "Pending",
  customer_paymentStatus: "Complete",
  customer_orderPrice: "2500 Rs",
  customer_noOfSuits: "2",
};

describe("ShowDetailModal", () => {
  beforeEach(() => vi.resetAllMocks());

  it("shows the status from the customer data and the total", () => {
    render(<ShowDetailModal show handleClose={vi.fn()} data={customer} />);
    expect(screen.getByText("5000 Rs")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Order Complete" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Complete Payment" }),
    ).not.toBeInTheDocument();
  });

  it("updates the order status and closes on success", async () => {
    updateOrderStatus.mockResolvedValue({});
    const handleClose = vi.fn();
    render(<ShowDetailModal show handleClose={handleClose} data={customer} />);

    await userEvent.click(
      screen.getByRole("button", { name: "Order Complete" }),
    );
    await userEvent.click(screen.getByRole("button", { name: "Confirm" }));

    expect(updateOrderStatus).toHaveBeenCalledWith(7, "Complete");
    expect(handleClose).toHaveBeenCalled();
  });

  it("keeps the confirmation open with the error on failure (UX-003)", async () => {
    updateOrderStatus.mockRejectedValue(new Error("Network Error"));
    const handleClose = vi.fn();
    render(<ShowDetailModal show handleClose={handleClose} data={customer} />);

    await userEvent.click(
      screen.getByRole("button", { name: "Order Complete" }),
    );
    await userEvent.click(screen.getByRole("button", { name: "Confirm" }));

    const confirmation = screen
      .getByText("Are you sure you want to proceed?")
      .closest(".modal");
    expect(await within(confirmation).findByRole("alert")).toHaveTextContent(
      "Could not reach the shop computer",
    );
    expect(handleClose).not.toHaveBeenCalled();
  });
});
