import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Public } from 'src/auth/decorator/public.decorator';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import { Message } from 'src/common/decorator/message.decorator';
import { ResponseMessage } from 'src/common/enum/response-message.enum';
import { Payload } from 'src/common/utils/type';
import { CommentService } from './comment.service';
import { commentFilterDto } from './dto/comment-filter.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @Message(ResponseMessage.COMMENT_CREATE_SUCCESS)
  createComment(@Body() dto: CreateCommentDto, @CurrentUser() user: Payload) {
    return this.commentService.createComment(dto, user.id);
  }

  @Public()
  @Get('all')
  findCommentsByRoomId(@Query() dto: commentFilterDto) {
    console.log('dto', dto);

    return this.commentService.findCommentsByRoomId(dto);
  }
}
