import { Injectable } from '@nestjs/common';
import { ErrorCode } from 'src/common/enum/error-code.enum';
import { ApiException } from 'src/common/exception/api.exception';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LikeService {
  constructor(private readonly prisma: PrismaService) {}
  async toggleLike(roomId: number, userId: string) {
    if (!userId) throw new ApiException(ErrorCode.UNAUTHORIZED);

    let like = await this.prisma.like.findFirst({
      where: {
        roomId,
        userId,
      },
    });

    if (like) {
      await this.prisma.like.delete({
        where: {
          id: like.id,
        },
      });
      return {
        message: '찜 목록에서 삭제되었습니다.',
      };
    } else {
      const created = await this.prisma.like.create({
        data: {
          roomId,
          userId,
        },
      });
      return {
        message: '찜 목록에 추가되었습니다.',
      };
    }
  }
}
