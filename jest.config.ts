import type { Config } from "jest";

const config: Config = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@components/(.*)$": "<rootDir>/src/components/$1",
    "^@context/(.*)$": "<rootDir>/src/context/$1",
    "^@styles/(.*)$": "<rootDir>/src/styles/$1",
    "^@types/(.*)$": "<rootDir>/src/types/$1",
    "^@utils/(.*)$": "<rootDir>/src/utils/$1",
    "\\.(scss|sass|css)$": "identity-obj-proxy",
  },
  transformIgnorePatterns: ["/node_modules/(?!(marked)/)"],
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", { useESM: true }],
  },
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  preset: "ts-jest/presets/js-with-ts-esm",
  testMatch: ["<rootDir>/__tests__/**/*.(spec|test).[jt]s?(x)"],
};

export default config;
