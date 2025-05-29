import { Controller, Get } from '@nestjs/common';
import { Public } from 'src/auth/decorator/public.decorator';
import { RoomService } from './room.service';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Public()
  @Get('/all')
  async findRoomsAll() {
    return this.roomService.findRoomsAll();
  }
}
