import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configuration, validateEnv } from './config/configuration';
import { AuthModule } from './modules/auth/auth.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { UsersModule } from './modules/users/users.module';
import { CustomersModule } from './modules/customers/customers.module';
import { LeadsModule } from './modules/leads/leads.module';
import { PropertiesModule } from './modules/properties/properties.module';
import { DealsModule } from './modules/deals/deals.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { ActivitiesModule } from './modules/activities/activities.module';
import { NotesModule } from './modules/notes/notes.module';
import { HealthModule } from './health/health.module';
import { AuthGuard } from './common/guards/auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate: validateEnv,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres' as const,
        host: config.get<string>('database.host')!,
        port: config.get<number>('database.port')!,
        username: config.get<string>('database.user')!,
        password: config.get<string>('database.password')!,
        database: config.get<string>('database.name')!,
        autoLoadEntities: true,
        synchronize: false,
        logging: false,
        migrationsRun: config.get<string>('nodeEnv') === 'test',
        migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
      }),
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          name: 'default',
          ttl: config.get<number>('throttle.ttlMs') ?? 60000,
          limit: config.get<number>('throttle.limit') ?? 300,
        },
        {
          name: 'auth',
          ttl: config.get<number>('throttle.authTtlMs') ?? 60000,
          limit: config.get<number>('throttle.authLimit') ?? 10,
        },
      ],
    }),
    UsersModule,
    OrganizationsModule,
    CustomersModule,
    LeadsModule,
    PropertiesModule,
    DealsModule,
    TasksModule,
    ActivitiesModule,
    NotesModule,
    AuthModule,
    HealthModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: AuthGuard },
  ],
})
export class AppModule {}