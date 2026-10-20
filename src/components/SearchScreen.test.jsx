import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SearchScreen from "./SearchScreen";
import { getCustomer } from "../api/customers";

vi.mock("../api/customers", () => ({
  getCustomer: vi.fn(),
  updateOrderStatus: vi.fn(),
  updatePaymentStatus: vi.fn(),
}));

const search = async (term) => {
  render(
    <MemoryRouter>
      <SearchScreen />
    </MemoryRouter>,
  );
  await userEvent.type(screen.getByPlaceholderText("Enter Customer-ID"), term);
  await userEvent.keyboard("{Enter}");
};

describe("SearchScreen", () => {
  beforeEach(() => vi.resetAllMocks());

  it("searches on Enter without reloading the page (UX-011)", async () => {
    getCustomer.mockResolvedValue({
      customer_id: 1,
      customer_name: "Usman Tariq",
    });
    await search("1");
    expect(getCustomer).toHaveBeenCalledWith("1");
    expect(await screen.findByText("Usman Tariq")).toBeInTheDocument();
  });

  it.each([404, 400])("says not found for a %s response", async (status) => {
    getCustomer.mockRejectedValue({ response: { status, data: {} } });
    await search("999");
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Customer Not Found.",
    );
  });

  it("says the server is unreachable instead of not found (UX-003)", async () => {
    getCustomer.mockRejectedValue(new Error("Network Error"));
    await search("1");
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Could not reach the shop computer",
    );
  });
});
