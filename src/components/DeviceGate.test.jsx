import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import DeviceGate from "./DeviceGate";
import { getSession, unlockDevice } from "../api/session";
import { DEVICE_LOCKED_EVENT } from "../api/client";

vi.mock("../api/session", () => ({
  getSession: vi.fn(),
  unlockDevice: vi.fn(),
}));

const renderGate = () =>
  render(
    <DeviceGate>
      <p>App content</p>
    </DeviceGate>,
  );

describe("DeviceGate", () => {
  beforeEach(() => vi.resetAllMocks());

  it("renders the app without waiting for the session check", () => {
    getSession.mockReturnValue(new Promise(() => {}));
    renderGate();
    expect(screen.getByText("App content")).toBeInTheDocument();
  });

  it("shows the app when the device is unlocked", async () => {
    getSession.mockResolvedValue({ unlocked: true });
    renderGate();
    expect(await screen.findByText("App content")).toBeInTheDocument();
  });

  it("asks for the PIN and unlocks", async () => {
    getSession.mockResolvedValue({ unlocked: false });
    unlockDevice.mockResolvedValue({ unlocked: true });
    renderGate();

    const input = await screen.findByLabelText(
      "Enter the shop PIN to use this device",
    );
    await userEvent.type(input, "2468");
    await userEvent.click(screen.getByRole("button", { name: "Unlock" }));

    expect(unlockDevice).toHaveBeenCalledWith("2468");
    expect(await screen.findByText("App content")).toBeInTheDocument();
  });

  it("shows the server's error for a wrong PIN", async () => {
    getSession.mockResolvedValue({ unlocked: false });
    unlockDevice.mockRejectedValue({
      response: { data: { error: "Wrong PIN." } },
    });
    renderGate();

    await userEvent.type(
      await screen.findByLabelText("Enter the shop PIN to use this device"),
      "0000",
    );
    await userEvent.click(screen.getByRole("button", { name: "Unlock" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Wrong PIN.");
    expect(screen.queryByText("App content")).not.toBeInTheDocument();
  });

  it("locks again when the API reports 401", async () => {
    getSession.mockResolvedValue({ unlocked: true });
    renderGate();
    await screen.findByText("App content");

    window.dispatchEvent(new Event(DEVICE_LOCKED_EVENT));

    expect(
      await screen.findByLabelText("Enter the shop PIN to use this device"),
    ).toBeInTheDocument();
  });
});
