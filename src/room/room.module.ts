import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';

@Module({
  imports: [CommonModule],
  controllers: [RoomController],
  providers: [RoomService],
})
export class RoomModule {}
