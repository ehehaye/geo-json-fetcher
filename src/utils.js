import fs from "fs/promises";

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function refreshDir(dir) {
  await fs.rm(dir, { recursive: true, force: true });
  await fs.mkdir(dir);
}
