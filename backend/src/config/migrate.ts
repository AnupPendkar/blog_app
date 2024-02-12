import { db, psConnection } from './index';
import { migrate } from 'drizzle-orm/postgres-js/migrator';

export default async function migrateSchema() {
  console.log('migrations started');
  await migrate(db, { migrationsFolder: 'migrations' });
  await psConnection.end();
  console.log('migrations completed');
  process.exit(0);
}

migrateSchema().catch((err) => {
  console.log('migration failed', err);
  process.exit(1);
});
