import { Injectable } from '@nestjs/common';
import { Room } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { ErrorCode } from 'src/common/enum/error-code.enum';
import { ApiException } from 'src/common/exception/api.exception';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomFilterDto } from './dto/room-filter.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomService {
  constructor(private readonly prisma: PrismaService) {}

  async findRoomsAll(dto?: RoomFilterDto) {
    const { category, page, limit } = dto;
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
  }

  async findRoomsInMap() {
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

  async findRoomById(id: string, userId?: string) {
    const room = await this.prisma.room.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        category: true,
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

  async findRoomsByUserId(dto: RoomFilterDto, userId: string) {
    const { category, page, limit } = dto;
    if (!userId) throw new ApiException(ErrorCode.UNAUTHORIZED);
    const count = await this.prisma.room.count({
      where: {
        userId,
      },
    });
    const rooms = await this.prisma.room.findMany({
      orderBy: {
        id: 'asc',
      },
      take: limit,
      skip: (page - 1) * limit,
      where: {
        userId,
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

  async updateRoom(id: number, dto: UpdateRoomDto, userId: string) {
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
      const room = await prisma.room.update({
        where: { id, userId },
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

  async deleteRoom(id: number, userId: string) {
    if (!userId) throw new ApiException(ErrorCode.UNAUTHORIZED);

    return this.prisma.$transaction(async (prisma) => {
      const room = await this.prisma.room.findUnique({
        where: { id, userId },
      });
      if (!room) {
        throw new ApiException(ErrorCode.ROOM_NOT_FOUND);
      }

      await prisma.image.deleteMany({
        where: { roomId: id },
      });

      await this.deletedImages([room]);

      await prisma.room.delete({
        where: { id, userId },
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
        if (error.code !== 'ENOENT') {
          throw new ApiException(ErrorCode.IMAGE_FILES_MOVE_ERROR);
        }
      }

      await this.prisma.image.deleteMany({
        where: { url: oldImageUrl, roomId: Number(id) },
      });
    }

    const movedImages = [];
    const dir = path.join(process.cwd(), 'uploads/images/rooms', id);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    for (const image of imagesToAdd) {
      if (image.includes('/uploads/temp/')) {
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
      } else {
        movedImages.push(image);
      }
    }
    return movedImages;
  }

  private async deletedImages(rooms: Room[]) {
    for (const room of rooms) {
      const dir = path.join(
        process.cwd(),
        'uploads/images/rooms',
        room.id.toString(),
      );
      try {
        if (fs.existsSync(dir)) {
          await fs.promises.rm(dir, { recursive: true, force: true });
        }
      } catch (error) {
        throw new ApiException(ErrorCode.IMAGE_FILES_MOVE_ERROR);
      }
    }
  }
}
