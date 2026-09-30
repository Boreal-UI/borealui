#!/usr/bin/env node

const { generateComponent } = require("./addComponent.cjs");

function parseLegacyArgs(argv) {
  const [command, ...generatorArgs] = argv;

  if (command !== "new") {
    throw new Error(
      "Please use: npm run boreal new [ComponentName] [--dry-run] [--skip-exports]",
    );
  }

  return generatorArgs;
}

module.exports = { parseLegacyArgs };

if (require.main === module) {
  try {
    generateComponent(parseLegacyArgs(process.argv.slice(2)));
  } catch (error) {
    console.error(`❌ ${error.message}`);
    process.exitCode = 1;
  }
}
