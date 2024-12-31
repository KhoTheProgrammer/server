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
import { LocalAuthenticationGuard } from './Guard/localAuth.guard';
import { Response } from 'express';
import JwtAuthenticationGuard from './Guard/jwt-auth.guard';
import UserService from 'src/users/user.service';
import { JwtRefreshGuard } from './Guard/jwtRefresh.guard';

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
  async logOut(@Req() request: RequestWithUser) {
    await this.userservice.removeRefreshToken(request.user.id);
    request.res.setHeader('Set-Cookie', this.authservice.getCookiesForLogOut());
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  authenticate(@Req() request: RequestWithUser) {
    const user = request.user;
    return user;
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Req() request: RequestWithUser) {
    const accessTokenCookie = this.authservice.getCookieWithJwtToken(
      request.user.id,
    );
    request.res.setHeader('Set-Cookie', accessTokenCookie);
    return request.user;
  }
}
