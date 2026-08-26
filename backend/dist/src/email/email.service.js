"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = __importStar(require("nodemailer"));
let EmailService = EmailService_1 = class EmailService {
    configService;
    transporter;
    logger = new common_1.Logger(EmailService_1.name);
    constructor(configService) {
        this.configService = configService;
        this.transporter = nodemailer.createTransport({
            host: this.configService.get('SMTP_HOST'),
            port: this.configService.get('SMTP_PORT'),
            secure: this.configService.get('SMTP_PORT') === 465,
            auth: {
                user: this.configService.get('SMTP_USER'),
                pass: this.configService.get('SMTP_PASS'),
            },
        });
    }
    async sendVerificationEmail(to, token) {
        const frontendUrl = this.configService.get('FRONTEND_URL');
        const verificationLink = `${frontendUrl}/verify-email?token=${token}`;
        const mailOptions = {
            from: this.configService.get('EMAIL_FROM') || '"RemitCompare" <noreply@remitcompare.com>',
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
    async sendPasswordResetEmail(to, token) {
        const frontendUrl = this.configService.get('FRONTEND_URL');
        const resetLink = `${frontendUrl}/reset-password?token=${token}`;
        const mailOptions = {
            from: this.configService.get('EMAIL_FROM') || '"RemitCompare" <noreply@remitcompare.com>',
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
    async sendRateAlert(opts) {
        const frontendUrl = this.configService.get('FRONTEND_URL');
        const compareUrl = `${frontendUrl}/compare?sendAmount=${opts.sendAmount}&from=${opts.fromCurrency}&to=${opts.toCurrency}`;
        const formattedRecipient = new Intl.NumberFormat('en-NG').format(opts.recipientAmount);
        const formattedTarget = new Intl.NumberFormat('en-NG').format(opts.targetRecipientAmount);
        const mailOptions = {
            from: this.configService.get('EMAIL_FROM') || '"RemitCompare" <noreply@remitcompare.com>',
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
    async sendMail(mailOptions) {
        try {
            const info = await this.transporter.sendMail(mailOptions);
            this.logger.debug(`Email sent successfully to ${mailOptions.to}. MessageId: ${info.messageId}`);
            return true;
        }
        catch (error) {
            this.logger.error(`Failed to send email to ${mailOptions.to}: ${error.message}`);
            return false;
        }
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmailService);
//# sourceMappingURL=email.service.js.map