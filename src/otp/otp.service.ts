/* eslint-disable @typescript-eslint/no-var-requires */
import { comparePassword, hashPassword } from '@/common/helper/password';
import { OTP, User } from '@/entities';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OTPType } from './interfaces/otp.interface';
const crypto = require('crypto');

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(OTP)
    private readonly otpRepository: Repository<OTP>,
  ) {}

  async generateOTP(userId: string, type: OTPType = OTPType.VERIFY_USER) {
    const minutesOfExpiry = 60;
    const otp = crypto.randomInt(100000, 999999).toString();

    const otpHash = await hashPassword(otp);
    const expiresAt = new Date();

    expiresAt.setMinutes(expiresAt.getMinutes() + minutesOfExpiry);

    // 10 minutes for forgot password
    if (type === OTPType.FORGOT_PASSWORD) {
      expiresAt.setMinutes(expiresAt.getMinutes() + 10);
    }

    const otpItem = this.otpRepository.create({
      code: otpHash,
      expiresAt,
      userId,
      type,
    });

    return {
      otpItem,
      code: otp,
    };
  }

  async createOTP(otpIOtem: OTP) {
    await this.deleteOTP(otpIOtem.userId);
    await this.otpRepository.save(otpIOtem);
  }

  async verifyOTP({ user, otp }: { user: User; otp: string }) {
    const otpItem = await this.otpRepository.findOneBy({
      userId: user.id,
    });

    if (!otpItem) {
      throw new BadRequestException('Invalid OTP');
    }

    if (otpItem.expiresAt < new Date()) {
      throw new BadRequestException('OTP expired');
    }

    const isMatch = await comparePassword(otp, otpItem.code);

    return {
      isMatch,
      otpItem,
    };
  }

  async deleteOTP(userId: string) {
    await this.otpRepository.delete({
      userId,
    });
  }
}
