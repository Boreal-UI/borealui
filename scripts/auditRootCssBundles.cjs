const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const flavors = ["core", "next"];

function getCssAssets(buildResult) {
  const outputs = Array.isArray(buildResult) ? buildResult : [buildResult];

  return outputs.flatMap((output) =>
    output.output.filter(
      (entry) => entry.type === "asset" && entry.fileName.endsWith(".css"),
    ),
  );
}

function getAssetSourceLength(asset) {
  return Buffer.byteLength(
    typeof asset.source === "string" ? asset.source : Buffer.from(asset.source),
  );
}

async function auditFlavor(flavor, viteBuild) {
  const virtualEntryId = `virtual:boreal-${flavor}-root-css-audit`;
  const resolvedVirtualEntryId = `\0${virtualEntryId}`;
  const rootEntrypoint = path
    .join(rootDir, "dist", flavor, "index.js")
    .replace(/\\/g, "/");
  const buttonCssPath = path.join(rootDir, "dist", flavor, "Button.css");
  const buttonCssSize = fs.statSync(buttonCssPath).size;
  const result = await viteBuild({
    configFile: false,
    logLevel: "silent",
    root: rootDir,
    plugins: [
      {
        name: "boreal-root-css-audit-entry",
        resolveId(id) {
          return id === virtualEntryId ? resolvedVirtualEntryId : undefined;
        },
        load(id) {
          if (id !== resolvedVirtualEntryId) return undefined;

          return `import { Button } from ${JSON.stringify(rootEntrypoint)};\nconsole.log(Button);`;
        },
      },
    ],
    build: {
      cssCodeSplit: true,
      emptyOutDir: false,
      minify: false,
      rollupOptions: {
        input: virtualEntryId,
        external: (id) =>
          !id.startsWith(".") &&
          !path.isAbsolute(id) &&
          !id.startsWith("\0") &&
          id !== virtualEntryId,
        treeshake: {
          moduleSideEffects: (id) => {
            if (id.endsWith(".css")) return true;
            if (id.startsWith(path.join(rootDir, "dist", flavor))) return false;
            return null;
          },
        },
      },
      write: false,
    },
  });
  const cssAssets = getCssAssets(result);
  const emittedCssSize = cssAssets.reduce(
    (total, asset) => total + getAssetSourceLength(asset),
    0,
  );
  const maximumScopedCssSize = buttonCssSize + 1024;

  if (cssAssets.length === 0) {
    throw new Error(
      `${flavor} root Button import did not emit its Button.css sidecar.`,
    );
  }

  if (emittedCssSize > maximumScopedCssSize) {
    throw new Error(
      `${flavor} root Button import emitted ${emittedCssSize} CSS bytes; ` +
        `expected no more than ${maximumScopedCssSize} for Button.css ownership.`,
    );
  }

  console.log(
    `${flavor} root Button import emitted ${emittedCssSize} scoped CSS bytes.`,
  );
}

async function main() {
  const { build: viteBuild } = await import("vite");
  await Promise.all(flavors.map((flavor) => auditFlavor(flavor, viteBuild)));
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});

module.exports = {
  getAssetSourceLength,
  getCssAssets,
};
