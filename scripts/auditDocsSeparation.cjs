const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const errors = [];

function assertMissing(relativePath) {
  if (fs.existsSync(path.join(rootDir, relativePath))) {
    errors.push(`unexpected docs payload: ${relativePath}`);
  }
}

function assertPresent(relativePath) {
  if (!fs.existsSync(path.join(rootDir, relativePath))) {
    errors.push(`missing docs package payload: ${relativePath}`);
  }
}

function readPackage(packageName) {
  const packagePath = path.join(rootDir, "packages", packageName, "package.json");
  return JSON.parse(fs.readFileSync(packagePath, "utf8"));
}

for (const flavor of ["core", "next"]) {
  assertMissing(`dist/${flavor}/docs.js`);
  assertMissing(`packages/${flavor}/dist/${flavor}/docs.js`);

  if (readPackage(flavor).exports?.["./docs"]) {
    errors.push(`packages/${flavor}/package.json still exports ./docs`);
  }
}

assertMissing("packages/types/dist/types/generated-docs");

const typesExports = readPackage("types").exports ?? {};
for (const exportPath of Object.keys(typesExports)) {
  if (exportPath.includes("docs")) {
    errors.push(`packages/types/package.json still exports ${exportPath}`);
  }
}

assertPresent("dist/docs/index.js");
assertPresent("dist/types/docs/index.d.ts");
assertPresent("dist/types/generated-docs/index.d.ts");
assertPresent("packages/docs/dist/docs/index.js");
assertPresent("packages/docs/dist/types/docs/index.d.ts");
assertPresent("packages/docs/dist/types/generated-docs/index.d.ts");

const docsPackage = readPackage("docs");
if (docsPackage.dependencies || docsPackage.peerDependencies) {
  errors.push("@boreal-ui/docs must remain optional and self-contained");
}

if (errors.length > 0) {
  console.error(
    ["Docs package separation audit failed:", ...errors.map((error) => `- ${error}`)].join(
      "\n",
    ),
  );
  process.exitCode = 1;
} else {
  console.log("Docs metadata is isolated in the optional @boreal-ui/docs package.");
}
