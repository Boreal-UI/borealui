/* eslint-disable no-undef */
import { spawnSync } from "node:child_process";

export function runCommand(command, commandArgs, cwd, successMessage) {
  const result = spawnSync(command, commandArgs, {
    cwd,
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  if (result.status === 0) {
    console.log(successMessage);
    return;
  }

  console.warn(
    `Skipped: ${command} ${commandArgs.join(" ")} did not complete successfully.`,
  );
}
