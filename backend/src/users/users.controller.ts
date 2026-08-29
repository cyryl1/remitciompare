import {
  Controller,
  Get,
  Patch,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('preferences')
  @ApiOperation({ summary: 'Get user preferences' })
  async getPreferences(@Req() req: any) {
    return this.usersService.getPreferences(req.user.id);
  }

  @Patch('preferences')
  @ApiOperation({ summary: 'Update user preferences' })
  async updatePreferences(@Req() req: any, @Body() body: any) {
    return this.usersService.updatePreferences(req.user.id, body);
  }

  // --- Account Deletion ---

  @Delete('me')
  @ApiOperation({ summary: 'Delete user account' })
  async deleteAccount(@Req() req: any) {
    return this.usersService.deleteAccount(req.user.id);
  }

  @Post('me/request-data')
  @ApiOperation({ summary: 'Request personal data archive' })
  async requestDataArchive(@Req() req: any) {
    return this.usersService.requestDataArchive(req.user.id);
  }

  // --- Saved Routes ---

  @Get('saved-routes')
  @ApiOperation({ summary: 'Get user saved routes' })
  async getSavedRoutes(@Req() req: any) {
    return this.usersService.getSavedRoutes(req.user.id);
  }

  @Post('saved-routes')
  @ApiOperation({ summary: 'Add a saved route' })
  async addSavedRoute(@Req() req: any, @Body() body: any) {
    return this.usersService.addSavedRoute(req.user.id, body);
  }

  @Delete('saved-routes/:id')
  @ApiOperation({ summary: 'Delete a saved route' })
  async removeSavedRoute(@Req() req: any, @Param('id') routeId: string) {
    return this.usersService.removeSavedRoute(req.user.id, routeId);
  }
}
