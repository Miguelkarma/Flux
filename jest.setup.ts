import "@testing-library/jest-dom";

import { TextEncoder, TextDecoder as NodeTextDecoder } from "util";

globalThis.TextEncoder = TextEncoder as typeof globalThis.TextEncoder;
globalThis.TextDecoder =
  NodeTextDecoder as unknown as typeof globalThis.TextDecoder;
