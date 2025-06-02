import { Body, Controller, Get, Param, Query } from '@nestjs/common';
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

  @Public()
  @Get('/map')
  async findRoomsInMap() {
    return this.roomService.findRoomsAll();
  }

  @Public()
  @Get('/:id')
  async findRoomById(@Param('id') id: string, @Body('userId') userId?: string) {
    return this.roomService.findRoomById(id, userId);
  }
}
