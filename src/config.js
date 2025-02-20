import { fileURLToPath } from "node:url";
import path from "node:path";

// https://datav.aliyun.com/portal/school/atlas/area_selector
export const BASE_URL = "https://geo.datav.aliyun.com/areas_v3/bound";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const TOP_CODE = "100000";

export const OUTPUT_DIR = path.join(__dirname, "..", "output");

export const OUTPUT_PROVINCE_DIR = path.join(OUTPUT_DIR, "province");
