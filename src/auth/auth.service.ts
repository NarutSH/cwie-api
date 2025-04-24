import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User, UserRole } from '@prisma/client';
import axios from 'axios';
import { compare, hash } from 'bcrypt';
import * as https from 'https';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';

// Define token response
export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

// LDAP API response interface
interface LDAPUserResponse {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  faculty: string;
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
  private readonly LDAP_API_URL =
    'https://eng.buu.ac.th/internship/intern-api/login/';

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  // User authentication methods
  async login(loginDto: LoginDto): Promise<{ user: UserResult } & Tokens> {
    try {
      // Convert password to UTF-8 encoded hex
      const hexPassword = Buffer.from(loginDto.password, 'utf8').toString(
        'hex',
      );

      // Call LDAP API
      const ldapResponse = await this.callLDAPApi(
        loginDto.usernameOrEmail,
        hexPassword,
      );

      // Check if user exists in our database
      let user = await this.prisma.user.findFirst({
        where: { username: ldapResponse.username },
      });

      // If user doesn't exist, create a new user
      if (!user) {
        user = await this.prisma.user.create({
          data: {
            username: ldapResponse.username,
            email: ldapResponse.email,
            firstname: ldapResponse.first_name,
            lastname: ldapResponse.last_name,
            role: Number(ldapResponse.username)
              ? UserRole.student
              : UserRole.staff,
            // We don't store the actual password since authentication is handled by LDAP
            password: await this.hashData(
              'placeholder-password-ldap-auth-only',
            ),
            isActive: true,
          },
        });
      } else {
        // Update user info from LDAP if user already exists
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: {
            email: ldapResponse.email,
            firstname: ldapResponse.first_name,
            lastname: ldapResponse.last_name,
            isActive: true,
          },
        });
      }

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

  // Helper method to call LDAP API
  private async callLDAPApi(
    username: string,
    hexPassword: string,
  ): Promise<LDAPUserResponse> {
    try {
      const response = await axios.get(`${this.LDAP_API_URL}`, {
        params: {
          username,
          password: hexPassword,
        },
        // Ignore certificate validation
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
      });

      if (!response.data || !response.data.username) {
        throw new UnauthorizedException('Invalid credentials');
      }

      return response.data as LDAPUserResponse;
    } catch (error) {
      this.logger.error(
        `LDAP authentication failed: ${this.formatErrorMessage(error)}`,
      );
      throw new UnauthorizedException('LDAP authentication failed');
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
