import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { ErrorCode } from 'src/common/enum/error-code.enum';
import { ApiException } from 'src/common/exception/api.exception';
import { Payload } from 'src/common/utils/type';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/auth.dto';

const ACCESS_TOKEN_EXPIRES_IN = parseInt(process.env.JWT_SECRET_KEY_EXPIRES_IN);
const REFRESH_TOKEN_EXPIRES_IN = parseInt(
  process.env.JWT_REFRESH_TOKEN_KEY_EXPIRES_IN,
);
const EXPIRE_TIME = ACCESS_TOKEN_EXPIRES_IN * 1000;
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly redis: RedisService,
    private readonly prisma: PrismaService,
  ) {}
  async login(dto: LoginDto) {
    const user = await this.vailidateUser(dto);
    const payload = {
      id: user.id,
      role: user.role,
    };
    const serverTokens = await this.generateTokens(payload);
    await this.redis.setData(
      `refreshToken:${user.id}`,
      serverTokens.refreshToken,
      REFRESH_TOKEN_EXPIRES_IN,
    );
    return {
      user,
      serverTokens,
    };
  }

  async refreshToken(oldRefreshToken: string, user: Payload) {
    const raceKey = `raceConditionHelper:${oldRefreshToken}`;
    const cached = await this.redis.getData(raceKey);

    if (cached) {
      return JSON.parse(cached);
    }

    const valid = await this.redis.getData(`refreshToken:${user.id}`);
    if (!valid || valid !== oldRefreshToken) {
      throw new ApiException(ErrorCode.INVALID_REFRESH_TOKEN);
    }

    const payload = {
      id: user.id,
      role: user.role,
    };

    const newTokens = await this.generateTokens(payload);

    await this.redis.setData(
      `refreshToken:${user.id}`,
      newTokens.refreshToken,
      REFRESH_TOKEN_EXPIRES_IN,
    );

    await this.redis.setData(raceKey, JSON.stringify(newTokens), 1);
    return newTokens;
  }

  private async generateTokens(payload: Payload) {
    return {
      accessToken: await this.jwtService.signAsync(payload, {
        expiresIn: ACCESS_TOKEN_EXPIRES_IN,
        secret: process.env.JWT_SECRET_KEY,
      }),
      refreshToken: await this.jwtService.signAsync(payload, {
        expiresIn: REFRESH_TOKEN_EXPIRES_IN,
        secret: process.env.JWT_REFRESH_TOKEN_KEY,
      }),
      expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
    };
  }

  private async vailidateUser(dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email);
    if (user && (await compareSync(dto.password, user.password))) {
      const { password, ...rest } = user;
      return rest;
    } else {
      throw new ApiException(ErrorCode.INCORRECT_EMAIL_OR_PASSWORD);
    }
  }

  async verifyToken(token: string) {
    const value = await this.redis.getData(token);
    if (value) {
      const email = value.split(':')[2];
      return { email };
    } else {
      throw new ApiException(ErrorCode.VERIFICATION_EMAIL_TOKEN_FAILED);
    }
  }

  async socialLogin(dto: CreateUserDto) {
    let user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) {
      user = await this.userService.signup(dto);
    }
    const payload = {
      id: user.id,
      role: user.role,
    };
    return {
      user,
      serverTokens: await this.generateTokens(payload),
    };
  }

  async logout(userId: string) {
    await this.redis.deleteData(`refreshToken:${userId}`);
    return null;
  }
}
