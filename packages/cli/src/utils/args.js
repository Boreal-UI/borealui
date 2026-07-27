/* eslint-disable no-undef */
import { fail, printHelp, printVersion } from "./help.js";

export async function parseArgs(argv) {
  const options = {
    command: "init",
    cwd: undefined,
    framework: undefined,
    install: undefined,
    packageManager: undefined,
    recommendedGlobals: undefined,
    addAgentsGuide: false,
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
        options.cwd = readOptionValue(rest, arg);
        break;

      case "--framework":
        options.framework = readOptionValue(rest, arg);
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
        options.packageManager = readOptionValue(rest, arg);
        break;

      case "--recommended-globals":
        options.recommendedGlobals = true;
        break;

      case "--no-recommended-globals":
        options.recommendedGlobals = false;
        break;

      case "--agents-guide":
        options.addAgentsGuide = true;
        break;

      case "--no-agents-guide":
        options.addAgentsGuide = false;
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

function readOptionValue(rest, option) {
  const value = rest.shift();

  if (!value || value.startsWith("--")) {
    fail(`${option} requires a value.`);
  }

  return value;
}
