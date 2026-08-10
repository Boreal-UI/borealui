const fs = require("fs");
const path = require("path");
const { updateFileSync } = require("./safeFileUpdates.cjs");

const nextDistDir = path.resolve(__dirname, "../dist/next");
const nonClientEntries = new Set([
  "colorSchemes.js",
  "globals.js",
  "registerColorScheme.js",
  "registerColorSheme.js",
]);

function getFilesToPatch() {
  if (!fs.existsSync(nextDistDir)) return [];

  return fs
    .readdirSync(nextDistDir)
    .filter((file) => file.endsWith(".js"))
    .filter((file) => !file.includes("-"))
    .filter((file) => !nonClientEntries.has(file))
    .map((file) => path.join(nextDistDir, file));
}

function ensureUseClient(filePath) {
  try {
    const changed = updateFileSync(filePath, (content) => {
      if (
        content.startsWith('"use client";') ||
        content.startsWith("'use client';")
      ) {
        return content;
      }

      return `"use client";\n${content}`;
    });

    console.log(
      `${changed ? "Patched" : "Already patched"}: ${path.basename(filePath)}`,
    );
  } catch (error) {
    if (error?.code === "ENOENT") {
      console.warn(`Skipped missing file: ${filePath}`);
      return;
    }
    throw error;
  }
}

getFilesToPatch().forEach(ensureUseClient);
