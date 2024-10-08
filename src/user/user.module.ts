import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { OTP, User } from '@/entities';
import { OtpModule } from '@/otp/otp.module';
import { FileModule } from '@/file/file.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, OTP]), OtpModule, FileModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
