import pl from 'p-limit';
import config from './config.js';
import { log, pull, refreshDir, saveJson } from './utils.js';

export function filterFeatures(geoJson, level) {
  if (!geoJson || !geoJson.features) return [];
  return geoJson.features
    .filter((e) => !level || e.properties.level === level)
    .map((e) => ({
      name: e.properties.name,
      code: e.properties.adcode,
    }));
}

export async function main(depth = 1) {
  if (!Number.isInteger(depth) || depth < 1 || depth > 3) {
    throw new Error('depth must be 1, 2 or 3');
  }

  log(` ------------------- START ------------------- `);
  await refreshDir(config.OUTPUT_DIR);

  const limit = pl(config.REQ_CONCURRENCY);
  const LEVEL_LIST = ['', 'province', 'city', 'district'];
  const hierarchy = { code: config.TOP_CODE, name: 'china', children: [] };
  const stack = [[{ code: config.TOP_CODE, name: 'china', node: hierarchy }]];

  let currentDepth = 1;

  while (stack.length) {
    const curFeature = stack.pop();
    const tasks = curFeature.map(({ code, name, node }) =>
      limit(async () => {
        const geoJson = await pull({ code, name });
        const nextLevel = LEVEL_LIST[currentDepth];
        if (!geoJson || !nextLevel) return;

        const nextFeatures = filterFeatures(geoJson, nextLevel);
        if (!nextFeatures.length) return;

        node.children = nextFeatures.map(({ code, name }) => ({
          code,
          name,
          children: [],
        }));

        // 阿里数据源最深只支持到市级
        if (currentDepth === depth) return;
        stack.push(
          nextFeatures.map(({ code, name }) => ({
            code,
            name,
            node: node.children.find((n) => n.code === code && n.name === name),
          }))
        );
      })
    );

    await Promise.all(tasks);

    if (currentDepth < depth) {
      currentDepth++;
    }
  }

  saveJson('hierarchy.json', hierarchy);

  log(` ------------------- DONE ------------------- `);
}
