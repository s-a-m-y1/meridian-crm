import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  template?: string;
  context?: Record<string, any>;
  html?: string;
  text?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly mailerService: MailerService) {}

  async send(options: EmailOptions): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: options.to,
        subject: options.subject,
        template: options.template,
        context: options.context,
        html: options.html,
        text: options.text,
        attachments: options.attachments,
      });
      this.logger.log(`Email sent to ${Array.isArray(options.to) ? options.to.join(', ') : options.to}`);
    } catch (error: unknown) {
      this.logger.error(`Failed to send email to ${options.to}`, ((error as Error).stack));
      throw error;
    }
  }

  async sendVerificationEmail(email: string, name: string, token: string): Promise<void> {
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${token}`;
    
    await this.send({
      to: email,
      subject: 'Verify your email address',
      template: 'verification',
      context: {
        name,
        verificationUrl,
        expiresIn: '24 hours',
        supportEmail: process.env.SUPPORT_EMAIL || 'support@example.com',
        year: new Date().getFullYear(),
      },
    });
  }

  async sendPasswordResetEmail(email: string, name: string, token: string): Promise<void> {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
    
    await this.send({
      to: email,
      subject: 'Reset your password',
      template: 'password-reset',
      context: {
        name,
        resetUrl,
        expiresIn: '1 hour',
        supportEmail: process.env.SUPPORT_EMAIL || 'support@example.com',
        year: new Date().getFullYear(),
      },
    });
  }

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    const loginUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login`;
    
    await this.send({
      to: email,
      subject: 'Welcome to E-commers-Crm!',
      template: 'welcome',
      context: {
        name,
        loginUrl,
        supportEmail: process.env.SUPPORT_EMAIL || 'support@example.com',
        year: new Date().getFullYear(),
      },
    });
  }

  async sendNotificationEmail(
    email: string,
    subject: string,
    template: string,
    context: Record<string, any>,
  ): Promise<void> {
    await this.send({
      to: email,
      subject,
      template,
      context,
    });
  }

  async sendBulkEmails(
    emails: string[],
    subject: string,
    template: string,
    context: Record<string, any>,
  ): Promise<void> {
    // Send in batches to avoid rate limits
    const batchSize = 50;
    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize);
      await Promise.all(
        batch.map((email) =>
          this.send({
            to: email,
            subject,
            template,
            context,
          }),
        ),
      );
    }
  }
}
