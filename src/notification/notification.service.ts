import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PushToken } from './entities/push-token.entity';
import { Repository } from 'typeorm';
import { SavePushTokenDto } from './dto/save-push-token.dto';
import { User } from '@/entities';
import {
  ExpoServerClientProviderTokenName,
  type ExpoServerClient,
  type NotificationMessage,
} from './providers/ExpoServerClient';

import { Expo } from 'expo-server-sdk';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(PushToken)
    private pushTokenRepo: Repository<PushToken>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @Inject(ExpoServerClientProviderTokenName)
    private expoServerClient: ExpoServerClient,
  ) {}

  async saveToken(dto: SavePushTokenDto) {
    const user = await this.userRepo.findOne({ where: { id: dto.userId } });
    if (!user) throw new Error('User not found');

    // Evita duplicados
    const exists = await this.pushTokenRepo.findOne({
      where: { token: dto.token, user: { id: dto.userId } },
    });

    if (!exists) {
      const token = this.pushTokenRepo.create({ ...dto, user });
      return await this.pushTokenRepo.save(token);
    }

    return exists;
  }

  async removeToken(token: string, userId: string) {
    return this.pushTokenRepo.delete({ token, user: { id: userId } });
  }

  async getTokensByUser(userId: string) {
    return this.pushTokenRepo.find({ where: { user: { id: userId } } });
  }

  async sendNotificationToUser({
    userId,
    title,
    message,
    notificationSettings = {
      badge: 1,
      priority: 'high',
    },
  }: {
    userId: string;
    message: string;
    title: string;
    notificationSettings?: Partial<NotificationMessage>;
  }) {
    const tokens = await this.getTokensByUser(userId);

    const messages: NotificationMessage[] = tokens
      .filter((t) => Expo.isExpoPushToken(t.token))
      .map((t) => ({
        ...notificationSettings,
        to: t.token,
        title,
        body: message,
      }));

    // chunks of messages
    const chunks = this.expoServerClient.chunkPushNotifications(messages);

    // send chunks
    (async () => {
      for (const chunk of chunks) {
        try {
          const ticketChunk =
            await this.expoServerClient.sendPushNotificationsAsync(chunk);

          ticketChunk?.forEach((ticket) => {
            if (
              ticket.status === 'error' &&
              ticket.details?.error === 'DeviceNotRegistered'
            ) {
              const invalidToen = ticket.details?.expoPushToken;
              if (invalidToen) {
                this.pushTokenRepo.delete({ token: invalidToen });
              }
            }
          });
        } catch (error) {
          console.error(error);
        }
      }
    })();

    return 'Notification sent';
  }
}
