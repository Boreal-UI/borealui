const fs = require("fs");
const path = require("path");
const { updateFileSync } = require("./safeFileUpdates.cjs");

const rootDir = path.resolve(__dirname, "..");
const nextVersion = process.argv[2];
const packageDir = path.join(rootDir, "packages");
const internalPackagePattern = /^@boreal-ui\//;

function usage() {
  console.error("Usage: npm run version:packages -- <version>");
  console.error("Example: npm run version:packages -- 0.1.0-alpha.1");
}

function assertVersion(version) {
  if (!version) {
    usage();
    process.exit(1);
  }

  const semverPattern =
    /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/;

  if (!semverPattern.test(version)) {
    console.error(`Invalid semver version: ${version}`);
    usage();
    process.exit(1);
  }
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, value) {
  updateFileSync(filePath, () => `${JSON.stringify(value, null, 2)}\n`);
}

function updateInternalDependencyVersions(packageJson) {
  for (const field of [
    "dependencies",
    "devDependencies",
    "peerDependencies",
    "optionalDependencies",
  ]) {
    const dependencies = packageJson[field];

    if (!dependencies) continue;

    for (const dependencyName of Object.keys(dependencies)) {
      if (internalPackagePattern.test(dependencyName)) {
        dependencies[dependencyName] = nextVersion;
      }
    }
  }
}

function updatePackageJson(filePath) {
  const packageJson = readJson(filePath);

  packageJson.version = nextVersion;
  updateInternalDependencyVersions(packageJson);
  writeJson(filePath, packageJson);

  return packageJson.name;
}

function getPackageJsonPaths() {
  const paths = [path.join(rootDir, "package.json")];

  for (const entry of fs.readdirSync(packageDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;

    const packageJsonPath = path.join(packageDir, entry.name, "package.json");

    if (fs.existsSync(packageJsonPath)) {
      paths.push(packageJsonPath);
    }
  }

  return paths;
}

function updatePackageLock() {
  const lockPath = path.join(rootDir, "package-lock.json");

  if (!fs.existsSync(lockPath)) return false;

  const packageLock = readJson(lockPath);

  packageLock.version = nextVersion;

  if (packageLock.packages?.[""]) {
    packageLock.packages[""].version = nextVersion;
  }

  writeJson(lockPath, packageLock);

  return true;
}

function updateCliVersionConstant() {
  const constantsPath = path.join(
    rootDir,
    "packages",
    "cli",
    "src",
    "utils",
    "constants.js",
  );

  try {
    return updateFileSync(constantsPath, (source) =>
      source.replace(
        /export const VERSION = ".*?";/,
        `export const VERSION = "${nextVersion}";`,
      ),
    );
  } catch (error) {
    if (error?.code === "ENOENT") return false;
    throw error;
  }
}

assertVersion(nextVersion);

const updatedPackages = getPackageJsonPaths().map(updatePackageJson);
const updatedLockfile = updatePackageLock();
const updatedCliConstant = updateCliVersionConstant();

console.log(`Updated Boreal UI package versions to ${nextVersion}.`);
console.log(`Package manifests: ${updatedPackages.join(", ")}`);
console.log(`package-lock.json: ${updatedLockfile ? "updated" : "not found"}`);
console.log(
  `CLI version constant: ${updatedCliConstant ? "updated" : "already current"}`,
);
