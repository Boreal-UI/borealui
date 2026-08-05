const fs = require("fs");
const path = require("path");

const nextDistDir = path.resolve(__dirname, "../dist/next");
const nonClientEntries = new Set([
  "colorSchemes.js",
  "docs.js",
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
  if (!fs.existsSync(filePath)) {
    console.warn(`Skipped missing file: ${filePath}`);
    return;
  }

  const content = fs.readFileSync(filePath, "utf8");

  if (
    content.startsWith('"use client";') ||
    content.startsWith("'use client';")
  ) {
    console.log(`Already patched: ${path.basename(filePath)}`);
    return;
  }

  fs.writeFileSync(filePath, `"use client";\n${content}`, "utf8");
  console.log(`Patched: ${path.basename(filePath)}`);
}

getFilesToPatch().forEach(ensureUseClient);
