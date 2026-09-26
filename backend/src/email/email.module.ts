import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/adapters/handlebars.adapter';
import { join } from 'path';
import { EmailService } from './email.service';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: configService.get<string>('SMTP_HOST')
          ? {
              host: configService.get<string>('SMTP_HOST'),
              port: configService.get<number>('SMTP_PORT') || 587,
              secure: configService.get<boolean>('SMTP_SECURE') || false,
              auth: {
                user: configService.get<string>('SMTP_USER') || '',
                pass: configService.get<string>('SMTP_PASS') || '',
              },
            }
          // No SMTP configured (demo/free tiers): compose in-memory instead of
          // attempting a network dial that fails slowly on every auth event.
          : { streamTransport: true, buffer: true },
        defaults: {
          from: `"${configService.get<string>('APP_NAME') || 'E-commers-Crm'}" <${configService.get<string>('SMTP_FROM') || 'noreply@example.com'}>`,
        },
        template: {
          dir: join(process.cwd(), 'src/email/templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
