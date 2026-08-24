import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private prisma: PrismaService) {}

  async getPreferences(userId: string) {
    // Basic implementation for MVP
    return {
      notifications: { email: true, push: false },
      defaultRoute: { from: 'GBP', to: 'NGN' }
    };
  }

  async updatePreferences(userId: string, data: any) {
    // For MVP, just return the data
    return data;
  }
}
