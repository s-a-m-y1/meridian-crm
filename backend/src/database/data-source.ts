import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

const isTest = process.env.NODE_ENV === 'test';

export const databaseConfig: DataSourceOptions = {
  type: 'postgres',
  host: configService.get('PGHOST') ?? 'localhost',
  port: Number(configService.get('PGPORT') ?? 5432),
  username: configService.get('PGUSER') ?? 'crm',
  password: configService.get('PGPASSWORD') ?? 'crm_dev_password',
  database: isTest ? 'crm_test' : (configService.get('PGDATABASE') ?? 'crm_dev'),
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: !isTest,
  migrationsRun: isTest,
};

export const AppDataSource = new DataSource(databaseConfig);