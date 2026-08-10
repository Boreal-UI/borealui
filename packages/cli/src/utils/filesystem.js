import { spawnSync } from "node:child_process";
import { constants, existsSync, realpathSync } from "node:fs";
import { accessSync } from "node:fs";
import { delimiter, extname, isAbsolute, join, relative, resolve } from "node:path";

const WINDOWS_COMMAND_EXTENSIONS = [".COM", ".EXE", ".BAT", ".CMD"];
const WINDOWS_SHELL_METACHARACTERS = /[%!"^&|<>()\r\n]/;

function isInsideDirectory(directory, candidate) {
  const relativePath = relative(directory, candidate);
  return (
    relativePath === "" ||
    (!relativePath.startsWith("..") && !isAbsolute(relativePath))
  );
}

function resolveTrustedCommand(command, cwd) {
  if (!/^[a-z\d._-]+$/i.test(command)) return undefined;

  const projectRoot = existsSync(cwd) ? realpathSync(cwd) : resolve(cwd);
  const pathEntries = (process.env.PATH ?? "")
    .split(delimiter)
    .map((entry) => entry.trim().replace(/^"|"$/g, ""))
    .filter((entry) => entry && isAbsolute(entry));
  const extensions =
    process.platform === "win32"
      ? WINDOWS_COMMAND_EXTENSIONS
      : [""];

  for (const pathEntry of pathEntries) {
    for (const extension of extensions) {
      const candidate = join(pathEntry, `${command}${extension}`);
      if (!existsSync(candidate)) continue;

      try {
        if (process.platform !== "win32") accessSync(candidate, constants.X_OK);
        const realCandidate = realpathSync(candidate);
        if (!isInsideDirectory(projectRoot, realCandidate)) return realCandidate;
      } catch {
        // Ignore inaccessible PATH entries and continue to the next candidate.
      }
    }
  }

  return undefined;
}

function getSpawnInvocation(command, commandArgs, cwd) {
  const executable = resolveTrustedCommand(command, cwd);
  if (!executable) return undefined;

  if (process.platform !== "win32" || ![".cmd", ".bat"].includes(extname(executable).toLowerCase())) {
    return { executable, args: commandArgs };
  }

  if (
    WINDOWS_SHELL_METACHARACTERS.test(executable) ||
    commandArgs.some(
      (arg) => typeof arg !== "string" || WINDOWS_SHELL_METACHARACTERS.test(arg),
    )
  ) {
    return undefined;
  }

  const systemRoot = process.env.SystemRoot;
  if (!systemRoot || !isAbsolute(systemRoot)) return undefined;

  const commandProcessor = join(systemRoot, "System32", "cmd.exe");
  if (!existsSync(commandProcessor)) return undefined;

  const commandLine = [`"${executable}"`, ...commandArgs.map((arg) => `"${arg}"`)].join(" ");
  return {
    executable: realpathSync(commandProcessor),
    args: ["/d", "/s", "/c", commandLine],
  };
}

export function runCommand(command, commandArgs, cwd, successMessage) {
  const invocation = getSpawnInvocation(command, commandArgs, cwd);

  if (!invocation) {
    console.warn(`Skipped: could not resolve a trusted ${command} executable.`);
    return;
  }

  const result = spawnSync(invocation.executable, invocation.args, {
    cwd,
    stdio: "inherit",
    shell: false,
  });

  if (result.status === 0) {
    console.log(successMessage);
    return;
  }

  const commandDisplay = [command, ...commandArgs].join(" ");
  console.warn(`Skipped: ${commandDisplay} did not complete successfully.`);
}
