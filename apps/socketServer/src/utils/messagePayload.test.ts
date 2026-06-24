import { describe, it, expect } from "vitest";
import { isMessagePayload } from "./messagePayload";

describe("isMessagePayload", () => {
  it("accepts an object with a string message and a data field", () => {
    expect(isMessagePayload({ message: "REALTIME_CODE", data: "abc" })).toBe(
      true,
    );
  });

  it("rejects an object missing the data field", () => {
    expect(isMessagePayload({ message: "REALTIME_CODE" } as never)).toBe(false);
  });

  it("rejects a non-string message", () => {
    expect(isMessagePayload({ message: 123, data: "x" } as never)).toBe(false);
  });
});
