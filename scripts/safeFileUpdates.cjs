const fs = require("fs");

function writeToDescriptor(fileDescriptor, content, encoding) {
  fs.ftruncateSync(fileDescriptor, 0);
  fs.writeSync(fileDescriptor, content, 0, encoding);
}

function updateFileSync(
  filePath,
  updater,
  { encoding = "utf8", create = false } = {},
) {
  let fileDescriptor;

  try {
    fileDescriptor = fs.openSync(filePath, "r+");
  } catch (error) {
    if (!create || error?.code !== "ENOENT") throw error;

    try {
      fileDescriptor = fs.openSync(filePath, "wx");
    } catch (createError) {
      if (createError?.code === "EEXIST") {
        return updateFileSync(filePath, updater, { encoding, create: false });
      }
      throw createError;
    }
  }

  try {
    const current = fs.readFileSync(fileDescriptor, encoding);
    const next = updater(current);

    if (next === current) return false;

    writeToDescriptor(fileDescriptor, next, encoding);
    return true;
  } finally {
    fs.closeSync(fileDescriptor);
  }
}

function overwriteFileSync(filePath, content, encoding = "utf8") {
  const fileDescriptor = fs.openSync(filePath, "r+");

  try {
    writeToDescriptor(fileDescriptor, content, encoding);
  } finally {
    fs.closeSync(fileDescriptor);
  }
}

module.exports = { overwriteFileSync, updateFileSync };
