import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import { Payload } from 'src/common/utils/type';
import { LikeFilterDto } from './dto/like-filter.dto';
import { LikeService } from './like.service';

@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post()
  async toggleLike(
    @Body('roomId') roomId: number,
    @CurrentUser() user: Payload,
  ) {
    return this.likeService.toggleLike(roomId, user.id);
  }

  @Get('all')
  async findLikesAllByUserId(
    @Query() dto: LikeFilterDto,
    @CurrentUser() user: Payload,
  ) {
    return this.likeService.findLikesAllByUserId(dto, user.id);
  }
}
