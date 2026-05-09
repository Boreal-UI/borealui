const fs = require("fs");
const path = require("path");

const COMPONENTS_DIR = path.join(__dirname, "../src/components");

function hasFileCaseInsensitive(dir, expectedName) {
  if (!fs.existsSync(dir)) return false;

  return fs
    .readdirSync(dir)
    .some((file) => file.toLowerCase() === expectedName.toLowerCase());
}

function checkComponentStructure(componentName) {
  const componentDir = path.join(COMPONENTS_DIR, componentName);
  const coreDir = path.join(componentDir, "core");
  const nextDir = path.join(componentDir, "next");

  const required = [
    [componentDir, `${componentName}.types.ts`],
    [componentDir, `${componentName}Base.tsx`],
    [coreDir, `${componentName}.tsx`],
    [coreDir, `${componentName}.scss`],
    [nextDir, `${componentName}.tsx`],
    [nextDir, `${componentName}.module.scss`],
  ];

  const missing = required
    .filter(([dir, file]) => !hasFileCaseInsensitive(dir, file))
    .map(([dir, file]) => path.relative(componentDir, path.join(dir, file)));

  if (missing.length > 0) {
    console.warn(
      `Missing expected component files for ${componentName}: ${missing.join(", ")}`,
    );
    return false;
  }

  console.log(`${componentName}: structure is in sync.`);
  return true;
}

function runCheck() {
  const components = fs
    .readdirSync(COMPONENTS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  let allSynced = true;

  for (const component of components) {
    const result = checkComponentStructure(component);
    if (!result) allSynced = false;
  }

  if (!allSynced) {
    process.exitCode = 1;
  } else {
    console.log("All component structures are synced.");
  }
}

runCheck();
