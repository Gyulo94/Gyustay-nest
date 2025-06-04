import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Public } from 'src/auth/decorator/public.decorator';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import { Message } from 'src/common/decorator/message.decorator';
import { ResponseMessage } from 'src/common/enum/response-message.enum';
import { Payload } from 'src/common/utils/type';
import { CommentService } from './comment.service';
import { CommentFilterDto } from './dto/comment-filter.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

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
  findCommentsByRoomId(@Query() dto: CommentFilterDto) {
    return this.commentService.findCommentsByRoomId(dto);
  }

  @Get('all/userId')
  findCommentsAllByUserId(
    @Query() dto: CommentFilterDto,
    @CurrentUser() user: Payload,
  ) {
    return this.commentService.findCommentsAllByUserId(dto, user.id);
  }

  @Get(':id')
  findCommentById(@Param('id') id: string, @CurrentUser() user: Payload) {
    return this.commentService.findCommentById(id, user.id);
  }

  @Put(':id')
  @Message(ResponseMessage.COMMENT_UPDATE_SUCCESS)
  updateComment(
    @Param('id') id: string,
    @Body() dto: UpdateCommentDto,
    @CurrentUser() user: Payload,
  ) {
    return this.commentService.updateComment(id, dto, user.id);
  }

  @Delete(':id')
  @Message(ResponseMessage.COMMENT_DELETE_SUCCESS)
  deleteComment(@Param('id') id: string, @CurrentUser() user: Payload) {
    return this.commentService.deleteComment(id, user.id);
  }
}
