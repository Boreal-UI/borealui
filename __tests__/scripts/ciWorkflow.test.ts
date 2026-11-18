import { readFileSync } from "fs";
import path from "path";

describe("CI Cypress component-test gate", () => {
  const workflow = readFileSync(
    path.join(process.cwd(), ".github", "workflows", "ci.yml"),
    "utf8",
  ).replace(/\r\n/g, "\n");
  const cypressJob = workflow.match(
    /\n  cypress-component:\n([\s\S]*?)(?=\n  [a-z][a-z-]+:\n|$)/,
  )?.[1];

  it("runs the canonical Cypress command for pull-request CI", () => {
    expect(workflow).toContain("pull_request:");
    expect(cypressJob).toBeDefined();
    expect(cypressJob).toContain("name: Cypress Component Tests");
    expect(cypressJob).toContain("runs-on: ubuntu-latest");
    expect(cypressJob).toContain("node-version: 24");
    expect(cypressJob).toContain("- run: npm ci");
    expect(cypressJob).not.toContain("npm ci --ignore-scripts");
    expect(cypressJob).toContain("- run: npm run cypress:run");
    expect(cypressJob).not.toContain("needs:");
  });

  it("fails closed without publication credentials", () => {
    expect(cypressJob).not.toContain("continue-on-error");
    expect(cypressJob).not.toMatch(/secrets\.|NPM_TOKEN|NODE_AUTH_TOKEN/);
  });

  it("uploads screenshots only when the browser job fails", () => {
    expect(cypressJob).toContain("if: failure()");
    expect(cypressJob).toContain("uses: actions/upload-artifact@v4");
    expect(cypressJob).toContain("path: cypress/screenshots");
    expect(cypressJob).toContain("if-no-files-found: ignore");
  });

  it("enforces the packed consumer compatibility matrix", () => {
    expect(workflow).toContain("name: Compatibility package artifacts");
    expect(workflow).toContain("npm run compat:pack");
    expect(workflow).toContain("fixture: core-react-18");
    expect(workflow).toContain("fixture: next-13");
    expect(workflow).toContain("fixture: next-16-node-22");
    expect(workflow).toContain("fixture: cli-node-18");
    expect(workflow).toContain("name: Published compatibility");
    expect(workflow).toContain("npm run compat:test");
  });

  it("uses Node 24 tooling while preserving consumer runtime coverage", () => {
    const securityWorkflow = readFileSync(
      path.join(process.cwd(), ".github", "workflows", "security.yml"), "utf8",
    );
    for (const source of [workflow, securityWorkflow]) {
      const fixedRuntimes = [...source.matchAll(/node-version: (\d[^\r\n]*)/g)];
      expect(fixedRuntimes.length).toBeGreaterThan(0);
      expect(fixedRuntimes.every((match) => match[1] === "24")).toBe(true);
    }
    expect(workflow).toContain("node-version: ${{ matrix.node }}");
    expect(workflow).toContain("node: 18.20.8");
    expect(workflow).toContain("node: 20.19.0");
    expect(workflow).toContain("node: 22.12.0");
  });

  it("keeps Storybook builds separate from curated visual regression", () => {
    expect(workflow).toContain("name: Storybook builds");
    expect(workflow).toContain("npm run storybook:build:core");
    expect(workflow).toContain("npm run storybook:build:next");
    expect(workflow).toContain("name: Visual Regression");
    expect(workflow).toContain("npm run storybook:build:visual");
    expect(workflow).toContain("CHROMATIC_PROJECT_TOKEN_VISUAL");
    expect(workflow).toContain("if: env.CHROMATIC_PROJECT_TOKEN != ''");
    expect(workflow).toContain("if: env.CHROMATIC_PROJECT_TOKEN == ''");
    expect(workflow).not.toContain("--auto-accept-changes");
  });
});
