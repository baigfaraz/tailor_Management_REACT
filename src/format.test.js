import { describe, expect, it } from "vitest";
import { inches, orderTotal, rupees } from "./format";

describe("format", () => {
  it("adds units to numbers", () => {
    expect(inches(31)).toBe("31 Inches");
    expect(inches(30.5)).toBe("30.5 Inches");
    expect(rupees(2500)).toBe("2500 Rs");
  });

  it("shows legacy text values unchanged", () => {
    expect(inches("31 Inches")).toBe("31 Inches");
    expect(rupees("2500 Rs")).toBe("2500 Rs");
  });

  it("shows nothing for missing values", () => {
    expect(inches(undefined)).toBe("");
    expect(rupees(null)).toBe("");
  });

  it("computes the total from numbers or legacy text", () => {
    expect(orderTotal(2500, 3)).toBe("7500 Rs");
    expect(orderTotal("2500 Rs", "2")).toBe("5000 Rs");
    expect(orderTotal(undefined, 2)).toBe("");
  });
});
