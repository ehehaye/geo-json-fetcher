import fs from 'fs/promises';
import path from 'node:path';
import request from './request.js';
import { LOGS_DIR } from './config.js';

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function log(message) {
  const logFilePath = path.join(
    LOGS_DIR,
    `${new Date().toISOString().split('T')[0]}.log`
  );

  try {
    await fs.mkdir(LOGS_DIR, { recursive: true });
    await fs.appendFile(
      logFilePath,
      `${new Date().toISOString()} - ${message}\n`
    );
  } catch (error) {
    console.error('Error writing log file:', error.message);
  }

  console.log(message);
}

export async function refreshDir(dir) {
  try {
    log(`Cleaning directory: ${dir}`);
    await fs.rm(dir, { recursive: true, force: true });
    await fs.mkdir(dir);
  } catch (error) {
    log(`Error cleaning directory: ${error.message}`);
  }
}

export async function writeJson(filePath, data) {
  try {
    log(`Writing JSON file: ${filePath}`);
    await fs.writeFile(filePath, JSON.stringify(data));
  } catch (error) {
    log(`Error writing JSON file: ${error.message}`);
  }
}

export async function downloadAndSaveFile(code, dir) {
  const name = `${code}_full.json`;
  const { data } = await request.get(name);
  await writeJson(path.join(dir, name), data);
  return data;
}
