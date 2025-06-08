import { Injectable } from '@nestjs/common';
import { compareSync, hashSync } from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';
import { ErrorCode } from 'src/common/enum/error-code.enum';
import { ApiException } from 'src/common/exception/api.exception';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async signup(dto: CreateUserDto) {
    const { token, provider, ...res } = dto;
    const user = await this.prisma.user.findUnique({
      where: { email: res.email },
    });
    if (user) {
      throw new ApiException(ErrorCode.USER_ALREADY_EXISTS);
    }
    const newUser = await this.prisma.user.create({
      data: {
        ...res,
        id: provider ? undefined : dto.id,
        provider: provider ? provider : undefined,
        password: provider ? '' : await hashSync(dto.password, 10),
      },
    });
    if (provider !== 'google' && provider !== 'kakao') {
      const redisData = await this.redis.getData(token);
      if (!redisData) {
        throw new ApiException(ErrorCode.VERIFICATION_EMAIL_TOKEN_FAILED);
      }
      await this.redis.deleteData(dto.token);
    }

    return user;
  }

  async resetPassword(dto: ResetPasswordDto) {
    const { token, password, email } = dto;
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      console.log('사용자를 찾을 수 없습니다.');

      throw new ApiException(ErrorCode.USER_NOT_FOUND);
    }
    if (user && compareSync(password, user.password)) {
      console.log('비밀번호가 동일합니다.');

      throw new ApiException(ErrorCode.SAME_ORIGINAL_PASSWORD);
    }

    await this.prisma.user.update({
      where: {
        email,
      },
      data: {
        password: await hashSync(password, 10),
      },
    });
    const redisData = await this.redis.getData(token);
    if (!redisData) {
      console.log('토큰이 유효하지 않습니다.');
      throw new ApiException(ErrorCode.VERIFICATION_EMAIL_TOKEN_FAILED);
    }
    await this.redis.deleteData(token);
    return null;
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new ApiException(ErrorCode.USER_NOT_FOUND);
    }
    return user;
  }

  async getMe(userId: string) {
    if (!userId) throw new ApiException(ErrorCode.USER_NOT_FOUND);

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        description: true,
        provider: true,
      },
    });

    return user;
  }

  async editUser(dto: UpdateUserDto, userId: string) {
    const { name, description, image } = dto;
    if (!userId) {
      throw new ApiException(ErrorCode.REQUIRED_LOGIN);
    }

    return this.prisma.$transaction(async (prisma) => {
      const updateUser = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          name,
          description,
        },
      });

      if (
        !image ||
        image === updateUser.image ||
        !image.includes('/uploads/temp/')
      ) {
        return null;
      }

      if (updateUser.image && updateUser.image !== image) {
        try {
          const oldImagePath = updateUser.image.replace(
            `${process.env.SERVER_URL}/`,
            '',
          );
          const oldImageFullPath = path.join(process.cwd(), oldImagePath);
          if (fs.existsSync(oldImageFullPath)) {
            await fs.promises.unlink(oldImageFullPath);
          }
        } catch (error) {
          throw new ApiException(ErrorCode.IMAGE_FILES_MOVE_ERROR);
        }
      }

      const updateUserId = updateUser.id;
      const userDir = path.join(process.cwd(), 'uploads/users', updateUserId);
      if (!fs.existsSync(userDir)) {
        fs.mkdirSync(userDir, { recursive: true });
      }

      const imageFilename = path.basename(image);
      const ext = path.extname(imageFilename);
      const newImageFilename = `${updateUser.name}_${Date.now()}${ext}`;
      const imageTempPath = path.join(
        process.cwd(),
        'uploads/temp',
        imageFilename,
      );

      const imageFinalPath = path.join(userDir, newImageFilename);

      if (!fs.existsSync(imageTempPath)) {
        return null;
      }

      try {
        await fs.promises.rename(imageTempPath, imageFinalPath);
        const userImagePath = `${process.env.SERVER_URL}/uploads/users/${updateUserId}/${newImageFilename}`;
        const newUser = await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            image: userImagePath,
          },
        });
        return newUser;
      } catch (error) {
        throw new ApiException(ErrorCode.IMAGE_FILES_MOVE_ERROR);
      }
    });
  }
}
