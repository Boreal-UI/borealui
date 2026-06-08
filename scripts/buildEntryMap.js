import fs from "fs";
import path from "path";

export default function getEntryMap(dir) {
  const entryDir = path.resolve(process.cwd(), dir);
  const entries = {};

  function addEntries(currentDir, prefix = "") {
    fs.readdirSync(currentDir, { withFileTypes: true }).forEach((dirent) => {
      const fullPath = path.join(currentDir, dirent.name);

      if (dirent.isDirectory()) {
        addEntries(fullPath, `${prefix}${dirent.name}/`);
        return;
      }

      if (dirent.name.endsWith(".ts") || dirent.name.endsWith(".tsx")) {
        const name = `${prefix}${dirent.name.replace(/\.(ts|tsx)$/, "")}`;
        entries[name] = fullPath;
      }
    });
  }

  addEntries(entryDir);
  return entries;
}
