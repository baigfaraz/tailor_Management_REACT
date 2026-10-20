import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import DetailModal from "./DetailModal";
import { createCustomer } from "../api/customers";

vi.mock("../api/customers", () => ({ createCustomer: vi.fn() }));

function setup() {
  const handleClose = vi.fn();
  const onSaved = vi.fn();
  render(<DetailModal show handleClose={handleClose} onSaved={onSaved} />);
  return { handleClose, onSaved };
}

async function confirmSave() {
  await userEvent.click(screen.getByRole("button", { name: "Add Detail" }));
  const confirm = screen
    .getByText("Click on confirm if you want to add!")
    .closest(".modal");
  await userEvent.click(
    within(confirm).getByRole("button", { name: "Confirm" }),
  );
  return confirm;
}

describe("DetailModal save feedback (UX-004a)", () => {
  beforeEach(() => vi.resetAllMocks());

  it("shows the server's validation error and keeps what was typed", async () => {
    createCustomer.mockRejectedValue({
      response: {
        status: 400,
        data: { error: "Please add all details. Thankyou!" },
      },
    });
    const { handleClose, onSaved } = setup();
    await userEvent.type(screen.getByLabelText("Name"), "Bilal Ahmed");

    const confirm = await confirmSave();

    expect(await within(confirm).findByRole("alert")).toHaveTextContent(
      "Please add all details. Thankyou!",
    );
    expect(screen.getByLabelText("Name")).toHaveValue("Bilal Ahmed");
    expect(handleClose).not.toHaveBeenCalled();
    expect(onSaved).not.toHaveBeenCalled();
  });

  it("closes and reports the saved customer on success", async () => {
    createCustomer.mockResolvedValue({
      customer_id: 3,
      customer_name: "Bilal Ahmed",
    });
    const { handleClose, onSaved } = setup();

    await confirmSave();

    expect(handleClose).toHaveBeenCalled();
    expect(onSaved).toHaveBeenCalledWith({
      customer_id: 3,
      customer_name: "Bilal Ahmed",
    });
  });

  it("sends one request even if Confirm is clicked twice (UX-010)", async () => {
    let resolve;
    createCustomer.mockReturnValue(new Promise((r) => (resolve = r)));
    setup();

    const confirm = await confirmSave();
    const button = within(confirm).getByRole("button", { name: "Saving…" });
    expect(button).toBeDisabled();
    await userEvent.click(button);

    resolve({ customer_id: 1, customer_name: "X" });
    expect(createCustomer).toHaveBeenCalledTimes(1);
  });
});
