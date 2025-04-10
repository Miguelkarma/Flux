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

class MockFileReader {
  onload: ((this: FileReader, ev: unknown) => unknown) | null = null;

  readAsText(): void {}

  abort() {}
  addEventListener() {}
  removeEventListener() {}
  dispatchEvent() {
    return true;
  }

  // Include static getters
  static get EMPTY() {
    return 0;
  }
  static get LOADING() {
    return 1;
  }
  static get DONE() {
    return 2;
  }
}

// Replace the global FileReader with our mock
Object.defineProperty(globalThis, "FileReader", {
  configurable: true,
  writable: true,
  value: MockFileReader,
});

jest.mock("lucide-react", () => ({
  Check: () => "MockedCheckIcon",
}));

window.matchMedia = (query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(() => true),
});
