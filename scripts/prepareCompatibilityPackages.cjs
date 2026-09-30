const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const outputDir = path.resolve(process.argv[2] ?? "");
if (!process.argv[2]) {
  throw new Error("Usage: node scripts/prepareCompatibilityPackages.cjs <output-directory>");
}

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const spawnOptions = { cwd: rootDir, stdio: "inherit", shell: process.platform === "win32" };
const packages = ["types", "core", "next", "docs", "cli"];

fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(outputDir, { recursive: true });

execFileSync(npmCommand, ["run", "build"], spawnOptions);
execFileSync(npmCommand, ["run", "stage:split-packages"], {
  ...spawnOptions,
});

const artifacts = {};
for (const packageName of packages) {
  const result = JSON.parse(
    execFileSync(
      npmCommand,
      [
        "pack",
        `./packages/${packageName}`,
        "--pack-destination",
        outputDir,
        "--json",
      ],
      { cwd: rootDir, encoding: "utf8", shell: process.platform === "win32" },
    ),
  );
  const filename = result[0]?.filename;
  if (!filename) throw new Error(`npm pack did not return a filename for ${packageName}.`);
  artifacts[packageName] = filename;
}

fs.writeFileSync(
  path.join(outputDir, "compatibility-artifacts.json"),
  `${JSON.stringify({ version: require("../package.json").version, artifacts }, null, 2)}\n`,
);
console.log(`Prepared compatibility tarballs in ${outputDir}`);
