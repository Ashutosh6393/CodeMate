import { describe, it, expect, vi } from "vitest";
import type { Response } from "express";
import { sendSuccess, sendError } from "./response";

// Minimal Express Response stub: status() and json() are chainable spies.
function mockRes() {
  const res = {} as Response;
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
}

describe("sendSuccess", () => {
  it("sends a success envelope with the default 200 status", () => {
    const res = mockRes();
    sendSuccess(res, "ok", { id: 1 });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "ok",
      data: { id: 1 },
    });
  });

  it("honors a custom status code", () => {
    const res = mockRes();
    sendSuccess(res, "created", { id: 2 }, 201);

    expect(res.status).toHaveBeenCalledWith(201);
  });
});

describe("sendError", () => {
  it("sends an error envelope with the default 500 status", () => {
    const res = mockRes();
    sendError(res, "boom");

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "boom",
      error: { code: "INTERNAL_SERVER_ERROR", details: "" },
    });
  });

  it("includes the data field only when provided", () => {
    const res = mockRes();
    sendError(res, "bad", "BAD_REQUEST", "missing email", 400, {
      field: "email",
    });

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "bad",
      error: { code: "BAD_REQUEST", details: "missing email" },
      data: { field: "email" },
    });
  });
});
