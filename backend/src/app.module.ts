import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configuration, validateEnv } from './config/configuration';
import { AuthModule } from './modules/auth/auth.module';
import { FilesModule } from './files/files.module';
import { RealtimeModule } from './realtime/realtime.module';
import { EmailModule } from './email/email.module';
import { AIModule } from './ai/ai.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { UsersModule } from './modules/users/users.module';
import { CustomersModule } from './modules/customers/customers.module';
import { LeadsModule } from './modules/leads/leads.module';
import { PropertiesModule } from './modules/properties/properties.module';
import { DealsModule } from './modules/deals/deals.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { ActivitiesModule } from './modules/activities/activities.module';
import { NotesModule } from './modules/notes/notes.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { HealthModule } from './health/health.module';
import { QueueModule } from './queues/queue.module';
import { ObservabilityModule } from './observability/observability.module';
import { SecurityModule } from './security/security.module';
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
        ssl: config.get<boolean>('database.ssl')
          ? { rejectUnauthorized: false }
          : undefined,
        autoLoadEntities: true,
        // Dev/test: create the schema automatically (the repo has no baseline
        // migrations yet). Production stays strict — schema changes there
        // must ship as real TypeORM migrations.
        synchronize: config.get<string>('nodeEnv') !== 'production',
        logging: false,
        migrationsRun: config.get<string>('nodeEnv') === 'test',
        migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
      }),
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
    DashboardModule,
    QueueModule,
    ObservabilityModule,
    SecurityModule,
    AuthModule,
    EmailModule,
    FilesModule,
    RealtimeModule,
    AIModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
  ],
})
export class AppModule {}