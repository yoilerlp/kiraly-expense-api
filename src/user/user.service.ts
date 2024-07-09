import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { User } from '@/entities';
import {
  CreateUserDto,
  UpdatePasswordDto,
  VerifyUserDto,
} from './dto/create-user.dto';
import { hashPassword } from '@/common/helper/password';
import { OtpService } from '@/otp/otp.service';
import { MailService } from '@/mail/mail.service';
import { OTPType } from '@/otp/interfaces/otp.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private otpService: OtpService,
    private dataSource: DataSource,
    private mailService: MailService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { password, ...userToCreateBody } = createUserDto;

      const hashedPassword = await hashPassword(password);

      const user = this.userRepository.create({
        ...userToCreateBody,
        password: hashedPassword,
      });

      await queryRunner.manager.save(user);

      const { otpItem, code } = await this.otpService.generateOTP(user.id);

      await queryRunner.manager.save(otpItem);

      await this.mailService.sendMail({
        to: user.email,
        subject: `Registration OTP - ${user.email}`,
        html: `<h1>Your OTP is ${code} valid for 1 hour</h1>`,
      });

      await queryRunner.commitTransaction();

      return user;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.handleError(error);
    } finally {
      await queryRunner.release();
    }
  }

  async verifyOtp(verifyUserDto: VerifyUserDto) {
    const user = await this.getUserByEmail(verifyUserDto.email);

    const { isMatch: isValidOtp } = await this.otpService.verifyOTP({
      otp: verifyUserDto.otp,
      user,
    });

    if (!isValidOtp) {
      throw new BadRequestException('Invalid OTP');
    }

    try {
      user.isActive = true;
      await this.userRepository.save(user);
      await this.otpService.deleteOTP(user.id);

      return {
        message: 'User verified successfully',
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async resentOtp(email: string) {
    const user = await this.getUserByEmail(email);

    const { otpItem, code } = await this.otpService.generateOTP(user.id);

    try {
      await this.otpService.deleteOTP(user.id);

      await this.otpService.createOTP(otpItem);

      await this.mailService.sendMail({
        to: user.email,
        subject: `Resend OTP - ${user.email}`,
        html: `<h1>Your OTP is ${code} valid for 1 hour</h1>`,
      });

      return {
        message: 'OTP resent successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException("Can't resend OTP");
    }
  }

  async sendRecoveryEmail(email: string) {
    const user = await this.getUserByEmail(email);

    if (!user.isActive) throw new BadRequestException('User is not active');
    try {
      const { otpItem, code } = await this.otpService.generateOTP(
        user.id,
        OTPType.FORGOT_PASSWORD,
      );

      await this.otpService.createOTP(otpItem);

      await this.mailService.sendMail({
        to: email,
        subject: 'Recovery password',
        html: `
        <h1>Recovery password opt code</h1>
        <h2>
          code: ${code}
        </h2>
        <strong>El token expirara en 10 minutos</strong>
        url: URLTOFRONTEND
      `,
      });

      return {
        message: 'Recovery email sent',
      };
    } catch (error) {
      console.log(error);

      throw new InternalServerErrorException("Can't send recovery email");
    }
  }

  async updatePassword({ password, otp, email }: UpdatePasswordDto) {
    const user = await this.getUserByEmail(email);

    const { isMatch, otpItem } = await this.otpService.verifyOTP({
      otp,
      user,
    });

    if (otpItem.type !== OTPType.FORGOT_PASSWORD || !isMatch) {
      throw new BadRequestException('Invalid  OTP');
    }

    const newPassword = await hashPassword(password);

    await this.otpService.deleteOTP(user.id);

    this.userRepository.update({ id: user.id }, { password: newPassword });
    return {
      message: 'Password updated',
    };
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user;
  }
  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user;
  }

  private handleError(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException('User already exists');
    }
    throw new InternalServerErrorException();
  }
}
