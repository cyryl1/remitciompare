import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: this.configService.get<number>('SMTP_PORT') === 465, // true for 465, false for other ports
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  async sendVerificationEmail(to: string, token: string) {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    const verificationLink = `${frontendUrl}/verify-email?token=${token}`;

    const mailOptions = {
      from: this.configService.get<string>('EMAIL_FROM') || '"RemitCompare" <noreply@remitcompare.com>',
      to,
      subject: 'Verify your email for RemitCompare',
      html: `
        <h2>Welcome to RemitCompare!</h2>
        <p>Please verify your email address by clicking the link below:</p>
        <a href="${verificationLink}">Verify Email</a>
        <p>Or copy and paste this link into your browser: <br> ${verificationLink}</p>
      `,
    };

    return this.sendMail(mailOptions);
  }

  async sendPasswordResetEmail(to: string, token: string) {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    const resetLink = `${frontendUrl}/reset-password?token=${token}`;

    const mailOptions = {
      from: this.configService.get<string>('EMAIL_FROM') || '"RemitCompare" <noreply@remitcompare.com>',
      to,
      subject: 'Reset your RemitCompare password',
      html: `
        <h2>Password Reset Request</h2>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetLink}">Reset Password</a>
        <p>If you did not request this, please ignore this email.</p>
        <p>This link will expire in 1 hour.</p>
      `,
    };

    return this.sendMail(mailOptions);
  }

  async sendRateAlert(opts: {
    to: string;
    sendAmount: number;
    fromCurrency: string;
    toCurrency: string;
    recipientAmount: number;
    provider: string;
    targetRecipientAmount: number;
  }) {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    const compareUrl = `${frontendUrl}/compare?sendAmount=${opts.sendAmount}&from=${opts.fromCurrency}&to=${opts.toCurrency}`;

    const formattedRecipient = new Intl.NumberFormat('en-NG').format(opts.recipientAmount);
    const formattedTarget = new Intl.NumberFormat('en-NG').format(opts.targetRecipientAmount);

    const mailOptions = {
      from: this.configService.get<string>('EMAIL_FROM') || '"RemitCompare" <noreply@remitcompare.com>',
      to: opts.to,
      subject: `🎯 Your rate alert has been triggered! ${opts.toCurrency} ${formattedRecipient} available`,
      html: `
        <h2>Your rate alert has triggered!</h2>
        <p>Great news! Your target of <strong>${opts.toCurrency} ${formattedTarget}</strong> has been reached.</p>
        <p>
          Sending <strong>${opts.fromCurrency} ${opts.sendAmount}</strong> via <strong>${opts.provider}</strong>
          will give your recipient <strong>${opts.toCurrency} ${formattedRecipient}</strong> right now.
        </p>
        <a href="${compareUrl}" style="background:#2563eb;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;margin-top:16px">
          Compare Rates Now
        </a>
        <p style="margin-top:24px;color:#6b7280;font-size:14px">
          Rates change frequently. This alert is based on our latest snapshot — lock in the rate quickly!
        </p>
      `,
    };

    return this.sendMail(mailOptions);
  }

  private async sendMail(mailOptions: nodemailer.SendMailOptions) {
    try {
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.debug(`Email sent successfully to ${mailOptions.to}. MessageId: ${info.messageId}`);
      return true;
    } catch (error: any) {
      this.logger.error(`Failed to send email to ${mailOptions.to}: ${error.message}`);
      // We don't throw here to avoid failing the user action (like registration) just because email failed
      return false;
    }
  }
}
