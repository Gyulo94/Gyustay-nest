import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RoomService {
  constructor(private readonly prisma: PrismaService) {}

  findRoomsAll() {
    return this.prisma.room.findMany({
      include: {
        user: true,
        category: true,
        images: true,
      },
    });
  }
}
