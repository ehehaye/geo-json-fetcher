import fs from "node:fs/promises";
import path from "node:path";
import request from "./request.js";
import { TOP_CODE, OUTPUT_DIR, OUTPUT_PROVINCE_DIR } from "./config.js";
import { sleep, refreshDir } from "./utils.js";

function getProvinceConfig(json) {
  return json.features
    .filter((e) => e.properties.level === "province")
    .map((e) => ({
      name: e.properties.name,
      code: e.properties.adcode,
    }));
}

async function downloadAndSaveFile(code, dir) {
  const name = `${code}_full.json`;
  const { data } = await request.get(name);
  await fs.writeFile(path.join(dir, name), JSON.stringify(data));
  return data;
}

export async function main() {
  await refreshDir(OUTPUT_DIR);
  const json = await downloadAndSaveFile(TOP_CODE, OUTPUT_DIR);
  const config = getProvinceConfig(json);

  await refreshDir(OUTPUT_PROVINCE_DIR);
  console.log(`province length: ${config.length},`, config);
  console.log(` - start downloading`);

  let successCount = 0;
  let failureCount = 0;

  for (let { code, name } of config) {
    console.log(`downloading ${code} ${name}`);
    try {
      await downloadAndSaveFile(code, OUTPUT_PROVINCE_DIR);
      console.log(`succeed`);
      successCount++;
    } catch (e) {
      console.error(`failed,`, e.message);
      failureCount++;
    }
    await sleep(100);
  }

  console.log(` - done: ${successCount} success, ${failureCount} failures`);
}
