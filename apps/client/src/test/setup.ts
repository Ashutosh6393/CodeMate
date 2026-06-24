// Registers @testing-library/jest-dom matchers (e.g. toBeInTheDocument) with
// Vitest's expect, and auto-cleans up the rendered DOM after each test.
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
});
