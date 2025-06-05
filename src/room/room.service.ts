import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { ErrorCode } from 'src/common/enum/error-code.enum';
import { ApiException } from 'src/common/exception/api.exception';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRoomDto } from './dto/create-room.dto';
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
        comments: true,
      },
    });
    if (!room) {
      throw new ApiException(ErrorCode.ROOM_NOT_FOUND);
    }
    return room;
  }

  async createRoom(dto: CreateRoomDto, userId: string) {
    if (!userId) throw new ApiException(ErrorCode.UNAUTHORIZED);
    const { categoryId, images, ...rest } = dto;

    return this.prisma.$transaction(async (prisma) => {
      const category = await prisma.category.findUnique({
        where: {
          id: dto.categoryId,
        },
      });
      if (!category) {
        throw new ApiException(ErrorCode.CATEGORY_NOT_FOUND);
      }
      const room = await prisma.room.create({
        data: {
          ...rest,
          category: {
            connect: { id: dto.categoryId },
          },
          user: {
            connect: { id: userId },
          },
        },
      });
      const roomId = room.id.toString();
      const imagesArr: string[] = await this.savedImages(roomId, images);

      if (imagesArr.length > 0) {
        await prisma.image.createMany({
          data: imagesArr.map((url) => ({
            url,
            roomId: room.id,
          })),
        });
      }

      return prisma.room.findUnique({
        where: { id: room.id },
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
    });
  }

  private async savedImages(id: string, images: string[]) {
    const existingImages = await this.prisma.image.findMany({
      where: { roomId: Number(id) },
      select: { url: true },
    });
    const existingUrls = existingImages.map((img) => img.url);
    const imagesToDelete = existingUrls.filter((url) => !images.includes(url));
    const imagesToAdd = images.filter((url) => !existingUrls.includes(url));

    for (const oldImageUrl of imagesToDelete) {
      const imageFilename = path.basename(oldImageUrl);
      const imagePath = path.join(
        process.cwd(),
        'uploads/images/rooms',
        id,
        imageFilename,
      );

      try {
        await fs.promises.unlink(imagePath);
      } catch (error) {
        throw new ApiException(ErrorCode.IMAGE_FILES_MOVE_ERROR);
      }

      await this.prisma.image.deleteMany({
        where: { url: oldImageUrl, id },
      });
    }

    const movedImages = [];
    const dir = path.join(process.cwd(), 'uploads/images', id);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    for (const image of imagesToAdd) {
      const imageFilename = path.basename(image);
      const newImageFilename = `${id}_${Date.now()}_${imageFilename}`;
      const imageTempPath = path.join(
        process.cwd(),
        'uploads/temp',
        imageFilename,
      );
      const imageFinalPath = path.join(dir, newImageFilename);

      try {
        await fs.promises.rename(imageTempPath, imageFinalPath);
        movedImages.push(
          `${process.env.SERVER_URL}/uploads/images/rooms/${id}/${newImageFilename}`,
        );
      } catch (error) {
        throw new ApiException(ErrorCode.IMAGE_FILES_MOVE_ERROR);
      }
    }
    return movedImages;
  }
}
