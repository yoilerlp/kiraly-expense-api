import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PushToken } from './entities/push-token.entity';
import { User } from '@/entities';
import { ExpoServerClientProvider } from './providers/ExpoServerClient';

@Module({
  imports: [TypeOrmModule.forFeature([PushToken, User])],
  providers: [NotificationService, ExpoServerClientProvider],
  controllers: [NotificationController],
  exports: [ExpoServerClientProvider],
})
export class NotificationModule {}
