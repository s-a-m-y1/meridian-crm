/**
 * One-off schema sync — creates/aligns all tables from TypeORM entities on a
 * target Postgres database. Used for hosts where we cannot ship baseline
 * migrations yet (see data-source.ts note).
 *
 * Usage (from backend/):
 *   DATABASE_URL="postgres://user:pass@host:5432/db?sslmode=require" \
 *     npx ts-node scripts/sync-schema.ts
 *
 * SSL is enabled automatically when the URL has sslmode=require or points to
 * Neon; force with PGSSL=true.
 */
import 'reflect-metadata';
import { DataSource } from 'typeorm';

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL env var is required (postgres://user:pass@host/db)');
  }

  const needsSsl =
    process.env.PGSSL === 'true' ||
    /sslmode=require/.test(url) ||
    /\.neon\.tech/.test(url);

  const dataSource = new DataSource({
    type: 'postgres',
    url,
    ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
    entities: [__dirname + '/../src/**/*.entity{.ts,.js}'],
    synchronize: false, // we call synchronize() explicitly
    logging: ['error'],
  });

  await dataSource.initialize();
  await dataSource.synchronize();
  const names = dataSource.entityMetadatas.map((m) => m.tableName);
  await dataSource.destroy();
  console.log(`Schema synchronized: ${names.length} tables`);
  console.log(names.sort().join(', '));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
