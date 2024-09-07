import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { validate } from '@/common/helper/env.validation';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import * as Entities from '@/entities';
import { MailModule } from './mail/mail.module';
import { OtpModule } from './otp/otp.module';
import { AccountModule } from './account/account.module';
import { CategoryModule } from './category/category.module';
import { FileModule } from './file/file.module';
import { TransactionModule } from './transaction/transaction.module';
import { TransferModule } from './transfer/transfer.module';
import { BudgetModule } from './budget/budget.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { StatisticsModule } from './statistics/statistics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
      isGlobal: true,
      // envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      useFactory(config: ConfigService) {
        return {
          type: 'postgres',
          host: config.get('DB_HOST'),
          port: config.get('DB_PORT'),
          username: config.get('DB_USERNAME'),
          password: config.get('DB_PASSWORD'),
          database: config.get('DB_NAME'),
          entities: Entities,
          synchronize: true,
          retryAttempts: 3,
          useUTC: true,
          timezone: 'Z',
          // ssl: true,
          // logger: 'file',
          // logging: 'all',
          // dropSchema: true,
        };
      },
      inject: [ConfigService],
    }),

    EventEmitterModule.forRoot(),

    MailModule.registerAsync(),

    UserModule,

    AuthModule,

    OtpModule,

    AccountModule,

    CategoryModule,

    FileModule,

    TransactionModule,

    TransferModule,

    BudgetModule,

    StatisticsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
