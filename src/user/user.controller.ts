import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  ParseFilePipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  CreateUserDto,
  ResentOtpDto,
  UpdatePasswordDto,
  UpdateUserDto,
  VerifyUserDto,
} from './dto/create-user.dto';
import { Public } from '@/auth/decorators/auth.decorator';
import { BasicFileInterceptor } from '@/common/interceptors/file';
import { GetUser } from '@/common/decorators/user';
import { IUserToken } from '@/common/interface/userToken';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Public()
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
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

  @Patch('update-profile')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    BasicFileInterceptor({
      sizeInMb: 5,
    }),
  )
  updateProfile(
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        errorHttpStatusCode: 400,
      }),
    )
    file: Express.Multer.File,
    @Body() updateUserDto: UpdateUserDto,
    @GetUser() user: IUserToken,
  ) {
    return this.userService.updateUser({
      photo: file,
      data: updateUserDto,
      userId: user.userId,
    });
  }
}
