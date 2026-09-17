import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.example' });

const isTest = process.env.NODE_ENV === 'test';

export default new DataSource({
  type: 'postgres',
  host: process.env.PGHOST ?? 'localhost',
  port: Number(process.env.PGPORT ?? 5432),
  username: process.env.PGUSER ?? 'crm',
  password: process.env.PGPASSWORD ?? 'crm_dev_password',
  database: isTest ? 'crm_test' : (process.env.PGDATABASE ?? 'crm_dev'),
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/database/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: !isTest,
});
