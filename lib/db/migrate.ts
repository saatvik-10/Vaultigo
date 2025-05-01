import { migrate } from 'drizzle-orm/neon-http/migrator';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE URL is not defined in local env');
}

async function runMigration() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const db = drizzle(sql); //initialize drizzle with neon connection

    await migrate(db, {
      migrationsFolder: './drizzle',
    });

    console.log('Migrations completed successfully');
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

runMigration();
