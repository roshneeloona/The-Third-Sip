const fs = require("fs/promises");
const path = require("path");

function cloneFallback(value) {
  return JSON.parse(JSON.stringify(value));
}

async function ensureDirectory(directoryPath) {
  await fs.mkdir(directoryPath, { recursive: true });
}

async function ensureJsonFile(filePath, defaultValue) {
  try {
    await fs.access(filePath);
  } catch (error) {
    await ensureDirectory(path.dirname(filePath));
    await fs.writeFile(filePath, JSON.stringify(defaultValue, null, 2));
  }
}

async function readJsonFile(filePath, fallbackValue) {
  await ensureJsonFile(filePath, fallbackValue);
  const raw = await fs.readFile(filePath, "utf-8");
  if (!raw.trim()) {
    return cloneFallback(fallbackValue);
  }
  return JSON.parse(raw);
}

async function writeJsonFile(filePath, value) {
  await ensureDirectory(path.dirname(filePath));
  await fs.writeFile(filePath, JSON.stringify(value, null, 2));
  return value;
}

module.exports = {
  ensureDirectory,
  ensureJsonFile,
  readJsonFile,
  writeJsonFile,
};
