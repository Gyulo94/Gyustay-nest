import { Body, Controller, Get, Put } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import { Message } from 'src/common/decorator/message.decorator';
import { ResponseMessage } from 'src/common/enum/response-message.enum';
import { Payload } from 'src/common/utils/type';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async getMe(@CurrentUser() user: Payload) {
    return this.userService.getMe(user.id);
  }

  @Put('edit')
  @Message(ResponseMessage.USER_EDIT_SUCCESS)
  async editUser(@CurrentUser() user: Payload, @Body() dto: UpdateUserDto) {
    return this.userService.editUser(dto, user.id);
  }
}
