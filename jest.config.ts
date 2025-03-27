import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jest-environment-jsdom",
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  transformIgnorePatterns: [
    "<rootDir>/node_modules/(?!lucide-react|some-other-library/)",
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
    "^@/assets/(.*)$": "<rootDir>/src/__mocks__/fileMock.js",
    "^@/components/(.*)$": "<rootDir>/src/components/$1",
    "^firebase/firestore$": "<rootDir>/__mocks__/firestore.ts",
    "^firebase/auth$": "<rootDir>/__mocks__/auth.ts",
    "^@/firebase/firebase$": "<rootDir>/__mocks__/app.ts",
    "^papaparse$": "<rootDir>/__mocks__/papaparse.ts",
    "^sonner$": "<rootDir>/__mocks__/sonner.ts",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts", "jest-styled-components"],

  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  verbose: true,
};

export default config;
