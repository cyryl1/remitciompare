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
      from:
        this.configService.get<string>('EMAIL_FROM') ||
        '"RemitCompare" <noreply@remitcompare.com>',
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
      from:
        this.configService.get<string>('EMAIL_FROM') ||
        '"RemitCompare" <noreply@remitcompare.com>',
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

    const formattedRecipient = new Intl.NumberFormat('en-NG').format(
      opts.recipientAmount,
    );
    const formattedTarget = new Intl.NumberFormat('en-NG').format(
      opts.targetRecipientAmount,
    );

    const mailOptions = {
      from:
        this.configService.get<string>('EMAIL_FROM') ||
        '"RemitCompare" <noreply@remitcompare.com>',
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

  async sendWeeklyComparisonEmail(
    to: string,
    routes: Array<{
      fromCurrency: string;
      toCurrency: string;
      sendAmount: number;
      bestProvider: string;
      bestRecipientAmount: string;
    }>
  ) {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    
    const routesHtml = routes.map(r => `
      <div style="margin-bottom: 16px; padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h3 style="margin: 0 0 8px 0; color: #111827;">${r.fromCurrency} ➔ ${r.toCurrency}</h3>
        <p style="margin: 0; color: #4b5563;">
          Best rate right now: <strong>${r.bestProvider}</strong> gives <strong>${r.bestRecipientAmount} ${r.toCurrency}</strong> for every ${r.sendAmount} ${r.fromCurrency}.
        </p>
        <a href="${frontendUrl}/compare?sendAmount=${r.sendAmount}&from=${r.fromCurrency}&to=${r.toCurrency}" style="color: #2563eb; text-decoration: none; font-weight: 500; display: inline-block; margin-top: 8px;">View Full Comparison →</a>
      </div>
    `).join('');

    const mailOptions = {
      from: this.configService.get<string>('EMAIL_FROM') || '"RemitCompare" <noreply@remitcompare.com>',
      to,
      subject: '📊 Your Weekly RemitCompare Digest',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Your Weekly Exchange Rate Digest</h2>
          <p>Here are the best live rates for your saved routes right now:</p>
          ${routesHtml}
          <p style="margin-top: 24px; font-size: 12px; color: #9ca3af;">
            You are receiving this because you enabled Weekly Comparison emails in your Account Settings. 
            <a href="${frontendUrl}/account" style="color: #6b7280;">Manage Preferences</a>
          </p>
        </div>
      `,
    };

    return this.sendMail(mailOptions);
  }

  async sendDataArchiveEmail(to: string, userData: any) {
    const jsonString = JSON.stringify(userData, null, 2);
    
    const mailOptions = {
      from: this.configService.get<string>('EMAIL_FROM') || '"RemitCompare" <noreply@remitcompare.com>',
      to,
      subject: '📦 Your RemitCompare Data Archive',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Your Data Archive Request</h2>
          <p>Attached to this email is a copy of your personal data, saved routes, and alert history from RemitCompare in JSON format.</p>
          <p style="margin-top: 24px; font-size: 12px; color: #9ca3af;">
            For security reasons, this file does not contain your password hash or any payment details.
          </p>
        </div>
      `,
      attachments: [
        {
          filename: 'remitcompare-data-archive.json',
          content: jsonString,
          contentType: 'application/json'
        }
      ]
    };

    return this.sendMail(mailOptions);
  }

  private async sendMail(mailOptions: nodemailer.SendMailOptions) {
    try {
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.debug(
        `Email sent successfully to ${mailOptions.to}. MessageId: ${info.messageId}`,
      );
      return true;
    } catch (error: any) {
      this.logger.error(
        `Failed to send email to ${mailOptions.to}: ${error.message}`,
      );
      // We don't throw here to avoid failing the user action (like registration) just because email failed
      return false;
    }
  }
}
