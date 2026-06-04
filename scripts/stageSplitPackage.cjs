const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const rootPackage = JSON.parse(
  fs.readFileSync(path.join(rootDir, "package.json"), "utf8"),
);
const packageNames = new Set(["core", "next", "types", "cli"]);
const requestedPackage = process.argv[2] ?? "all";

if (requestedPackage !== "all" && !packageNames.has(requestedPackage)) {
  throw new Error(
    "Usage: node scripts/stageSplitPackage.cjs [core|next|types|cli|all]",
  );
}

const selectedPackages =
  requestedPackage === "all" ? Array.from(packageNames) : [requestedPackage];

function assertBuildExists(packageName) {
  if (packageName === "cli") return;

  const typesDist = path.join(rootDir, "dist", "types");
  const runtimeDist =
    packageName === "types" ? typesDist : path.join(rootDir, "dist", packageName);

  if (!fs.existsSync(runtimeDist) || !fs.existsSync(typesDist)) {
    throw new Error(
      `Missing dist output for ${packageName}. Run npm run build before staging split packages.`,
    );
  }
}

function copyDirectory(from, to) {
  fs.rmSync(to, { recursive: true, force: true });
  fs.cpSync(from, to, { recursive: true });
}

function copyFileIfExists(from, to) {
  if (!fs.existsSync(from)) return;
  fs.copyFileSync(from, to);
}

function writeEmptyRuntimeStub(packageDistDir) {
  fs.writeFileSync(
    path.join(packageDistDir, "empty.js"),
    "export {};\n",
  );
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2) + "\n");
}

function syncPackageVersion(packageDir) {
  const packageJsonPath = path.join(packageDir, "package.json");
  const packageJson = readJson(packageJsonPath);

  packageJson.version = rootPackage.version;

  if (packageJson.peerDependencies?.["@boreal-ui/types"]) {
    packageJson.peerDependencies["@boreal-ui/types"] = rootPackage.version;
  }

  writeJson(packageJsonPath, packageJson);
}

function syncCliVersion() {
  const constantsPath = path.join(
    rootDir,
    "packages",
    "cli",
    "src",
    "utils",
    "constants.js",
  );
  const source = fs.readFileSync(constantsPath, "utf8");
  const nextSource = source.replace(
    /export const VERSION = ".*?";/,
    `export const VERSION = "${rootPackage.version}";`,
  );

  fs.writeFileSync(constantsPath, nextSource);
}

function stageTypesPackage() {
  assertBuildExists("types");

  const packageDir = path.join(rootDir, "packages", "types");
  const packageDistDir = path.join(packageDir, "dist");

  syncPackageVersion(packageDir);

  fs.rmSync(packageDistDir, { recursive: true, force: true });
  fs.mkdirSync(packageDistDir, { recursive: true });

  copyDirectory(path.join(rootDir, "dist", "types"), path.join(packageDistDir, "types"));
  writeEmptyRuntimeStub(packageDistDir);
  copyFileIfExists(path.join(rootDir, "LICENSE"), path.join(packageDir, "LICENSE"));

  console.log("Staged @boreal-ui/types package output.");
}

function writeTypeProxy(filePath, packageSpecifier, originalTypesPath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });

  const originalSource = fs.existsSync(originalTypesPath)
    ? fs.readFileSync(originalTypesPath, "utf8")
    : "";
  const shouldReExportDefault =
    /export\s+\{\s*default\b/.test(originalSource) ||
    /export\s+default\b/.test(originalSource);
  const lines = [];

  if (shouldReExportDefault) {
    lines.push(`export { default } from "${packageSpecifier}";`);
  }

  lines.push(`export * from "${packageSpecifier}";`);

  fs.writeFileSync(filePath, `${lines.join("\n")}\n`);
}

function stageRuntimeTypes(packageDistDir, flavor) {
  const sourceTypesDir = path.join(rootDir, "dist", "types", flavor);
  const targetTypesDir = path.join(packageDistDir, "types", flavor);

  fs.mkdirSync(targetTypesDir, { recursive: true });

  writeTypeProxy(
    path.join(packageDistDir, "types", "index.d.ts"),
    `@boreal-ui/types/${flavor}`,
    path.join(rootDir, "dist", "types", `index.${flavor}.d.ts`),
  );
  writeTypeProxy(
    path.join(packageDistDir, "types", "public.types.d.ts"),
    "@boreal-ui/types",
    path.join(rootDir, "dist", "types", "public.types.d.ts"),
  );

  for (const file of fs.readdirSync(sourceTypesDir)) {
    if (!file.endsWith(".d.ts")) continue;

    const name = file.replace(/\.d\.ts$/, "");
    writeTypeProxy(
      path.join(targetTypesDir, file),
      `@boreal-ui/types/${flavor}/${name}`,
      path.join(sourceTypesDir, file),
    );
  }
}

function stageRuntimePackage(flavor) {
  assertBuildExists(flavor);

  const packageDir = path.join(rootDir, "packages", flavor);
  const packageDistDir = path.join(packageDir, "dist");

  syncPackageVersion(packageDir);

  fs.rmSync(packageDistDir, { recursive: true, force: true });
  fs.mkdirSync(packageDistDir, { recursive: true });

  copyDirectory(
    path.join(rootDir, "dist", flavor),
    path.join(packageDistDir, flavor),
  );
  stageRuntimeTypes(packageDistDir, flavor);
  writeEmptyRuntimeStub(packageDistDir);
  copyFileIfExists(path.join(rootDir, "LICENSE"), path.join(packageDir, "LICENSE"));

  console.log(`Staged @boreal-ui/${flavor} package output.`);
}

function stageCliPackage() {
  const packageDir = path.join(rootDir, "packages", "cli");

  syncPackageVersion(packageDir);
  syncCliVersion();
  copyFileIfExists(path.join(rootDir, "LICENSE"), path.join(packageDir, "LICENSE"));

  console.log("Staged @boreal-ui/cli package metadata.");
}

for (const packageName of selectedPackages) {
  if (packageName === "types") stageTypesPackage();
  else if (packageName === "cli") stageCliPackage();
  else stageRuntimePackage(packageName);
}
