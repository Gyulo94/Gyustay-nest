import { Controller, Get, Query } from '@nestjs/common';
import { Public } from 'src/auth/decorator/public.decorator';
import { RoomFilterDto } from './dto/room-filter.dto';
import { RoomService } from './room.service';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Public()
  @Get('/all')
  async findRoomsAll(@Query() dto: RoomFilterDto) {
    return this.roomService.findRoomsAll(dto);
  }
}
