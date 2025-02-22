import fs from 'node:fs/promises';
import path from 'node:path';
import request from './request.js';
import config from './config.js';

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function log(message) {
  const logFilePath = path.join(
    config.LOGS_DIR,
    `${new Date().toISOString().split('T')[0]}.log`
  );

  try {
    await fs.mkdir(config.LOGS_DIR, { recursive: true });
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
    log(`Refreshing dir: ${dir}`);
    await fs.rm(dir, { recursive: true, force: true });
    await fs.mkdir(dir);
  } catch (error) {
    log(`Error refreshing dir: ${error.message}`);
  }
}

export async function saveJson(filename, data) {
  try {
    const p = path.join(config.OUTPUT_DIR, filename);
    log(`Writing JSON file: ${p}`);
    await fs.writeFile(p, JSON.stringify(data));
  } catch (error) {
    log(`Error writing JSON file: ${error.message}`);
  }
}

export async function pull({ code, name }) {
  const filename = `${code}_full.json`;

  let lastError;

  for (let i = 0; i < config.REQ_RETRIES; i++) {
    try {
      await sleep(config.REQ_INTERVAL * (i + 1));
      log(`${code} ${name} (attempt ${i + 1}/${config.REQ_RETRIES})`);
      const { data } = await request.get(filename);
      await saveJson(filename, data);
      return data;
    } catch (error) {
      lastError = error;
    }
  }

  log(`${code} ${name} failed: ${lastError.message}`);

  return null;
}
