import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

@Module({
  imports: [CommonModule],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
