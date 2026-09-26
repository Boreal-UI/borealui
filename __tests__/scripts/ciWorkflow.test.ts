import { readFileSync } from "fs";
import path from "path";

describe("CI Cypress component-test gate", () => {
  const workflow = readFileSync(
    path.join(process.cwd(), ".github", "workflows", "ci.yml"),
    "utf8",
  );
  const cypressJob = workflow.match(
    /\n  cypress-component:\n([\s\S]*?)(?=\n  [a-z][a-z-]+:\n|$)/,
  )?.[1];

  it("runs the canonical Cypress command for pull-request CI", () => {
    expect(workflow).toContain("pull_request:");
    expect(cypressJob).toBeDefined();
    expect(cypressJob).toContain("name: Cypress Component Tests");
    expect(cypressJob).toContain("runs-on: ubuntu-latest");
    expect(cypressJob).toContain("node-version: 20");
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
});
