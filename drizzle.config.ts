import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { defineConfig } from 'drizzle-kit';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE URL is not defined in local env');
}

export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  migrations: {
    table: '__drizzle_migartion',
    schema: 'public',
  },
  verbose: true, //detailed logs and output while running push, generate, etc.
  strict: true,
});
