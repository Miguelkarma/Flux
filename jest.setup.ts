import "@testing-library/jest-dom";

import { TextEncoder, TextDecoder as NodeTextDecoder } from "util";

globalThis.TextEncoder = TextEncoder as typeof globalThis.TextEncoder;
globalThis.TextDecoder =
  NodeTextDecoder as unknown as typeof globalThis.TextDecoder;

class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

Object.defineProperty(globalThis, "ResizeObserver", {
  writable: true,
  configurable: true,
  value: MockResizeObserver,
});

jest.mock("lucide-react", () => ({
  Check: () => "MockedCheckIcon",
}));
