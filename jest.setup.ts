import "@testing-library/jest-dom";
import "jest-styled-components";

import { TextEncoder, TextDecoder as NodeTextDecoder } from "util";

globalThis.TextEncoder = TextEncoder as typeof globalThis.TextEncoder;
globalThis.TextDecoder =
  NodeTextDecoder as unknown as typeof globalThis.TextDecoder;

globalThis.matchMedia =
  globalThis.matchMedia ||
  (() => ({
    matches: false,
    media: "",
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
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
