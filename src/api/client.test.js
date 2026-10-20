import { describe, expect, it } from "vitest";
import client from "./client";
import { OFFLINE_MESSAGE, errorMessage } from "./errors";

describe("API client", () => {
  it("uses same-origin /api, sends cookies and times out", () => {
    expect(client.defaults.baseURL).toBe("/api");
    expect(client.defaults.withCredentials).toBe(true);
    expect(client.defaults.timeout).toBe(15000);
  });
});

describe("errorMessage", () => {
  it("explains a network failure or timeout", () => {
    expect(errorMessage(new Error("timeout of 15000ms exceeded"), "x")).toBe(
      OFFLINE_MESSAGE,
    );
  });

  it("uses the server's message, else the fallback", () => {
    expect(
      errorMessage({ response: { data: { error: "Wrong PIN." } } }, "x"),
    ).toBe("Wrong PIN.");
    expect(errorMessage({ response: { data: {} } }, "Could not save.")).toBe(
      "Could not save.",
    );
  });
});
