const MATRIX = Object.freeze({
  "core-react-18": {
    kind: "core",
    node: "20",
    react: "18.2.0",
    reactDom: "18.2.0",
    reactTypes: "18.2.79",
    reactDomTypes: "18.2.25",
  },
  "core-react-19-node-20": {
    kind: "core",
    node: "20",
    react: "19.2.1",
    reactDom: "19.2.1",
    reactTypes: "19.1.1",
    reactDomTypes: "19.1.2",
  },
  "core-react-19-node-22": {
    kind: "core",
    node: "22",
    react: "19.2.1",
    reactDom: "19.2.1",
    reactTypes: "19.1.1",
    reactDomTypes: "19.1.2",
  },
  "next-13": {
    kind: "next",
    node: "20",
    react: "18.2.0",
    reactDom: "18.2.0",
    reactTypes: "18.2.79",
    reactDomTypes: "18.2.25",
    next: "13.5.11",
  },
  "next-15": {
    kind: "next",
    node: "20",
    react: "19.2.1",
    reactDom: "19.2.1",
    reactTypes: "19.1.1",
    reactDomTypes: "19.1.2",
    next: "15.5.26",
  },
  "next-16-node-20": {
    kind: "next",
    node: "20",
    react: "19.2.1",
    reactDom: "19.2.1",
    reactTypes: "19.1.1",
    reactDomTypes: "19.1.2",
    next: "16.3.6",
  },
  "next-16-node-22": {
    kind: "next",
    node: "22",
    react: "19.2.1",
    reactDom: "19.2.1",
    reactTypes: "19.1.1",
    reactDomTypes: "19.1.2",
    next: "16.3.6",
  },
  "cli-node-18": { kind: "cli", node: "18" },
  "cli-node-22": { kind: "cli", node: "22" },
});

const TOOL_VERSIONS = Object.freeze({
  typescript: "5.9.2",
  typesNode: "20.19.1",
  vite: "8.2.1",
  esbuild: "0.28.2",
  jsdom: "26.1.0",
  marked: "12.0.2",
});

function getFixture(name) {
  const fixture = MATRIX[name];
  if (!fixture) {
    throw new Error(
      `Unknown compatibility fixture ${JSON.stringify(name)}. Expected one of: ${Object.keys(MATRIX).join(", ")}`,
    );
  }
  return fixture;
}

function assertNodeBoundary(fixture, version = process.versions.node) {
  const actualMajor = version.split(".")[0];
  if (actualMajor !== fixture.node) {
    throw new Error(
      `Fixture requires Node ${fixture.node}.x, but resolved Node ${version}.`,
    );
  }
}

module.exports = { MATRIX, TOOL_VERSIONS, getFixture, assertNodeBoundary };
