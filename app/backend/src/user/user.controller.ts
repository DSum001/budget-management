import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateProfileDto, UpdatePreferencesDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async getProfile(@Request() req) {
    return this.userService.findById(req.user.userId);
  }

  @Patch('profile')
  async updateProfile(@Request() req, @Body() updateDto: UpdateProfileDto) {
    return this.userService.updateProfile(req.user.userId, updateDto);
  }

  @Patch('preferences')
  async updatePreferences(
    @Request() req: any,
    @Body() preferencesDto: UpdatePreferencesDto,
  ) {
    // @ts-ignore
    return this.userService.updatePreferences(req.user.userId, preferencesDto);
  }
}
