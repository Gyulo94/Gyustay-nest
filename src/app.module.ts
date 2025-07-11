import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { JwtGuard } from './auth/guards/jwt.guard';
import { RoleGuard } from './auth/guards/role.guard';
import { BookingModule } from './booking/booking.module';
import { CommentModule } from './comment/comment.module';
import { CommonModule } from './common/common.module';
import { RequestMiddleware } from './common/utils/logger.middleware';
import { SchedulerConfig } from './common/utils/scheduler.config';
import { FileModule } from './file/file.module';
import { LikeModule } from './like/like.module';
import { PaymentModule } from './payment/payment.module';
import { RoomModule } from './room/room.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CommonModule,
    AuthModule,
    UserModule,
    RoomModule,
    FileModule,
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads/',
    }),
    LikeModule,
    CommentModule,
    BookingModule,
    PaymentModule,
    ServeStaticModule.forRoot(),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
    SchedulerConfig,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
