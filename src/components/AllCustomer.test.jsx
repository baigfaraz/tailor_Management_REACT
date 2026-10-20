import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AllCustomer from "./AllCustomer";
import { deleteCustomer, getCustomer, listCustomers } from "../api/customers";

vi.mock("../api/customers", () => ({
  listCustomers: vi.fn(),
  getCustomer: vi.fn(),
  deleteCustomer: vi.fn(),
  updateOrderStatus: vi.fn(),
  updatePaymentStatus: vi.fn(),
}));

const offline = Object.assign(new Error("Network Error"), {
  response: undefined,
});
const ali = {
  customer_id: 1,
  customer_name: "Ali Raza",
  customer_contact: "0300",
  customer_orderStatus: "Pending",
  customer_paymentStatus: "Pending",
};

const renderList = () =>
  render(
    <MemoryRouter>
      <AllCustomer />
    </MemoryRouter>,
  );

describe("AllCustomer states (UX-003)", () => {
  beforeEach(() => vi.resetAllMocks());

  it("shows a loading message until customers arrive", async () => {
    let resolve;
    listCustomers.mockReturnValue(new Promise((r) => (resolve = r)));
    renderList();
    expect(screen.getByRole("status")).toHaveTextContent("Loading customers…");
    resolve([ali]);
    expect(
      await screen.findByRole("row", { name: /Ali Raza/ }),
    ).toBeInTheDocument();
  });

  it("shows the empty message when there are no customers", async () => {
    listCustomers.mockResolvedValue([]);
    renderList();
    expect(
      await screen.findByText("No data availaible to show!"),
    ).toBeInTheDocument();
  });

  it("shows an error with Retry when the server cannot be reached", async () => {
    listCustomers.mockRejectedValueOnce(offline).mockResolvedValueOnce([ali]);
    renderList();

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Could not reach the shop computer");
    expect(
      screen.queryByText("No data availaible to show!"),
    ).not.toBeInTheDocument();

    await userEvent.click(within(alert).getByRole("button", { name: "Retry" }));
    expect(
      await screen.findByRole("row", { name: /Ali Raza/ }),
    ).toBeInTheDocument();
  });

  it("explains when a customer cannot be opened", async () => {
    listCustomers.mockResolvedValue([ali]);
    getCustomer.mockRejectedValue(offline);
    renderList();

    await userEvent.click(
      await screen.findByRole("cell", { name: "Ali Raza" }),
    );
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Could not reach the shop computer",
    );
  });

  it("keeps the delete dialog open with the error when delete fails", async () => {
    listCustomers.mockResolvedValue([ali]);
    deleteCustomer.mockRejectedValue({
      response: {
        status: 500,
        data: { error: "An error occurred while processing your request." },
      },
    });
    const { container } = renderList();

    await screen.findByRole("row", { name: /Ali Raza/ });
    await userEvent.click(container.querySelector("svg.trash"));
    const dialog = await screen.findByRole("dialog");
    await userEvent.click(
      within(dialog).getByRole("button", { name: "Delete" }),
    );

    expect(await within(dialog).findByRole("alert")).toHaveTextContent(
      "An error occurred while processing your request.",
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
