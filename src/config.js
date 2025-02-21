import { fileURLToPath } from 'node:url';
import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = ['BASE_URL', 'TOP_CODE'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

export const BASE_URL = process.env.BASE_URL;
export const TOP_CODE = process.env.TOP_CODE;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const OUTPUT_DIR = path.join(__dirname, '..', 'output');
export const LOGS_DIR = path.join(__dirname, '..', 'logs');
