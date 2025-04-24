import "@testing-library/jest-dom";
import "jest-styled-components";

import { TextEncoder, TextDecoder as NodeTextDecoder } from "util";

// Set up TextEncoder and TextDecoder globals
globalThis.TextEncoder = TextEncoder as typeof globalThis.TextEncoder;
globalThis.TextDecoder =
  NodeTextDecoder as unknown as typeof globalThis.TextDecoder;

// Mock matchMedia
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

// Mock ResizeObserver
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

// Mock FileReader with proper functionality for QR scanner tests
class MockFileReader {
  onload: ((this: FileReader, ev: ProgressEvent<FileReader>) => void) | null =
    null;
  onerror: ((this: FileReader, ev: ProgressEvent<FileReader>) => void) | null =
    null;
  readyState = 0;
  result: string | ArrayBuffer | null = null;

  readAsDataURL(blob: Blob): void {
    // Simulate asynchronous file reading
    setTimeout(() => {
      this.readyState = MockFileReader.DONE;
      this.result = "data:image/png;base64,mockdata";

      if (this.onload) {
        const event = {
          target: this,
          lengthComputable: true,
          loaded: blob.size,
          total: blob.size,
        } as unknown as ProgressEvent<FileReader>;

        this.onload.call(this, event);
      }
    }, 0);
  }

  readAsText(blob: Blob, encoding?: string): void {
    setTimeout(() => {
      this.readyState = MockFileReader.DONE;
      this.result = "mock text content";

      if (this.onload) {
        const event = {
          target: this,
          lengthComputable: true,
          loaded: blob.size,
          total: blob.size,
        } as unknown as ProgressEvent<FileReader>;

        this.onload.call(this, event);
      }
    }, 0);
  }

  readAsArrayBuffer(blob: Blob): void {
    setTimeout(() => {
      this.readyState = MockFileReader.DONE;
      // Create a mock ArrayBuffer
      this.result = new ArrayBuffer(blob.size);

      if (this.onload) {
        const event = {
          target: this,
          lengthComputable: true,
          loaded: blob.size,
          total: blob.size,
        } as unknown as ProgressEvent<FileReader>;

        this.onload.call(this, event);
      }
    }, 0);
  }

  abort() {
    this.readyState = MockFileReader.DONE;
  }

  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject
  ) {}
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject
  ) {}
  dispatchEvent() {
    return true;
  }

  // Static properties
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

// Mock MediaStream for camera tests
class MockMediaStream {
  private tracks: MediaStreamTrack[] = [
    { stop: jest.fn() } as unknown as MediaStreamTrack,
  ];

  getTracks() {
    return this.tracks;
  }

  getVideoTracks() {
    return this.tracks;
  }

  getAudioTracks() {
    return [];
  }
}

// Mock navigator.mediaDevices
Object.defineProperty(global.navigator, "mediaDevices", {
  value: {
    getUserMedia: jest.fn().mockImplementation(() => {
      return Promise.resolve(new MockMediaStream());
    }),
  },
  configurable: true,
});

// Mock other commonly used libraries/components
jest.mock("lucide-react", () => ({
  Check: () => "MockedCheckIcon",
  Camera: () => "MockedCameraIcon",
  Upload: () => "MockedUploadIcon",
  X: () => "MockedXIcon",
  // Add other icons as needed
}));

// Mock for HTMLVideoElement
class MockHTMLVideoElement extends HTMLElement {
  srcObject: MediaStream | null = null;
  play = jest.fn().mockResolvedValue(undefined);
  pause = jest.fn();

  // Add any other video properties/methods you need
}

// Register the custom element
customElements.define("mock-video", MockHTMLVideoElement);

// Override createElement to return our mock for video elements
const originalCreateElement = document.createElement.bind(document);
document.createElement = function (
  tagName: string,
  options?: ElementCreationOptions
): HTMLElement {
  if (tagName.toLowerCase() === "video") {
    return new MockHTMLVideoElement();
  }
  return originalCreateElement(tagName, options);
};

// Mock fetch
global.fetch = jest.fn().mockImplementation(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(""),
    blob: () => Promise.resolve(new Blob()),
  })
);

global.import = {};
global.import.meta = {
  env: {
    VITE_FIREBASE_API_KEY: "test-api-key",
    VITE_FIREBASE_AUTH_DOMAIN: "test-auth-domain",
    VITE_FIREBASE_PROJECT_ID: "test-project-id",
    VITE_FIREBASE_STORAGE_BUCKET: "test-storage-bucket",
    VITE_FIREBASE_MESSAGING_SENDER_ID: "test-messaging-sender-id",
    VITE_FIREBASE_APP_ID: "test-app-id",
    VITE_FIREBASE_MEASUREMENT_ID: "test-measurement-id",
  },
};
