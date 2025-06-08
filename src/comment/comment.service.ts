import { Injectable } from '@nestjs/common';
import { ErrorCode } from 'src/common/enum/error-code.enum';
import { ApiException } from 'src/common/exception/api.exception';
import { PrismaService } from 'src/prisma/prisma.service';
import { CommentFilterDto } from './dto/comment-filter.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  async createComment(dto: CreateCommentDto, userId: string) {
    const { roomId, content } = dto;
    if (!userId) throw new ApiException(ErrorCode.UNAUTHORIZED);
    const comment = await this.prisma.comment.create({
      data: {
        content,
        roomId,
        userId,
      },
    });
    return comment;
  }

  async findCommentsByRoomId(dto: CommentFilterDto) {
    const { roomId, limit, page } = dto;

    const room = await this.prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!room) throw new ApiException(ErrorCode.ROOM_NOT_FOUND);

    if (page) {
      const comments = await this.prisma.comment.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
        skip: (page - 1) * limit,
        where: roomId ? { roomId } : {},
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });
      const totalCount = await this.prisma.comment.count({
        where: roomId ? { roomId } : {},
      });
      return {
        page,
        data: comments,
        totalCount,
        totalPage: Math.ceil(totalCount / limit),
      };
    } else {
      const totalCount = await this.prisma.comment.count({
        where: roomId ? { roomId } : {},
      });
      const comments = await this.prisma.comment.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        where: roomId ? { roomId } : {},
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });
      return {
        data: comments,
        totalCount,
      };
    }
  }

  async findCommentsAllByUserId(dto: CommentFilterDto, userId: string) {
    if (!userId) throw new ApiException(ErrorCode.UNAUTHORIZED);
    const { limit, page } = dto;

    if (page) {
      const comments = await this.prisma.comment.findMany({
        where: { userId },
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
        skip: (page - 1) * limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });
      const totalCount = await this.prisma.comment.count();
      return {
        page,
        data: comments,
        totalCount,
        totalPage: Math.ceil(totalCount / limit),
      };
    } else {
      const totalCount = await this.prisma.comment.count();
      const comments = await this.prisma.comment.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });
      return {
        data: comments,
        totalCount,
      };
    }
  }

  async findCommentById(id: string, userId: string) {
    if (!userId) throw new ApiException(ErrorCode.UNAUTHORIZED);
    const comment = await this.prisma.comment.findUnique({
      where: { id, userId },
    });
    if (!comment) {
      throw new ApiException(ErrorCode.COMMENT_NOT_FOUND);
    }
    return comment;
  }

  async updateComment(id: string, dto: UpdateCommentDto, userId: string) {
    const { content } = dto;
    if (!userId) throw new ApiException(ErrorCode.UNAUTHORIZED);
    const comment = await this.prisma.comment.findUnique({
      where: { id, userId },
    });
    if (!comment) {
      throw new ApiException(ErrorCode.COMMENT_NOT_FOUND);
    }
    const updatedComment = await this.prisma.comment.update({
      where: { id, userId },
      data: { content },
    });
    return updatedComment;
  }

  async deleteComment(id: string, userId: string) {
    if (!userId) throw new ApiException(ErrorCode.UNAUTHORIZED);
    const comment = await this.prisma.comment.findUnique({
      where: { id, userId },
    });
    if (!comment) {
      throw new ApiException(ErrorCode.COMMENT_NOT_FOUND);
    }
    await this.prisma.comment.delete({
      where: { id, userId },
    });
    return null;
  }
}
