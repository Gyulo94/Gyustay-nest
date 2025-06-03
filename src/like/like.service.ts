import { Injectable } from '@nestjs/common';
import { ErrorCode } from 'src/common/enum/error-code.enum';
import { ApiException } from 'src/common/exception/api.exception';
import { PrismaService } from 'src/prisma/prisma.service';
import { LikeFilterDto } from './dto/like-filter.dto';

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
      await this.prisma.like.create({
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

  async findLikesAllByUserId(dto: LikeFilterDto, userId: string) {
    if (!userId) throw new ApiException(ErrorCode.UNAUTHORIZED);
    const { page, limit } = dto;
    const totalCount = await this.prisma.like.count({
      where: {
        userId,
      },
    });
    const likes = await this.prisma.like.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        userId,
      },
      include: {
        room: {
          include: {
            images: {
              select: {
                url: true,
              },
            },
            category: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      page,
      data: likes,
      totalCount,
      totalPage: Math.ceil(totalCount / limit),
    };
  }
}
