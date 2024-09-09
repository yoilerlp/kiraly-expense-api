import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { comparePassword } from '@/common/helper/password';
import { UserService } from '@/user/user.service';
import { LoginUserDto } from './dto/login.dto';
import { USER_NO_ACTIVE } from './util';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async loginUser(loginUserDto: LoginUserDto) {
    const user = await this.usersService.getUserByEmail(loginUserDto.email);
    const { password, ...restUser } = user;
    if (!user.isActive) throw new UnauthorizedException(USER_NO_ACTIVE);

    const isMatch = await comparePassword(loginUserDto.password, password);
    if (!isMatch) throw new BadRequestException('Invalid credentials');

    return {
      access_token: this.jwtService.sign({
        userName: restUser.name,
        userId: restUser.id,
      }),

      user: restUser,
    };
  }

  async getTokenInfo(userToken: { userName: string; userId: string }) {
    try {
      const user = await this.usersService.getUserById(userToken.userId);
      delete user.password;
      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
