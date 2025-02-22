import { fileURLToPath } from 'node:url';
import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config({ path: ['.env.local', '.env'] });

const requiredEnvVars = [
  'BASE_URL',
  'TOP_CODE',
  'REQ_RETRIES',
  'REQ_INTERVAL',
  'REQ_CONCURRENCY',
];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __root = path.join(__dirname, '..');

const config = {
  BASE_URL: process.env.BASE_URL,
  TOP_CODE: process.env.TOP_CODE,
  REQ_RETRIES: +process.env.REQ_RETRIES,
  REQ_INTERVAL: +process.env.REQ_INTERVAL,
  REQ_CONCURRENCY: +process.env.REQ_CONCURRENCY,
  OUTPUT_DIR: path.join(__root, 'output'),
  LOGS_DIR: path.join(__root, 'logs'),
};

export default config;
