import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy as any,
  'jwt-refresh',
) {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: (req: Request) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
          return null;
        }
        const [type, token] = authHeader.split(' ');
        return type === 'Bearer' ? token : null;
      },
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(
        'JWT_REFRESH_SECRET',
        'your-refresh-secret-key',
      ),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: { sub: string; username: string }) {
    const authHeader = req.get('Authorization');

    if (!authHeader) {
      throw new UnauthorizedException('No authorization header found');
    }

    const refreshToken = authHeader.replace('Bearer ', '').trim();

    const user = await this.prisma.user.findFirst({
      where: {
        id: payload.sub,
      },
    });

    if (!user || !user.isActive || !user.refreshToken) {
      throw new UnauthorizedException('Access denied');
    }

    // Store the refreshToken on the request for use in the controller
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      refreshToken,
    };
  }
}
