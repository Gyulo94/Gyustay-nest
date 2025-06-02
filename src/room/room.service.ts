import { Injectable } from '@nestjs/common';
import { ErrorCode } from 'src/common/enum/error-code.enum';
import { ApiException } from 'src/common/exception/api.exception';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoomFilterDto } from './dto/room-filter.dto';

@Injectable()
export class RoomService {
  constructor(private readonly prisma: PrismaService) {}

  async findRoomsAll(dto?: RoomFilterDto) {
    const { category, page, limit } = dto ?? {};
    if (page) {
      const count = await this.prisma.room.count();
      const rooms = await this.prisma.room.findMany({
        orderBy: {
          id: 'asc',
        },
        take: limit,
        skip: (page - 1) * limit,
        where: {
          category: {
            name: category,
          },
        },
        include: {
          category: {
            select: {
              name: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              image: true,
              email: true,
            },
          },
          images: {
            select: {
              url: true,
            },
          },
        },
      });
      return {
        page,
        data: rooms,
        totalCount: count,
        totalPage: Math.ceil(count / limit),
      };
    } else {
      return {
        data: await this.prisma.room.findMany({
          include: {
            category: {
              select: {
                name: true,
              },
            },
            user: {
              select: {
                id: true,
                name: true,
                image: true,
                email: true,
              },
            },
            images: {
              select: {
                url: true,
              },
            },
          },
        }),
      };
    }
  }

  async findRoomById(id: string, userId?: string) {
    const room = await this.prisma.room.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
        likes: {
          where: userId ? { userId } : {},
        },
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          },
        },
        images: {
          select: {
            url: true,
          },
        },
      },
    });
    if (!room) {
      throw new ApiException(ErrorCode.ROOM_NOT_FOUND);
    }
    return room;
  }
}
