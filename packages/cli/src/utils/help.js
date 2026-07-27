/* eslint-disable no-undef */
import { VERSION } from "./constants.js";

export function printHelp() {
  console.log(`Boreal UI CLI

Usage:
  boreal-ui init [project-directory] [options]
  boreal-ui setup [project-directory] [options]
  boreal-ui [project-directory] [options]

Options:
  --cwd, --project, --dir <path>  Project directory to configure
  --framework <react|next>        Select React core or Next.js output
  --dry-run, --check              Show planned edits without writing files
  --install                       Run dependency install after edits (default)
  --package-manager <name>        npm, pnpm, yarn, or bun
  --recommended-globals           Add a Boreal-safe Next globals.css baseline without prompting
  --no-recommended-globals        Skip the recommended Next globals.css prompt/change
  --agents-guide                  Add an optional Boreal UI AGENTS.md guide
  --no-agents-guide               Do not add an AGENTS.md guide (default)
  --no-install                    Skip dependency installation
  --yes, -y                       Apply recommended edits without prompts
  --help, -h                      Show this help message
  --version, -v                   Show CLI version

The CLI configures an existing React or Next.js app. It adds the split Boreal UI
dependency for the selected framework, imports the correct globals.css entry,
and wraps the app in ThemeProvider. Components inherit Boreal's current defaults;
custom defaults can be added later with borealConfig.
`);
}

export function fail(message) {
  console.error(`\n${message}`);
  console.error("Run boreal-ui --help for usage.");
  process.exit(1);
}

export function printVersion() {
  console.log(VERSION);
}
