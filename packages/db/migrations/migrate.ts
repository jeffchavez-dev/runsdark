import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const sql = postgres(connectionString, { max: 1 });
const db = drizzle(sql);

migrate(db, { migrationsFolder: './migrations' }).then(() => {
  console.log('✓ Migrations applied successfully');
  process.exit(0);
});
