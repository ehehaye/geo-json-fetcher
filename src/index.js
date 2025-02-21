import pLimit from 'p-limit';
import { OUTPUT_DIR, TOP_CODE } from './config.js';
import { downloadAndSaveFile, refreshDir, sleep, log } from './utils.js';

export function filter(json, level) {
  if (!json || !json.features) return [];
  return json.features
    .filter((e) => !level || e.properties.level === level)
    .map((e) => ({
      name: e.properties.name,
      code: e.properties.adcode,
    }));
}

export async function pull({ code, name }, retries = 3) {
  let lastError;
  for (let i = 0; i < retries; i++) {
    try {
      await sleep(100 * (i + 1));
      log(`${code} ${name} (attempt ${i + 1}/${retries})`);
      return await downloadAndSaveFile(code, OUTPUT_DIR);
    } catch (error) {
      lastError = error;
    }
  }
  log(`${code} ${name} failed: ${lastError.message}`);
  return null;
}

export async function main(depth = 3) {
  if (!Number.isInteger(depth) || depth < 1 || depth > 3) {
    throw new Error('depth must be 1, 2 or 3');
  }

  log(` ------------------------------------- `);

  await refreshDir(OUTPUT_DIR);
  const levelList = ['', 'province', 'city'];
  let currentDepth = 1;
  const limit = pLimit(3); // 限制并行数避免 DDos 风控

  const stack = [[{ code: TOP_CODE, name: 'china' }]];

  while (stack.length) {
    const currentLevel = stack.pop();
    const promises = currentLevel.map(({ code, name }) =>
      limit(async () => {
        const json = await pull({ code, name });

        if (currentDepth === depth) return;

        const nextLevel = levelList[currentDepth];
        if (nextLevel && json) {
          const nextItems = filter(json, nextLevel);
          if (nextItems.length) {
            stack.push(nextItems);
          }
        }
      })
    );

    await Promise.all(promises);

    if (currentDepth < depth) {
      currentDepth++;
    }
  }
}
