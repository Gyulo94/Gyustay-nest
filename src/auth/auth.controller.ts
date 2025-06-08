import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import { Message } from 'src/common/decorator/message.decorator';
import { ResponseMessage } from 'src/common/enum/response-message.enum';
import { Payload } from 'src/common/utils/type';
import { EmailService } from 'src/email/email.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ResetPasswordDto } from 'src/user/dto/reset-password.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { Public } from './decorator/public.decorator';
import { LoginDto } from './dto/auth.dto';
import { RefreshJwtGuard } from './guards/refresh.guard';

@Public()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly emailService: EmailService,
  ) {}

  @Post('signup')
  @Message(ResponseMessage.SIGNUP_SUCCESS)
  async signup(@Body() dto: CreateUserDto) {
    return await this.userService.signup(dto);
  }

  @Post('reset-password')
  @Message(ResponseMessage.RESET_PASSWORD_SUCCESS)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    console.log('dto', dto);

    return await this.userService.resetPassword(dto);
  }

  @Post('login')
  @Message(ResponseMessage.LOGIN_SUCCESS)
  async login(@Body() dto: LoginDto) {
    return await this.authService.login(dto);
  }

  @Get('verify-token')
  async verifyToken(@Query('token') token: string) {
    return await this.authService.verifyToken(token);
  }

  @Post('send-signup-email')
  @Message(ResponseMessage.SEND_EMAIL_SUCCESS)
  async sendSignupEmail(@Body('email') email: string) {
    return await this.emailService.sendVerificationMail(email, 'signup');
  }

  @Post('send-reset-password-email')
  @Message(ResponseMessage.SEND_EMAIL_SUCCESS)
  async sendResetPasswordEmail(@Body('email') email: string) {
    return await this.emailService.sendVerificationMail(email, 'reset');
  }

  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  async refresh(@CurrentUser() user: Payload) {
    return await this.authService.refreshToken(user);
  }

  @Post('social-login')
  @Message(ResponseMessage.LOGIN_SUCCESS)
  async socialLogin(@Body() dto: CreateUserDto) {
    return await this.authService.socialLogin(dto);
  }
}
