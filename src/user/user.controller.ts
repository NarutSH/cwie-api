import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService, UserResult } from './user.service';
import { UpdateUserDto } from '../auth/dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';

// Define the authenticated request interface with user property
interface RequestWithUser extends Request {
  user: {
    userId: string;
    username: string;
  };
}

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers() {
    return this.userService.getUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req: RequestWithUser): Promise<UserResult> {
    return this.userService.getUserProfile(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  async updateUser(
    @Req() req: RequestWithUser,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResult> {
    return this.userService.updateUser(req.user.userId, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  @HttpCode(HttpStatus.OK)
  async deleteUser(@Req() req: RequestWithUser): Promise<{ message: string }> {
    return this.userService.deleteUser(req.user.userId);
  }
}
