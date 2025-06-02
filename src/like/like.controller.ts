import { Body, Controller, Post } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import { Payload } from 'src/common/utils/type';
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
}
