import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { compare, hash } from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '@prisma/client';
import { UserService } from '../user/user.service';

// Define token response
export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

// Define user result type (excluding sensitive fields)
type UserResult = Omit<User, 'password' | 'refreshToken'>;

// Define type for bcrypt functions to fix type errors
type HashFunction = (
  data: string,
  saltOrRounds: string | number,
) => Promise<string>;
type CompareFunction = (data: string, encrypted: string) => Promise<boolean>;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly SALT_ROUNDS = 10;
  private readonly ACCESS_TOKEN_EXPIRY = '30m';
  private readonly REFRESH_TOKEN_EXPIRY = '7d';

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  // User authentication methods
  async register(
    registerDto: RegisterDto,
  ): Promise<{ user: UserResult } & Tokens> {
    try {
      await this.validateUniqueUser(registerDto.email, registerDto.username);

      const hashedPassword = await this.hashData(registerDto.password);

      const newUser = await this.prisma.user.create({
        data: {
          ...registerDto,
          password: hashedPassword,
        },
      });

      const tokens = this.getTokens(newUser.id, newUser.username);
      await this.updateRefreshToken(newUser.id, tokens.refreshToken);

      return {
        user: this.excludeSensitiveData(newUser),
        ...tokens,
      };
    } catch (err: unknown) {
      this.handleAuthError(err, 'Registration failed');
    }
  }

  async login(loginDto: LoginDto): Promise<{ user: UserResult } & Tokens> {
    try {
      const user = await this.findUserByUsernameOrEmail(
        loginDto.usernameOrEmail,
      );

      if (!user || !user.isActive) {
        throw new UnauthorizedException('Invalid credentials');
      }

      await this.verifyPassword(loginDto.password, user.password);

      const tokens = this.getTokens(user.id, user.username);
      await this.updateRefreshToken(user.id, tokens.refreshToken);

      return {
        user: this.excludeSensitiveData(user),
        ...tokens,
      };
    } catch (err: unknown) {
      this.handleAuthError(err, 'Login failed');
    }
  }

  async refreshTokens(userId: string, refreshToken: string): Promise<Tokens> {
    try {
      const user = await this.userService.findUserById(userId);

      if (!user.refreshToken) {
        throw new ForbiddenException('Access denied');
      }

      await this.verifyRefreshToken(refreshToken, user.refreshToken);

      const tokens = this.getTokens(userId, user.username);
      await this.updateRefreshToken(userId, tokens.refreshToken);

      return tokens;
    } catch (err: unknown) {
      this.handleAuthError(err, 'Failed to refresh tokens');
    }
  }

  async logout(userId: string): Promise<{ message: string }> {
    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: { refreshToken: null },
      });

      return { message: 'Logged out successfully' };
    } catch (err: unknown) {
      this.handleAuthError(err, 'Failed to logout');
    }
  }

  // Helper methods for token management
  private getTokens(userId: string, username: string): Tokens {
    try {
      const payload = { sub: userId, username };

      const accessToken = this.jwtService.sign(payload, {
        secret: process.env.JWT_ACCESS_SECRET || 'your-access-secret-key',
        expiresIn: this.ACCESS_TOKEN_EXPIRY,
      });

      const refreshToken = this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
        expiresIn: this.REFRESH_TOKEN_EXPIRY,
      });

      return { accessToken, refreshToken };
    } catch (err: unknown) {
      this.logger.error(
        `Token generation failed: ${this.formatErrorMessage(err)}`,
      );
      throw new InternalServerErrorException('Token generation failed');
    }
  }

  private async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    try {
      const hashedToken = await this.hashData(refreshToken);

      await this.prisma.user.update({
        where: { id: userId },
        data: { refreshToken: hashedToken },
      });
    } catch (err: unknown) {
      this.logger.error(
        `Failed to update refresh token: ${this.formatErrorMessage(err)}`,
      );
      throw new InternalServerErrorException('Failed to update refresh token');
    }
  }

  // Helper methods for user operations
  private async findUserByUsernameOrEmail(
    usernameOrEmail: string,
  ): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  private async validateUniqueUser(
    email: string,
    username: string,
  ): Promise<void> {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      throw new ConflictException(
        'User with this email or username already exists',
      );
    }
  }

  // Security and password related methods
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

  private async verifyPassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<void> {
    try {
      const bcryptCompare = compare as CompareFunction;
      const passwordMatches = await bcryptCompare(
        plainPassword,
        hashedPassword,
      );

      if (!passwordMatches) {
        throw new UnauthorizedException('Invalid credentials');
      }
    } catch (err: unknown) {
      if (err instanceof UnauthorizedException) {
        throw err;
      }

      this.logger.error(
        `Password comparison failed: ${this.formatErrorMessage(err)}`,
      );
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  private async verifyRefreshToken(
    refreshToken: string,
    hashedRefreshToken: string,
  ): Promise<void> {
    try {
      const bcryptCompare = compare as CompareFunction;
      const refreshTokenMatches = await bcryptCompare(
        refreshToken,
        hashedRefreshToken,
      );

      if (!refreshTokenMatches) {
        throw new ForbiddenException('Access denied');
      }
    } catch (err: unknown) {
      if (err instanceof ForbiddenException) {
        throw err;
      }

      this.logger.error(
        `Refresh token comparison failed: ${this.formatErrorMessage(err)}`,
      );
      throw new ForbiddenException('Access denied');
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

  private handleAuthError(err: unknown, defaultMessage: string): never {
    // Re-throw known exceptions directly
    if (
      err instanceof UnauthorizedException ||
      err instanceof ConflictException ||
      err instanceof ForbiddenException ||
      err instanceof NotFoundException
    ) {
      throw err;
    }

    // Log and throw internal server error for unexpected errors
    this.logger.error(`${defaultMessage}: ${this.formatErrorMessage(err)}`);
    throw new InternalServerErrorException(defaultMessage);
  }
}
