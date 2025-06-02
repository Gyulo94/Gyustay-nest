import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { LikeController } from './like.controller';
import { LikeService } from './like.service';

@Module({
  imports: [CommonModule],
  controllers: [LikeController],
  providers: [LikeService],
})
export class LikeModule {}
