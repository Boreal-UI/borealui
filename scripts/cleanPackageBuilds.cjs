const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const dryRun = process.argv.includes("--dry-run");
const cliSourceDir = path.resolve(rootDir, "packages", "cli", "src");

const generatedDirectories = [
  {
    label: "root build output",
    directory: path.resolve(rootDir, "dist"),
  },
  {
    label: "staged core package output",
    directory: path.resolve(rootDir, "packages", "core", "dist"),
  },
  {
    label: "staged Next package output",
    directory: path.resolve(rootDir, "packages", "next", "dist"),
  },
  {
    label: "staged types package output",
    directory: path.resolve(rootDir, "packages", "types", "dist"),
  },
];

const allowedDirectories = new Set(
  generatedDirectories.map(({ directory }) => path.normalize(directory)),
);

function assertSafeGeneratedDirectory(directory) {
  const normalized = path.normalize(path.resolve(directory));

  if (!allowedDirectories.has(normalized)) {
    throw new Error(`Refusing to remove unexpected directory: ${normalized}`);
  }

  if (
    normalized === path.normalize(rootDir) ||
    normalized === path.parse(normalized).root
  ) {
    throw new Error(`Refusing to remove broad directory: ${normalized}`);
  }

  if (
    normalized === path.normalize(cliSourceDir) ||
    cliSourceDir.startsWith(`${normalized}${path.sep}`)
  ) {
    throw new Error(`Refusing to remove CLI source directory: ${normalized}`);
  }
}

if (!fs.existsSync(cliSourceDir)) {
  throw new Error(`Expected CLI source directory is missing: ${cliSourceDir}`);
}

for (const { label, directory } of generatedDirectories) {
  assertSafeGeneratedDirectory(directory);

  if (!fs.existsSync(directory)) {
    console.log(`Already clean: ${label} (${directory})`);
    continue;
  }

  if (dryRun) {
    console.log(`Would remove: ${label} (${directory})`);
    continue;
  }

  fs.rmSync(directory, { recursive: true, force: true });
  console.log(`Removed: ${label} (${directory})`);
}

if (dryRun) {
  console.log("Dry run complete. No files were removed.");
} else {
  const remaining = generatedDirectories.filter(({ directory }) =>
    fs.existsSync(directory),
  );

  if (remaining.length > 0) {
    throw new Error(
      `Failed to clean generated directories: ${remaining
        .map(({ directory }) => directory)
        .join(", ")}`,
    );
  }

  console.log("Generated package build directories are clean.");
}
