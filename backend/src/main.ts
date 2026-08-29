import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const cookieParser = require('cookie-parser');
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ─── Global middleware ──────────────────────────────────────────────────
  app.use(cookieParser());

  // ─── Global validation ──────────────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip unknown fields
      forbidNonWhitelisted: true,
      transform: true, // Auto-transform query params to their DTO types
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // ─── CORS ───────────────────────────────────────────────────────────────
  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
    credentials: true,
  });

  // ─── Swagger / OpenAPI ──────────────────────────────────────────────────
  const config = new DocumentBuilder()
    .setTitle('RemitCompare API')
    .setDescription(
      'RemitCompare is a personalized remittance decision platform. ' +
        'This API powers the comparison engine, provider directory, alerts, and user accounts.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .addTag('comparison', 'Compare remittance providers')
    .addTag('providers', 'Provider directory and profiles')
    .addTag('rates', 'Rate history and market insights')
    .addTag('alerts', 'Outcome-based rate alerts')
    .addTag('auth', 'Authentication and account management')
    .addTag('users', 'User profile and preferences')
    .addTag('admin', 'Admin dashboard and monitoring')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // ─── Start ──────────────────────────────────────────────────────────────
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`\n🚀 RemitCompare API running on http://localhost:${port}`);
  console.log(`📖 Swagger docs at http://localhost:${port}/api/docs\n`);
}

bootstrap();
