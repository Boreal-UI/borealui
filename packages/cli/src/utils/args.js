/* eslint-disable no-undef */
import { fail, printHelp, printVersion } from "./help.js";

export async function parseArgs(argv) {
  const options = {
    command: "init",
    cwd: undefined,
    framework: undefined,
    install: undefined,
    packageManager: undefined,
    dryRun: false,
    yes: false,
  };

  const rest = [...argv];
  const first = rest[0];

  if (first === "create" || first === "init" || first === "setup") {
    options.command = rest.shift();
  }

  while (rest.length > 0) {
    const arg = rest.shift();

    switch (arg) {
      case "--help":
      case "-h":
        printHelp();
        process.exit(0);
        return options;

      case "--version":
      case "-v":
        printVersion();
        process.exit(0);
        return options;

      case "--yes":
      case "-y":
        options.yes = true;
        break;

      case "--cwd":
      case "--project":
      case "--dir":
        options.cwd = rest.shift();
        break;

      case "--framework":
        options.framework = rest.shift();
        break;

      case "--dry-run":
      case "--check":
        options.dryRun = true;
        break;

      case "--install":
        options.install = true;
        break;

      case "--no-install":
        options.install = false;
        break;

      case "--package-manager":
        options.packageManager = rest.shift();
        break;

      default:
        if (arg?.startsWith("--")) {
          fail(`Unknown option: ${arg}`);
        }

        if (!options.cwd) {
          options.cwd = arg;
        } else {
          fail(`Unexpected argument: ${arg}`);
        }
    }
  }

  return options;
}
