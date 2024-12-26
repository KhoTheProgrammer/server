import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto';
import { AuthService } from './auth.service';
import RequestWithUser from './RequestWithUser.interface';
import { LocalAuthenticationGuard } from './localAuth.guard';
import { Response } from 'express';
import JwtAuthenticationGuard from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authservice: AuthService) {}
  @Post('signup')
  signup(@Body() signupdata: CreateUserDto) {
    console.log(signupdata);
    return this.authservice.signup(signupdata);
  }

  @Post('signin')
  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  signin(@Req() request: RequestWithUser, @Res() response: Response) {
    const { user } = request;
    const cookie = this.authservice.getCookieWithJwtToken(user.id);
    response.setHeader('Set-Cookie', cookie);
    user.password = undefined;
    return response.send(user);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('log-out')
  async logOut(@Req() request: RequestWithUser, @Res() response: Response) {
    response.setHeader('Set-Cookie', this.authservice.getCookieForLogOut());
    return response.sendStatus(200);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  authenticate(@Req() request: RequestWithUser) {
    const user = request.user;
    user.password = undefined;
    return user;
  }
}
