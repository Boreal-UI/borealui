import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { DEFAULT_OPTIONS, FRAMEWORKS, PACKAGE_MANAGERS } from "./constants.js";
import { fail } from "./help.js";

export async function promptForOptions(options) {
  const rl = createInterface({ input, output });

  try {
    options.cwd = options.cwd || DEFAULT_OPTIONS.cwd;

    if (options.framework) {
      options.framework = normalizeFramework(options.framework);

      if (!FRAMEWORKS.has(options.framework)) {
        fail("Framework must be either react or next.");
      }
    }

    if (options.packageManager) {
      options.packageManager = normalizeChoice(
        options.packageManager,
        DEFAULT_OPTIONS.packageManager,
      );

      if (!PACKAGE_MANAGERS.has(options.packageManager)) {
        fail("Package manager must be npm, pnpm, yarn, or bun.");
      }
    }

    if (options.dryRun) {
      options.install = false;
    } else if (typeof options.install !== "boolean") {
      options.install = await promptBoolean(
        rl,
        "Run dependency install after applying changes?",
        DEFAULT_OPTIONS.install,
        options.yes,
      );
    }
  } finally {
    rl.close();
  }

  return options;
}

function normalizeChoice(value, fallback) {
  const cleaned = String(value || fallback)
    .trim()
    .toLowerCase();

  if (cleaned === "nextjs" || cleaned === "next.js") return "next";
  if (cleaned === "core" || cleaned === "react-core") return "react";

  return cleaned || fallback;
}

function normalizeFramework(value) {
  return normalizeChoice(value, "");
}

async function promptBoolean(rl, question, defaultValue, yes) {
  if (yes) return defaultValue;

  const suffix = defaultValue ? "Y/n" : "y/N";
  const answer = (await rl.question(`${question} (${suffix}): `))
    .trim()
    .toLowerCase();

  if (!answer) return defaultValue;

  return ["y", "yes", "true", "1"].includes(answer);
}
