import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';

dotenv.config();

const configService = new ConfigService();

const isTest = process.env.NODE_ENV === 'test';

export const databaseConfig = {
  type: 'postgres' as const,
  host: process.env.PGHOST ?? 'localhost',
  port: Number(process.env.PGPORT ?? 5432),
  username: process.env.PGUSER ?? 'crm_user',
  password: process.env.PGPASSWORD ?? 'crm_password',
  database: process.env.PGDATABASE ?? 'crm_db',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
  // Dev/test: auto-create schema (no baseline migrations in repo yet).
  // Production must ship real migrations instead.
  synchronize: process.env.NODE_ENV !== 'production',
  logging: false,
  migrationsRun: false,
};

export const AppDataSource = new DataSource(databaseConfig);
