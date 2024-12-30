import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto';
import { AuthService } from './auth.service';
import RequestWithUser from './RequestWithUser.interface';
import { LocalAuthenticationGuard } from './localAuth.guard';
import { Response } from 'express';
import JwtAuthenticationGuard from './jwt-auth.guard';
import UserService from 'src/users/user.service';

@Controller('auth')
@SerializeOptions({ strategy: 'excludeAll' })
export class AuthController {
  constructor(
    private readonly authservice: AuthService,
    private readonly userservice: UserService,
  ) {}
  @Post('signup')
  signup(@Body() signupdata: CreateUserDto) {
    return this.authservice.signup(signupdata);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('signin')
  async logIn(@Req() request: RequestWithUser) {
    const { user } = request;
    const cookie = this.authservice.getCookieWithJwtToken(user.id);
    const { RefreshCookie, Refreshtoken } =
      this.authservice.getCookieWithRefreshToken(user.id);
    await this.userservice.setCurrentRefreshToken(Refreshtoken, user.id);
    request.res.setHeader('Set-Cookie', [cookie, RefreshCookie]);
    return user;
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('logout')
  async logOut(@Req() request: RequestWithUser, @Res() response: Response) {
    response.setHeader('Set-Cookie', this.authservice.getCookieForLogOut());
    return response.sendStatus(200);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  authenticate(@Req() request: RequestWithUser) {
    const user = request.user;
    return user;
  }
}
