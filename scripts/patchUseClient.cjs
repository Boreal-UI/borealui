const fs = require("fs");
const path = require("path");

const filesToPatch = [
  path.resolve(__dirname, "../dist/next/ThemeProvider.js"),
  path.resolve(__dirname, "../dist/next/index.js"),
];

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

filesToPatch.forEach(ensureUseClient);
