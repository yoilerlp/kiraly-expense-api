import { Controller, Post, Body, Delete, Param } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { SavePushTokenDto } from './dto/save-push-token.dto';
import { GetUser } from '@/common/decorators/user';
import { IUserToken } from '@/common/interface/userToken';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('token')
  saveToken(@Body() dto: SavePushTokenDto) {
    return this.notificationService.saveToken(dto);
  }

  @Delete('token/:token')
  removeToken(@Param('token') token: string, @GetUser() user: IUserToken) {
    return this.notificationService.removeToken(token, user.userId);
  }

  @Post('send/:userId')
  sendTestNotification(@Param('userId') userId: string) {
    return this.notificationService.sendNotificationToUser({
      userId: userId,
      title: 'Test Notification desde mi back',
      message: 'This is a test notification',
    });
  }
}
