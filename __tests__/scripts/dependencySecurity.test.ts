import { execFileSync } from "node:child_process";
import path from "node:path";

it("preserves coverage/glob behavior and rejects known vulnerable dependency versions and inputs", () => {
  const output = execFileSync(process.execPath, [path.join(process.cwd(), "scripts/checkDependencySecurity.cjs")], {
    cwd: process.cwd(), encoding: "utf8", timeout: 20000,
  });
  expect(output).toContain("Dependency security and glob/coverage compatibility checks passed");
}, 25000);
