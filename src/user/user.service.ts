import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
import { UpdateUserDto } from '../auth/dto/update-user.dto';
import { hash } from 'bcrypt';

// Define the user result type (excluding sensitive fields)
export type UserResult = Omit<User, 'password' | 'refreshToken'>;

// Define type for bcrypt hash function
type HashFunction = (
  data: string,
  saltOrRounds: string | number,
) => Promise<string>;

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  private readonly SALT_ROUNDS = 10;

  constructor(private readonly prisma: PrismaService) {}

  async getUserProfile(userId: string): Promise<UserResult> {
    try {
      const user = await this.findUserById(userId);
      return this.excludeSensitiveData(user);
    } catch (err: unknown) {
      this.handleUserError(err, 'Failed to fetch user profile');
    }
  }

  async getUsers() {
    try {
      const users = await this.prisma.user.findMany({
        select: {
          id: true,
          email: true,
          username: true,
          firstname: true,
          lastname: true,
          role: true,
          isActive: true,
          departments: {
            select: {
              department: {
                select: {
                  id: true,
                  name: true,
                  code: true,
                },
              },
            },
          },
        },
      });

      // Transform the result to flatten the departments data
      return users.map((user) => ({
        ...user,
        departments: user.departments.map((ud) => ud.department),
      }));
    } catch (err: unknown) {
      this.handleUserError(err, 'Failed to fetch users');
    }
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResult> {
    try {
      if (updateUserDto.email || updateUserDto.username) {
        await this.validateUniqueUserUpdate(
          userId,
          updateUserDto.email,
          updateUserDto.username,
        );
      }

      const updateData: Prisma.UserUpdateInput = { ...updateUserDto };

      if (updateUserDto.password) {
        updateData.password = await this.hashData(updateUserDto.password);
      }

      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: updateData,
      });

      return this.excludeSensitiveData(updatedUser);
    } catch (err: unknown) {
      this.handleUserError(err, 'Failed to update user');
    }
  }

  async deleteUser(userId: string): Promise<{ message: string }> {
    try {
      await this.findUserById(userId);

      await this.prisma.user.delete({
        where: { id: userId },
      });

      return { message: 'User deleted successfully' };
    } catch (err: unknown) {
      this.handleUserError(err, 'Failed to delete user');
    }
  }

  // Helper methods for user operations
  async findUserById(userId: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async validateUniqueUserUpdate(
    userId: string,
    email?: string,
    username?: string,
  ): Promise<void> {
    if (!email && !username) return;

    const conditions: Prisma.UserWhereInput[] = [];
    if (email) conditions.push({ email });
    if (username) conditions.push({ username });

    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: conditions,
        NOT: { id: userId },
      },
    });

    if (existingUser) {
      throw new ConflictException('Email or username already taken');
    }
  }

  // Security related methods
  private async hashData(data: string): Promise<string> {
    try {
      const bcryptHash = hash as HashFunction;
      return await bcryptHash(data, this.SALT_ROUNDS);
    } catch (err: unknown) {
      this.logger.error(
        `Password hashing failed: ${this.formatErrorMessage(err)}`,
      );
      throw new InternalServerErrorException('Password hashing failed');
    }
  }

  // Utility methods
  private excludeSensitiveData(user: User): UserResult {
    const { ...userData } = user;
    return userData;
  }

  private formatErrorMessage(err: unknown): string {
    return err instanceof Error ? err.message : String(err);
  }

  private handleUserError(err: unknown, defaultMessage: string): never {
    // Re-throw known exceptions directly
    if (err instanceof ConflictException || err instanceof NotFoundException) {
      throw err;
    }

    // Log and throw internal server error for unexpected errors
    this.logger.error(`${defaultMessage}: ${this.formatErrorMessage(err)}`);
    throw new InternalServerErrorException(defaultMessage);
  }
}
