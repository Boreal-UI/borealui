const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const attwEntry = path.join(
  rootDir,
  "node_modules",
  "@arethetypeswrong",
  "cli",
  "dist",
  "index.js",
);

function execNpm(args) {
  const npmExecPath = process.env.npm_execpath;

  if (npmExecPath) {
    return execFileSync(
      process.execPath,
      [npmExecPath, ...args],
      { cwd: rootDir, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
    );
  }

  return execFileSync(
    "npm",
    args,
    { cwd: rootDir, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
  );
}

const packages = [
  {
    dir: "packages/core",
    args: ["--profile", "esm-only", "--ignore-rules", "no-resolution"],
  },
  {
    dir: "packages/next",
    args: ["--profile", "esm-only", "--ignore-rules", "no-resolution"],
  },
  {
    dir: "packages/types",
    args: [
      "--profile",
      "esm-only",
      "--ignore-rules",
      "no-resolution",
      "internal-resolution-error",
    ],
  },
];

for (const item of packages) {
  const packageDir = path.join(rootDir, item.dir);
  const tarballName = execNpm(["pack", packageDir, "--silent"]).trim();
  const tarballPath = path.join(rootDir, tarballName);

  try {
    execFileSync(
      process.execPath,
      [attwEntry, tarballPath, ...item.args, "--quiet"],
      { cwd: rootDir, stdio: "inherit" },
    );
  } finally {
    fs.rmSync(tarballPath, { force: true });
  }
}
