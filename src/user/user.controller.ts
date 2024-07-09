import { Body, Controller, HttpCode, HttpStatus, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import {
  CreateUserDto,
  ResentOtpDto,
  UpdatePasswordDto,
  VerifyUserDto,
} from './dto/create-user.dto';
import { Public } from '@/auth/decorators/auth.decorator';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Public()
  @Post('create')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('verify-otp')
  verifyOtp(@Body() verifyOtpDto: VerifyUserDto) {
    return this.userService.verifyOtp(verifyOtpDto);
  }
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('send-otp')
  resentOTP(@Body() resentOtpDto: ResentOtpDto) {
    return this.userService.resentOtp(resentOtpDto.email);
  }
  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  resetPassword(@Body() resetPasswordDto: ResentOtpDto) {
    return this.userService.sendRecoveryEmail(resetPasswordDto.email);
  }

  @Public()
  @Patch('update-password')
  @HttpCode(HttpStatus.OK)
  updatePassword(@Body() updatePasswordDto: UpdatePasswordDto) {
    return this.userService.updatePassword(updatePasswordDto);
  }
}
