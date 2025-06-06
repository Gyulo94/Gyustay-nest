import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { Public } from 'src/auth/decorator/public.decorator';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import { Message } from 'src/common/decorator/message.decorator';
import { ResponseMessage } from 'src/common/enum/response-message.enum';
import { Payload } from 'src/common/utils/type';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomFilterDto } from './dto/room-filter.dto';
import { RoomService } from './room.service';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Public()
  @Get('all')
  async findRoomsAll(@Query() dto: RoomFilterDto) {
    return this.roomService.findRoomsAll(dto);
  }

  @Public()
  @Get('map')
  async findRoomsInMap() {
    return this.roomService.findRoomsInMap();
  }
  @Get('userId')
  async findRoomsByUserId(
    @Query() dto: RoomFilterDto,
    @CurrentUser() user: Payload,
  ) {
    return this.roomService.findRoomsByUserId(dto, user.id);
  }

  @Public()
  @Get(':id')
  async findRoomById(@Param('id') id: string, @Body('userId') userId?: string) {
    return this.roomService.findRoomById(id, userId);
  }

  @Post()
  @Message(ResponseMessage.ROOM_CREATE_SUCCESS)
  async createRoom(@Body() dto: CreateRoomDto, @CurrentUser() user: Payload) {
    return this.roomService.createRoom(dto, user.id);
  }
}
