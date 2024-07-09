import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Version,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login.dto';
import { Public } from './decorators/auth.decorator';
import { GetUser } from '@/common/decorators/user';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.loginUser(loginUserDto);
  }

  @Get('token-info')
  tokenInfo(@GetUser() user: any) {
    return this.authService.getTokenInfo(user);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Version('2')
  @Post('login')
  loginV2() {
    return 'login en la version dos';
  }
}
